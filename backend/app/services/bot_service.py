import re
import uuid
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from app.core.config import settings
from app.models.conversation import Conversation
from app.models.lead import Lead
from app.models.meeting import Meeting
from app.models.property import Property
from app.services.communication_service import CommunicationService
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
from app.api.v1.endpoints.ws import manager
import asyncio

class SalesBotService:
    paused_sessions = set()

    """
    Dedicated AI Real Estate Sales Assistant Service supporting:
    1. Multi-turn Session Management & Conversation History
    2. Dynamic Entity Extraction (Name, Email, Phone, Location, BHK, Budget, Property Type)
    3. Multi-Provider LLM Integration (Gemini, Groq, OpenAI)
    4. Database-backed Property Search & Recommendation
    5. Automatic Lead Capture & Site Visit Scheduling
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
            r"(?:my name is|i am|i'm|this is|call me)\s+([A-Z][a-z]+(?:\s+(?!from\b|at\b|with\b|and\b)[A-Z][a-z]+)?)",
            r"(?:name:\s*)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)"
        ]
        for pat in name_patterns:
            nm = re.search(pat, text, re.IGNORECASE)
            if nm:
                candidate_name = nm.group(1).title().strip()
                invalid_words = {"from", "here", "interested", "looking", "ready", "searching", "trying", "for", "a", "an", "the", "some"}
                if not any(w in candidate_name.lower().split() for w in invalid_words):
                    entities.name = candidate_name
                    break

        # 4. Property Type extraction
        text_lower = text.lower()
        if "villa" in text_lower:
            entities.property_type = "Villa"
        elif "apartment" in text_lower or "flat" in text_lower:
            entities.property_type = "Apartment"
        elif "plot" in text_lower or "land" in text_lower:
            entities.property_type = "Plot"

        # 5. BHK extraction
        bhk_match = re.search(r'(\d)\s*(?:bhk|bedroom|bed)', text_lower)
        if bhk_match:
            entities.bhk = int(bhk_match.group(1))

        # 6. Budget extraction (rough heuristic for Indian context e.g., 1.5 Cr, 80 Lakhs)
        budget_cr = re.findall(r'([\d\.]+)\s*(?:cr|crore|crores)', text_lower)
        if budget_cr:
            try:
                max_cr = max([float(x) for x in budget_cr])
                entities.budget_max = int(max_cr * 10000000)
            except: pass
        else:
            budget_lakh = re.findall(r'([\d\.]+)\s*(?:lakh|lakhs|lac|lacs)', text_lower)
            if budget_lakh:
                try:
                    max_lakh = max([float(x) for x in budget_lakh])
                    entities.budget_max = int(max_lakh * 100000)
                except: pass

        # 7. Location extraction (looking for common cities/areas as a fallback)
        locations = ["hyderabad", "gachibowli", "kondapur", "madhapur", "banjara hills", "jubilee hills", "narsingi"]
        for loc in locations:
            if loc in text_lower:
                entities.location = loc.title()
                break

        return entities

    @classmethod
    def call_external_llm(cls, message: str, history: List[Dict[str, str]], context: Dict[str, Any], property_context: str = "") -> Optional[Dict[str, str]]:
        context_msg = property_context if property_context else "No properties found matching the current criteria. If the user provided requirements, tell them there are no exact matches and suggest adjusting their search. If they haven't provided requirements, ask them what they are looking for."
        system_prompt = (
            "You are an elite AI Real Estate Property Assistant for our website. "
            "Your objective: Help website visitors find their dream property, answer questions about locations and prices, "
            "extract their requirements (Location, BHK, Budget, Property Type), and guide them to schedule a site visit. "
            "Do NOT hallucinate properties. Only recommend properties provided in the context below.\n\n"
            f"AVAILABLE PROPERTY CONTEXT (from database):\n{context_msg}\n\n"
            "Keep answers concise, helpful, and natural. Always push the conversation forward.\n\n"
            "IMPORTANT: You MUST respond in pure JSON format only, without markdown wrapping. Your JSON object must have exactly two keys:\n"
            '1. "reply": Your conversational response to the user.\n'
            '2. "intent": Categorize the user\'s message into one of these exact intents: "demo_booked" (if they are confirming a date/time for a visit or explicitly asking to book/schedule), "requirement_gathering" (if you are asking them for their preferences), "property_recommendation" (if you are showing properties), "general_inquiry" (for questions), "greeting" (for hellos).\n'
        )

        import httpx
        import json
        
        def parse_llm_json(raw_text: str) -> Optional[Dict[str, str]]:
            try:
                clean = re.sub(r'```(?:json)?|```', '', raw_text).strip()
                parsed = json.loads(clean)
                return {"reply": parsed.get("reply", raw_text), "intent": parsed.get("intent", "llm_generated")}
            except Exception as e:
                print(f"Error parsing JSON from LLM: {e}")
                return {"reply": raw_text, "intent": "llm_generated"}

        groq_key = context.get("groq_api_key") or settings.GROQ_API_KEY
        if groq_key:
            try:
                groq_models = [settings.GROQ_MODEL]
                headers = {"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"}
                
                messages = [{"role": "system", "content": system_prompt}]
                for h in history[-4:]:
                    messages.append({"role": h.get("role", "user"), "content": h.get("content", "")})
                messages.append({"role": "user", "content": message})

                with httpx.Client(timeout=8.0) as client:
                    for mod in groq_models:
                        payload = {
                            "model": mod,
                            "messages": messages,
                            "temperature": 0.6,
                            "max_tokens": 500
                        }
                        resp = client.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
                        if resp.status_code == 200:
                            data = resp.json()
                            return parse_llm_json(data["choices"][0]["message"]["content"])
                        else:
                            print(f"Groq API Error {resp.status_code}: {resp.text}")
            except Exception as e:
                print(f"Groq API Exception: {e}")

        gemini_key = context.get("gemini_api_key") or settings.GEMINI_API_KEY
        if gemini_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
                
                contents = []
                for h in history[-4:]:
                    role = "user" if h.get("role", "user") == "user" else "model"
                    contents.append({"role": role, "parts": [{"text": h.get("content", "")}]})
                
                contents.append({"role": "user", "parts": [{"text": message}]})
                
                payload = {
                    "systemInstruction": {"parts": [{"text": system_prompt}]},
                    "contents": contents
                }
                with httpx.Client(timeout=6.0) as client:
                    resp = client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        return parse_llm_json(data["candidates"][0]["content"]["parts"][0]["text"])
                    else:
                        print(f"Gemini API Error {resp.status_code}: {resp.text}")
            except Exception as e:
                print(f"Gemini API Exception: {e}")

        openai_key = context.get("openai_api_key") or settings.OPENAI_API_KEY
        if openai_key and openai_key.startswith("sk-"):
            try:
                url = "https://api.openai.com/v1/chat/completions"
                headers = {"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"}
                messages = [{"role": "system", "content": system_prompt}]
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
                        return parse_llm_json(resp.json()["choices"][0]["message"]["content"])
                    else:
                        print(f"OpenAI API Error {resp.status_code}: {resp.text}")
            except Exception as e:
                print(f"OpenAI API Exception: {e}")

        return None

    @classmethod
    def synthesize_conversational_response(
        cls, 
        message: str, 
        entities: ExtractedEntities, 
        history_count: int,
        properties: List[Property]
    ) -> Tuple[str, str, List[str], int]:
        """
        Zero-failure conversational synthesizer fallback.
        """
        msg_lower = message.lower()

        # 1. Greetings
        if any(p in msg_lower.split() for p in ["hi", "hello", "hey", "greetings"]) and len(message.split()) <= 4:
            reply = (
                "Hello! 👋 I am your AI Property Assistant.\n\n"
                "I can help you discover available properties, compare options, and book site visits. What kind of property are you looking for today?"
            )
            return reply, "greeting", ["Find 3 BHK", "Show Villas under 2 Cr", "Search in Gachibowli"], 5

        # 2. Site Visit Booking Details (Dates / Confirmations)
        is_date_time = bool(re.search(r'\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|tomorrow|today|am|pm|morning|evening|afternoon)\b', msg_lower)) or bool(re.search(r'\b\d{1,2}(?:st|nd|rd|th)?\b', msg_lower) and len(msg_lower.split()) < 8)
        
        if is_date_time and not any(p in msg_lower for p in ["bhk", "crore", "cr", "lakh", "lakhs", "villa", "apartment", "plot"]):
            reply = (
                "Site Visit confirmed! I will arrange the details and send you a calendar invite shortly.\n\n"
                "Looking forward to hosting you!"
            )
            return reply, "demo_booked", ["Add to Calendar", "Reschedule"], 30

        # 3. Requesting a site visit
        if any(p in msg_lower for p in ["visit", "site visit", "book", "schedule", "see the property", "tour"]):
            reply = (
                "I'd be happy to arrange a site visit for you! Seeing the property in person is the best way to experience it.\n\n"
                "Would you prefer to visit during the weekday or weekend? Let me know a time that works for you."
            )
            return reply, "site_visit_prompt", ["Book this Weekend", "Book Tomorrow", "Ask for location"], 20

        # 4. Property recommendations (only if user provided requirements or explicit properties exist and user asked)
        has_requirements = bool(entities.location or entities.budget_max or entities.property_type or entities.bhk)
        if len(properties) > 0 and (has_requirements or "show" in msg_lower or "find" in msg_lower or "search" in msg_lower or "options" in msg_lower):
            prop_lines = []
            for i, p in enumerate(properties[:3]):
                price_str = f"{p.price / 10000000} Cr" if p.price >= 10000000 else f"{p.price / 100000} Lakhs"
                bhk_str = f"{p.bhk} BHK " if p.bhk else ""
                prop_lines.append(f"{i+1}. **{p.name}** - {bhk_str}{p.property_type} in {p.location} for ₹{price_str}")
                
            reply = (
                f"I found some great properties that match your requirements:\n\n" + 
                "\n".join(prop_lines) +
                "\n\nWould you like more details on any of these, or would you like to schedule a site visit?"
            )
            return reply, "property_recommendation", ["Compare Properties", "Schedule Site Visit", "Modify Budget"], 15

        # 5. Missing requirements gathering
        if has_requirements:
            missing = []
            if not entities.location:
                missing.append("• Which location are you looking in?")
            if not entities.budget_max:
                missing.append("• What is your approximate budget?")
            if not entities.property_type and not entities.bhk:
                missing.append("• Are you looking for a Villa, Apartment, or Plot?")
                
            if missing:
                reply = "Got it. I'm noting down your requirements. To give you the best matches, could you tell me:\n" + "\n".join(missing)
                return reply, "requirement_gathering", ["Under 1 Cr", "3 BHK", "In Hyderabad"], 10
            else:
                reply = "I've noted down all your requirements, but I don't have any exact matches right now. Would you be open to adjusting your preferred location or budget?"
                return reply, "property_recommendation", ["Broaden Search", "Modify Budget", "Change Location"], 10

        # 6. Default Fallback
        reply = (
            "I can help you find the perfect property. Tell me a bit about what you are looking for—like your preferred location, budget, or whether you want an apartment or a villa."
        )
        return reply, "general_inquiry", ["Find 3 BHK", "Show Villas", "Search in Gachibowli"], 5

    @classmethod
    def process_chat(cls, req: BotChatRequest, db: Session) -> BotChatResponse:
        session_id = req.session_id or f"session_{uuid.uuid4().hex[:12]}"
        msg = req.message.strip()

        history_records = db.query(Conversation).filter(
            Conversation.session_id == session_id
        ).order_by(Conversation.timestamp.asc()).all()

        formatted_history = [
            {"role": "user" if h.sender == "user" else "assistant", "content": h.message}
            for h in history_records
        ]

        # IF session is paused (Human Agent took over), skip LLM and just save the message.
        if session_id in cls.paused_sessions:
            try:
                user_turn = Conversation(
                    session_id=session_id,
                    lead_id=req.lead_id,
                    sender="user",
                    message=msg,
                    intent="human_handoff",
                    timestamp=datetime.now(timezone.utc)
                )
                db.add(user_turn)
                db.commit()
                
                # Notify agents that the user replied during a paused session
                asyncio.run(manager.broadcast_to_agents({
                    "type": "handoff_user_reply",
                    "session_id": session_id,
                    "message": msg
                }))
            except Exception:
                pass
                
            return BotChatResponse(
                reply="",  # Empty string because agent will type manually via WebSockets
                intent="human_handoff",
                session_id=session_id,
                extracted_entities=ExtractedEntities(),
                suggested_actions=[],
                timestamp=datetime.now(timezone.utc)
            )

        entities = cls.extract_entities(msg)
        
        # Early Lead Retrieval / Creation to access accumulated preferences
        lead_obj: Optional[Lead] = None
        try:
            if req.lead_id:
                lead_obj = db.query(Lead).filter(Lead.id == req.lead_id).first()
            
            # Try finding from session history
            if not lead_obj and session_id:
                last_user_turn = db.query(Conversation).filter(
                    Conversation.session_id == session_id,
                    Conversation.lead_id.isnot(None)
                ).first()
                if last_user_turn:
                    lead_obj = db.query(Lead).filter(Lead.id == last_user_turn.lead_id).first()

            if not lead_obj and (entities.email or entities.phone):
                if entities.email:
                    lead_obj = db.query(Lead).filter(Lead.email == entities.email).first()
                elif entities.phone:
                    lead_obj = db.query(Lead).filter(Lead.phone == entities.phone).first()
                    
                if not lead_obj:
                    lead_obj = Lead(
                        name=entities.name or "Website Visitor",
                        email=entities.email or f"{uuid.uuid4().hex[:8]}@unknown.com",
                        phone=entities.phone,
                        location_preference=entities.location,
                        property_type_preference=entities.property_type,
                        bhk_preference=entities.bhk,
                        budget_max=entities.budget_max,
                        status="New",
                        score=60,
                        category="Warm",
                        notes=f"Auto-captured via AI Assistant in session {session_id}"
                    )
                    db.add(lead_obj)
                    db.commit()
                    db.refresh(lead_obj)
            
            # Update lead preferences if found
            if lead_obj:
                updated = False
                if entities.location and lead_obj.location_preference != entities.location:
                    lead_obj.location_preference = entities.location
                    updated = True
                if entities.property_type and lead_obj.property_type_preference != entities.property_type:
                    lead_obj.property_type_preference = entities.property_type
                    updated = True
                if entities.bhk and lead_obj.bhk_preference != entities.bhk:
                    lead_obj.bhk_preference = entities.bhk
                    updated = True
                if entities.budget_max and lead_obj.budget_max != entities.budget_max:
                    lead_obj.budget_max = entities.budget_max
                    updated = True
                if updated:
                    db.commit()
        except Exception as le:
            db.rollback()
            print(f"Notice: Lead synchronization exception: {le}")

        # Build effective filters combining current entities and lead preferences
        eff_location = entities.location or (lead_obj.location_preference if lead_obj else None)
        eff_property_type = entities.property_type or (lead_obj.property_type_preference if lead_obj else None)
        eff_bhk = entities.bhk or (lead_obj.bhk_preference if lead_obj else None)
        eff_budget = entities.budget_max or (lead_obj.budget_max if lead_obj else None)
        
        # Search properties in DB only if there are explicit requirements
        matching_properties = []
        if eff_location or eff_property_type or eff_bhk or eff_budget:
            query = db.query(Property).filter(Property.status == "AVAILABLE")
            if eff_location:
                query = query.filter(Property.location.ilike(f"%{eff_location}%"))
            if eff_property_type:
                query = query.filter(Property.property_type.ilike(f"%{eff_property_type}%"))
            if eff_bhk:
                query = query.filter(Property.bhk == eff_bhk)
            if eff_budget:
                query = query.filter(Property.price <= eff_budget)
                
            matching_properties = query.limit(5).all()
        
        prop_context = ""
        for p in matching_properties:
            price_str = f"Rs. {p.price / 10000000} Cr" if p.price >= 10000000 else f"Rs. {p.price / 100000} Lakhs"
            prop_context += f"- {p.name}: {p.bhk} BHK {p.property_type} in {p.location}. Price: {price_str}. Amenities: {p.amenities}\n"

        llm_reply_dict = cls.call_external_llm(msg, formatted_history, req.context or {}, prop_context)
        
        if llm_reply_dict and llm_reply_dict.get("intent") == "demo_booked":
            reply = llm_reply_dict.get("reply", "Site Visit confirmed! I will arrange the details and send you a calendar invite shortly.")
            intent = "demo_booked"
            suggested_actions = ["Add to Calendar", "Reschedule"]
            score_change = 30
            
            # Auto-create Meeting and send Email
            if lead_obj:
                try:
                    from datetime import timedelta
                    from app.models.meeting import Meeting
                    from app.services.communication_service import CommunicationService
                    
                    meeting_date = datetime.now(timezone.utc) + timedelta(days=1, hours=4)
                    meeting_title = f"Site Visit for {lead_obj.name or 'Client'}"
                    meeting = Meeting(
                        lead_id=lead_obj.id,
                        lead_name=lead_obj.name or "Website Visitor",
                        title=meeting_title,
                        meeting_date=meeting_date,
                        duration_minutes=60,
                        status="Scheduled",
                        notes="Auto-booked via AI Assistant Chat"
                    )
                    db.add(meeting)
                    db.commit()
                    db.refresh(meeting)
                    
                    if lead_obj.email:
                        CommunicationService.send_meeting_confirmation(
                            lead_email=lead_obj.email, 
                            lead_name=lead_obj.name or "Client", 
                            meeting_title=meeting_title, 
                            meeting_date=meeting_date
                        )
                except Exception as e:
                    db.rollback()
                    print(f"Error auto-booking meeting during chat: {e}")
        elif llm_reply_dict:
            reply = llm_reply_dict.get("reply", "")
            intent = llm_reply_dict.get("intent", "llm_generated")
            suggested_actions = ["Schedule Site Visit", "Compare Options", "Modify Search"]
            score_change = 10
        else:
            effective_entities = ExtractedEntities(
                name=entities.name or (lead_obj.name if lead_obj else None),
                email=entities.email or (lead_obj.email if lead_obj else None),
                phone=entities.phone or (lead_obj.phone if lead_obj else None),
                location=eff_location,
                property_type=eff_property_type,
                bhk=eff_bhk,
                budget_max=eff_budget
            )
            reply, intent, suggested_actions, score_change = cls.synthesize_conversational_response(
                msg, effective_entities, len(history_records), matching_properties
            )

        # Save Turn to Database
        try:
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
        except Exception as ce:
            db.rollback()
            print(f"Notice: Conversation turn logging exception: {ce}")

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
            # Live Notifications: If Lead is Hot, alert agents
            if lead_obj.category == "Hot":
                try:
                    asyncio.run(manager.broadcast_to_agents({
                        "type": "hot_lead_alert",
                        "session_id": session_id,
                        "lead_name": lead_obj.name or "Unknown Hot Lead",
                        "score": lead_obj.score,
                        "message": msg
                    }))
                except Exception as e:
                    print(f"WS Broadcast Error: {e}")

        # Only attach properties to the UI response if the intent warrants it.
        # This prevents property cards from showing up alongside unrelated messages (like booking a visit).
        ui_properties = None
        if intent in ["property_recommendation", "llm_generated", "general_inquiry"]:
            ui_properties = matching_properties

        return BotChatResponse(
            reply=reply,
            intent=intent,
            session_id=session_id,
            extracted_entities=effective_entities if 'effective_entities' in locals() else entities,
            suggested_actions=suggested_actions,
            lead=lead_sync,
            score_change=score_change,
            properties=[
                {
                    "id": p.id,
                    "name": p.name,
                    "price": p.price,
                    "location": p.location,
                    "property_type": p.property_type,
                    "bhk": p.bhk,
                    "amenities": p.amenities
                } for p in ui_properties
            ] if ui_properties else None,
            timestamp=datetime.now(timezone.utc)
        )

    @classmethod
    def qualify_prospect(cls, req: BotQualifyRequest, db: Session) -> BotQualifyResponse:
        from app.services.lead_qualification import LeadQualificationEngine
        
        eval_result = LeadQualificationEngine.evaluate_lead(
            budget=req.budget,
            need=req.need,
            authority=req.authority,
            timeline=req.timeline
        )
        score = eval_result["score"]
        category = eval_result["category"]

        if category == "Hot":
            rec = "Priority site visit scheduling."
        elif category == "Warm":
            rec = "Nurture and share property brochures."
        else:
            rec = "Keep on mailing list."

        lead = db.query(Lead).filter(Lead.email == req.email).first()
        created = False
        if not lead:
            lead = Lead(
                name=req.name,
                email=req.email,
                phone=req.phone,
                location_preference=req.location_preference,
                property_type_preference=req.property_type_preference,
                bhk_preference=req.bhk_preference,
                budget_min=req.budget_min,
                budget_max=req.budget_max,
                purpose=req.purpose,
                buying_timeline=req.buying_timeline,
                score=score,
                category=category,
                status="Qualified" if category == "Hot" else "Contacted",
                notes=req.notes
            )
            db.add(lead)
            created = True
        else:
            lead.name = req.name
            if req.location_preference: lead.location_preference = req.location_preference
            if req.property_type_preference: lead.property_type_preference = req.property_type_preference
            if req.bhk_preference: lead.bhk_preference = req.bhk_preference
            if req.budget_max: lead.budget_max = req.budget_max
            lead.score = score
            lead.category = category
            if req.notes:
                lead.notes = req.notes

        db.commit()
        db.refresh(lead)

        # Trigger Follow-Up Email if Hot or Warm
        if category in ["Hot", "Warm"]:
            try:
                CommunicationService.send_follow_up_email(lead, rec)
            except Exception as e:
                print(f"Error sending follow-up email: {e}")

        return BotQualifyResponse(
            lead_id=lead.id,
            name=lead.name,
            score=score,
            category=category,
            requirements_breakdown={
                "location": req.location_preference,
                "property_type": req.property_type_preference,
                "bhk": req.bhk_preference,
                "budget_max": req.budget_max
            },
            recommended_action=rec,
            created_or_updated=created
        )

    @classmethod
    def book_demo(cls, req: BotBookRequest, db: Session) -> BotBookResponse:
        if req.meeting_date:
            date_val = req.meeting_date
        else:
            add_hours = 4 if req.slot == "afternoon" else 1
            date_val = datetime.now(timezone.utc) + timedelta(days=1, hours=add_hours)

        meeting = Meeting(
            lead_id=req.lead_id,
            lead_name=req.lead_name,
            title=req.title,
            meeting_date=date_val,
            duration_minutes=60,
            status="Scheduled",
            notes=req.notes or f"Site Visit Booked via AI Assistant ({req.slot} slot)"
        )
        db.add(meeting)
        db.commit()
        db.refresh(meeting)

        # Trigger Meeting Confirmation Email
        try:
            lead_record = db.query(Lead).filter(Lead.id == req.lead_id).first()
            if lead_record and lead_record.email:
                CommunicationService.send_meeting_confirmation(
                    lead_email=lead_record.email, 
                    lead_name=req.lead_name, 
                    meeting_title=req.title, 
                    meeting_date=meeting.meeting_date
                )
        except Exception as e:
            print(f"Error sending meeting confirmation: {e}")

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

    @classmethod
    def pause_session(cls, session_id: str):
        cls.paused_sessions.add(session_id)

    @classmethod
    def send_agent_message(cls, session_id: str, message: str, db: Session):
        # Save to DB
        assistant_turn = Conversation(
            session_id=session_id,
            sender="assistant",
            message=message,
            intent="human_agent",
            timestamp=datetime.now(timezone.utc)
        )
        db.add(assistant_turn)
        db.commit()
        
        # Broadcast via WebSocket to the user's specific session
        try:
            asyncio.run(manager.send_to_session(session_id, {
                "type": "agent_message",
                "message": message,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }))
        except Exception as e:
            print(f"Error sending agent message via WS: {e}")
