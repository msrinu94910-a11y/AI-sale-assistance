import re
import uuid
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.conversation import Conversation
from app.models.lead import Lead
from app.models.meeting import Meeting
from app.schemas.bot import (
    BotChatRequest,
    BotChatResponse,
    ExtractedEntities,
    LeadSyncStatus,
    BotQualifyRequest,
    BotQualifyResponse,
    BotBookRequest,
    BotBookResponse
)

class SalesBotService:
    """
    Dedicated API Sales Assistant Bot Service supporting:
    1. Multi-turn Session Management & Conversation History
    2. Dynamic Entity Extraction (Name, Email, Phone, Company, Budget, Timeline)
    3. Multi-Provider LLM Integration (Gemini, Groq, OpenAI)
    4. Resilient Offline Conversational Engine (Zero 429 Quota Failures)
    5. Automatic Lead Capture & Demo Meeting Scheduling
    """

    @classmethod
    def extract_entities(cls, text: str) -> ExtractedEntities:
        entities = ExtractedEntities()
        
        # 1. Email extraction
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        if email_match:
            entities.email = email_match.group(0).lower()

        # 2. Phone extraction
        phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}', text)
        if phone_match and len(re.sub(r'\D', '', phone_match.group(0))) >= 7:
            entities.phone = phone_match.group(0).strip()

        # 3. Name extraction
        name_patterns = [
            r"(?:my name is|i am|i'm|this is|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
            r"(?:name:\s*)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)"
        ]
        for pat in name_patterns:
            nm = re.search(pat, text, re.IGNORECASE)
            if nm:
                entities.name = nm.group(1).title()
                break

        # 4. Company extraction
        company_patterns = [
            r"(?:at|from|with|company is|work at|representing)\s+([A-Za-z0-9]+(?:\s+[A-Za-z0-9]+)?(?:\s+(?:Inc|LLC|Corp|Technologies|Tech|Systems|Solutions|Labs))?)",
            r"(?:company:\s*)([A-Za-z0-9]+(?:\s+[A-Za-z0-9]+)?)"
        ]
        for pat in company_patterns:
            cm = re.search(pat, text, re.IGNORECASE)
            if cm:
                candidate = cm.group(1).strip()
                if candidate.lower() not in ["the", "a", "our", "my", "this", "home", "work"]:
                    entities.company = candidate.title()
                    break

        # 5. Budget extraction
        budget_match = re.search(r'(\$\s?[\d,]+(?:k|m|k\b|m\b)?|\d+(?:,\d+)?\s*(?:k|thousand|million|crore|lakh|usd|dollars))', text, re.IGNORECASE)
        if budget_match:
            entities.budget = budget_match.group(0).strip()

        # 6. Timeline extraction
        timeline_match = re.search(r'(immediately|asap|this month|next month|q[1-4]|within\s+\d+\s+(?:days|weeks|months)|in\s+\d+\s+(?:weeks|months))', text, re.IGNORECASE)
        if timeline_match:
            entities.timeline = timeline_match.group(0).strip()

        return entities

    @classmethod
    def call_external_llm(cls, message: str, history: List[Dict[str, str]], context: Dict[str, Any]) -> Optional[str]:
        """
        Attempts to call available LLMs in order of preference:
        1. Google Gemini (Generous free tier)
        2. Groq Cloud (Free fast inference)
        3. OpenAI (Standard GPT model)
        Returns response string if successful, or None to fall back to internal engine.
        """
        system_prompt = (
            "You are SalesBot API, an elite enterprise B2B sales development representative. "
            "Your objective: qualify inbound leads using the BANT framework (Budget, Need, Authority, Timeline), "
            "answer product and pricing inquiries accurately, extract prospect details, and guide them to schedule a live product demo. "
            "Keep answers concise, confident, structured, and action-oriented."
        )

        import httpx

        # 1. Try Gemini API
        gemini_key = context.get("gemini_api_key") or settings.GEMINI_API_KEY
        if gemini_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
                contents = [{"role": "user", "parts": [{"text": f"{system_prompt}\n\nUser Question: {message}"}]}]
                with httpx.Client(timeout=6.0) as client:
                    resp = client.post(url, json={"contents": contents})
                    if resp.status_code == 200:
                        data = resp.json()
                        return data["candidates"][0]["content"]["parts"][0]["text"]
            except Exception:
                pass

        # 2. Try Groq API
        groq_key = context.get("groq_api_key") or settings.GROQ_API_KEY
        if groq_key:
            try:
                url = "https://api.groq.com/openai/v1/chat/completions"
                headers = {"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"}
                payload = {
                    "model": "llama3-8b-8192",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": message}
                    ],
                    "temperature": 0.6
                }
                with httpx.Client(timeout=6.0) as client:
                    resp = client.post(url, headers=headers, json=payload)
                    if resp.status_code == 200:
                        return resp.json()["choices"][0]["message"]["content"]
            except Exception:
                pass

        # 3. Try OpenAI API
        openai_key = context.get("openai_api_key") or settings.OPENAI_API_KEY
        if openai_key:
            try:
                url = "https://api.openai.com/v1/chat/completions"
                headers = {"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"}
                messages = [{"role": "system", "content": system_prompt}]
                # append recent history
                for h in history[-4:]:
                    messages.append({"role": h.get("role", "user"), "content": h.get("content", "")})
                messages.append({"role": "user", "content": message})

                payload = {
                    "model": settings.OPENAI_MODEL or "gpt-3.5-turbo",
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 400
                }
                with httpx.Client(timeout=6.0) as client:
                    resp = client.post(url, headers=headers, json=payload)
                    if resp.status_code == 200:
                        return resp.json()["choices"][0]["message"]["content"]
            except Exception:
                pass

        return None

    @classmethod
    def synthesize_conversational_response(
        cls, 
        message: str, 
        entities: ExtractedEntities, 
        history_count: int
    ) -> Tuple[str, str, List[str], int]:
        """
        Zero-failure conversational synthesizer with context awareness.
        Returns: (reply_text, intent, suggested_actions, score_delta)
        """
        msg_lower = message.lower()

        # Slot booking confirmation
        if any(p in msg_lower for p in ["morning slot", "afternoon slot", "book morning", "book afternoon", "confirm demo", "confirm slot"]) or ("slot" in msg_lower and ("morning" in msg_lower or "afternoon" in msg_lower)):
            slot_name = "Tomorrow Afternoon at 2:00 PM EST" if "afternoon" in msg_lower else "Tomorrow Morning at 10:30 AM EST"
            reply = (
                f"✅ Demo Confirmed! Your personalized Product Demo & Architecture Review is booked for **{slot_name}**.\n\n"
                f"• Calendar invitation and Zoom link generated.\n"
                f"• Agenda: Automated BANT Lead Scoring, API integration, and custom workflow setup.\n"
                f"• Our Solution Specialist will meet you directly on the call."
            )
            return reply, "demo_booked", ["View Scheduled Meetings", "Qualify Another Lead", "Compare Plans"], 30

        # Booking prompt / inquiry
        elif any(p in msg_lower for p in ["demo", "schedule", "meeting", "book", "call", "calendar", "appointment"]):
            reply = (
                "I would love to set you up with a live 1-on-1 Product Demo & Architecture Review with our senior solutions engineer.\n\n"
                "We have slots available this week. Which time works best for your schedule?\n"
                "• Morning Slot: Tomorrow at 10:30 AM EST\n"
                "• Afternoon Slot: Tomorrow at 2:00 PM EST"
            )
            return reply, "demo_scheduling_prompt", ["Book Morning Slot", "Book Afternoon Slot", "Open Demo Calendar"], 20

        # Pricing & plans
        elif any(p in msg_lower for p in ["price", "pricing", "cost", "plan", "quote", "tier", "subscription"]):
            reply = (
                "SalesBot AI offers flexible tiers designed for growing sales teams:\n\n"
                "1. Starter ($49 / user / month):\n"
                "   - Core BANT Lead Scoring Matrix\n"
                "   - Automated Lead Dashboard & Pipeline Tracking\n\n"
                "2. Professional ($99 / user / month):\n"
                "   - Conversational AI Assistant & 1-Click Calendar Booking\n"
                "   - Advanced Analytics & Automated Follow-up Sequences\n\n"
                "3. Enterprise (Custom Quote):\n"
                "   - Unlimited Seats, SSO, Dedicated SLA, and Custom REST API Integrations."
            )
            return reply, "pricing_inquiry", ["Book Demo for Pricing", "Request Enterprise Quote", "Compare Features"], 15

        # BANT scoring & qualification questions
        elif any(p in msg_lower for p in ["bant", "qualify", "qualification", "score", "scoring", "budget", "authority", "timeline"]):
            reply = (
                "Our automated BANT Qualification Engine scores prospects from 0 to 100:\n\n"
                "• Budget (25% weight): Purchasing capacity and investment readiness.\n"
                "• Need (30% weight): Business pain points and platform fit.\n"
                "• Authority (20% weight): Decision-maker level (C-level, VP, Manager).\n"
                "• Timeline (25% weight): Urgency to deploy within 30-90 days.\n\n"
                "Leads scoring 71+ are classified as 🔥 Hot Leads for immediate outreach."
            )
            return reply, "bant_explanation", ["Calculate BANT Score", "Filter Hot Leads", "Add New Lead"], 15

        # Email drafting
        elif any(p in msg_lower for p in ["email", "outreach", "draft", "template", "follow up"]):
            recipient = entities.name or "Prospect"
            company = entities.company or "your organization"
            reply = (
                f"Here is a customized outreach email draft for {recipient}:\n\n"
                f"Subject: Accelerating {company}'s Sales Pipeline with Automated AI Scoring\n\n"
                f"Hi {recipient},\n\n"
                f"I noticed your focus on scaling your sales pipeline. Teams using SalesBot AI have reduced "
                f"lead qualification time by 60% with automated BANT scoring and calendar booking.\n\n"
                f"I'd love to share a brief 15-minute walkthrough of how this integrates into your CRM.\n"
                f"Would Thursday at 2:00 PM or Friday at 10:30 AM work best for a quick chat?\n\n"
                f"Best regards,\nSales Development Team"
            )
            return reply, "email_draft", ["Book Morning Slot", "Book Afternoon Slot", "View All Leads"], 15

        # Greetings
        elif any(p in msg_lower for p in ["hi", "hello", "hey", "greetings", "good morning", "good afternoon"]) and len(message.split()) <= 4:
            reply = (
                "Hello! I am your AI Sales Assistant Bot. I can qualify inbound leads using our BANT scoring matrix, "
                "answer product and pricing questions, draft customized outreach emails, or book a live product demo. "
                "How can I help you accelerate sales today?"
            )
            return reply, "greeting", ["Find a Product Demo", "Explain BANT Scoring", "View Pricing Plans", "Calculate Lead Score"], 5

        # General open-ended query synthesis
        else:
            clean_text = re.sub(r'[^\w\s]', '', message)
            words = [w.capitalize() for w in clean_text.split() if len(w) > 3 and w.lower() not in ["what", "how", "this", "that", "there", "have", "with", "from", "your", "they", "about", "could", "would"]]
            topic = ", ".join(words[:3]) if words else "Sales Pipeline Automation"
            reply = (
                f"Analysis regarding '{topic}':\n\n"
                f"SalesBot AI delivers end-to-end sales intelligence by combining conversational discovery with "
                f"automated BANT lead qualification. You can query customer profiles, review pipeline metrics, "
                f"generate email sequences, or schedule a live architecture review."
            )
            return reply, "general_inquiry", ["Explain How This Works", "Draft Outreach Email", "Book Product Demo"], 10

    @classmethod
    def process_chat(cls, req: BotChatRequest, db: Session) -> BotChatResponse:
        session_id = req.session_id or f"session_{uuid.uuid4().hex[:12]}"
        msg = req.message.strip()

        # 1. Fetch recent session history for context
        history_records = db.query(Conversation).filter(
            Conversation.session_id == session_id
        ).order_by(Conversation.timestamp.asc()).all()

        formatted_history = [
            {"role": "user" if h.sender == "user" else "assistant", "content": h.message}
            for h in history_records
        ]

        # 2. Extract entities
        entities = cls.extract_entities(msg)

        # 3. Attempt External LLM first (Gemini / Groq / OpenAI)
        llm_reply = cls.call_external_llm(msg, formatted_history, req.context or {})
        
        if llm_reply:
            reply = llm_reply
            intent = "llm_generated"
            suggested_actions = ["Schedule Demo", "Calculate BANT Score", "View Pricing Plans"]
            score_change = 10
        else:
            # Fall back to zero-failure conversational engine
            reply, intent, suggested_actions, score_change = cls.synthesize_conversational_response(
                msg, entities, len(history_records)
            )

        # 4. Handle Lead Synchronization
        lead_obj: Optional[Lead] = None
        if req.lead_id:
            lead_obj = db.query(Lead).filter(Lead.id == req.lead_id).first()
        elif entities.email:
            lead_obj = db.query(Lead).filter(Lead.email == entities.email).first()
            if not lead_obj:
                # Automatically create captured lead!
                lead_obj = Lead(
                    name=entities.name or "Inbound Prospect",
                    email=entities.email,
                    phone=entities.phone,
                    company=entities.company or "Enterprise Account",
                    status="Contacted",
                    score=60,
                    category="Warm",
                    notes=f"Auto-captured via SalesBot API in session {session_id}"
                )
                db.add(lead_obj)
                db.commit()
                db.refresh(lead_obj)

        # 5. Handle Automatic Meeting Creation if intent is demo_booked
        if intent == "demo_booked":
            meeting_date = datetime.now(timezone.utc) + timedelta(days=1, hours=4)
            lead_name = lead_obj.name if lead_obj else (entities.name or "Inbound Prospect")
            lead_id_val = lead_obj.id if lead_obj else None
            meeting = Meeting(
                lead_id=lead_id_val,
                lead_name=lead_name,
                title="Sales AI Demo & Architecture Review",
                meeting_date=meeting_date,
                duration_minutes=30,
                status="Scheduled",
                notes=f"Booked via SalesBot API chat. Session: {session_id}"
            )
            db.add(meeting)
            db.commit()

        # 6. Save Turn to Database
        user_turn = Conversation(
            session_id=session_id,
            lead_id=lead_obj.id if lead_obj else req.lead_id,
            sender="user",
            message=msg,
            intent=intent,
            timestamp=datetime.now(timezone.utc)
        )
        assistant_turn = Conversation(
            session_id=session_id,
            lead_id=lead_obj.id if lead_obj else req.lead_id,
            sender="assistant",
            message=reply,
            intent=intent,
            timestamp=datetime.now(timezone.utc)
        )
        db.add(user_turn)
        db.add(assistant_turn)
        db.commit()

        lead_sync = None
        if lead_obj:
            lead_sync = LeadSyncStatus(
                lead_id=lead_obj.id,
                name=lead_obj.name,
                email=lead_obj.email,
                company=lead_obj.company,
                status=lead_obj.status,
                score=lead_obj.score,
                category=lead_obj.category
            )

        return BotChatResponse(
            reply=reply,
            intent=intent,
            session_id=session_id,
            extracted_entities=entities,
            suggested_actions=suggested_actions,
            lead=lead_sync,
            score_change=score_change,
            timestamp=datetime.now(timezone.utc)
        )

    @classmethod
    def qualify_prospect(cls, req: BotQualifyRequest, db: Session) -> BotQualifyResponse:
        # BANT weights: Budget 25%, Need 30%, Authority 20%, Timeline 25%
        score = int(
            (req.budget * 0.25) +
            (req.need * 0.30) +
            (req.authority * 0.20) +
            (req.timeline * 0.25)
        )
        score = max(0, min(100, score))

        if score >= 71:
            category = "Hot"
            rec = "Priority direct sales rep outreach and immediate 1-on-1 demo scheduling."
        elif score >= 41:
            category = "Warm"
            rec = "Nurture with automated case studies and offer live webinar demo."
        else:
            category = "Cold"
            rec = "Keep on quarterly marketing drip list."

        # Upsert lead in database
        lead = db.query(Lead).filter(Lead.email == req.email).first()
        created = False
        if not lead:
            lead = Lead(
                name=req.name,
                email=req.email,
                phone=req.phone,
                company=req.company,
                budget=req.budget,
                need=req.need,
                authority=req.authority,
                timeline=req.timeline,
                score=score,
                category=category,
                status="Qualified" if category == "Hot" else "Contacted",
                notes=req.notes
            )
            db.add(lead)
            created = True
        else:
            lead.name = req.name
            lead.budget = req.budget
            lead.need = req.need
            lead.authority = req.authority
            lead.timeline = req.timeline
            lead.score = score
            lead.category = category
            if req.company:
                lead.company = req.company
            if req.notes:
                lead.notes = req.notes

        db.commit()
        db.refresh(lead)

        return BotQualifyResponse(
            lead_id=lead.id,
            name=lead.name,
            score=score,
            category=category,
            bant_breakdown={
                "budget": req.budget,
                "need": req.need,
                "authority": req.authority,
                "timeline": req.timeline
            },
            recommended_action=rec,
            created_or_updated=created
        )

    @classmethod
    def book_demo(cls, req: BotBookRequest, db: Session) -> BotBookResponse:
        if req.meeting_date:
            date_val = req.meeting_date
        else:
            # Default to tomorrow
            add_hours = 4 if req.slot == "afternoon" else 1
            date_val = datetime.now(timezone.utc) + timedelta(days=1, hours=add_hours)

        meeting = Meeting(
            lead_id=req.lead_id,
            lead_name=req.lead_name,
            title=req.title,
            meeting_date=date_val,
            duration_minutes=30,
            status="Scheduled",
            notes=req.notes or f"Booked via SalesBot API ({req.slot} slot)"
        )
        db.add(meeting)
        db.commit()
        db.refresh(meeting)

        confirm_msg = (
            f"Successfully confirmed '{meeting.title}' for {meeting.lead_name} on "
            f"{meeting.meeting_date.strftime('%A, %b %d at %I:%M %p UTC')}."
        )

        return BotBookResponse(
            meeting_id=meeting.id,
            lead_name=meeting.lead_name,
            title=meeting.title,
            meeting_date=meeting.meeting_date,
            duration_minutes=meeting.duration_minutes,
            status=meeting.status,
            confirmation_message=confirm_msg
        )
