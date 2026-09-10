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
                if candidate_name.lower() not in ["from", "here", "interested", "looking", "ready"]:
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
        budget_cr = re.search(r'([\d\.]+)\s*(?:cr|crore|crores)', text_lower)
        if budget_cr:
            try:
                entities.budget_max = int(float(budget_cr.group(1)) * 10000000)
            except: pass
        else:
            budget_lakh = re.search(r'([\d\.]+)\s*(?:lakh|lakhs|lac|lacs)', text_lower)
            if budget_lakh:
                try:
                    entities.budget_max = int(float(budget_lakh.group(1)) * 100000)
                except: pass

        # 7. Location extraction (looking for common cities/areas as a fallback)
        locations = ["hyderabad", "gachibowli", "kondapur", "madhapur", "banjara hills", "jubilee hills", "narsingi"]
        for loc in locations:
            if loc in text_lower:
                entities.location = loc.title()
                break

        return entities

    @classmethod
    def call_external_llm(cls, message: str, history: List[Dict[str, str]], context: Dict[str, Any], property_context: str = "") -> Optional[str]:
        system_prompt = (
            "You are an elite AI Real Estate Property Assistant for our website. "
            "Your objective: Help website visitors find their dream property, answer questions about locations and prices, "
            "extract their requirements (Location, BHK, Budget, Property Type), and guide them to schedule a site visit. "
            "Do NOT hallucinate properties. Only recommend properties provided in the context below.\n\n"
            f"AVAILABLE PROPERTY CONTEXT (from database):\n{property_context if property_context else 'No specific properties found yet. Ask for requirements.'}\n\n"
            "Keep answers concise, helpful, and natural. Always push the conversation forward."
        )

        import httpx

        groq_key = context.get("groq_api_key") or settings.GROQ_API_KEY
        if groq_key:
            try:
                groq_models = ["llama3-8b-8192", "mixtral-8x7b-32768", "gemma-7b-it"]
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
                            return data["choices"][0]["message"]["content"]
            except Exception:
                pass

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
                        return resp.json()["choices"][0]["message"]["content"]
            except Exception:
                pass

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

        if any(p in msg_lower for p in ["visit", "site visit", "book", "schedule", "see the property", "tour"]):
            reply = (
                "I'd be happy to arrange a site visit for you! Seeing the property in person is the best way to experience it.\n\n"
                "Would you prefer to visit during the weekday or weekend? Let me know a time that works for you."
            )
            return reply, "site_visit_prompt", ["Book this Weekend", "Book Tomorrow", "Ask for location"], 20

        if len(properties) > 0:
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

        if entities.location or entities.budget_max or entities.property_type:
            reply = (
                "Got it. I'm noting down your requirements. To give you the best matches, could you tell me:\n"
            )
            if not entities.location:
                reply += "• Which location are you looking in?\n"
            if not entities.budget_max:
                reply += "• What is your approximate budget?\n"
            if not entities.property_type and not entities.bhk:
                reply += "• Are you looking for a Villa, Apartment, or Plot?\n"
                
            return reply, "requirement_gathering", ["Under 1 Cr", "3 BHK", "In Hyderabad"], 10

        # Greetings
        if any(p in msg_lower for p in ["hi", "hello", "hey", "greetings"]) and len(message.split()) <= 4:
            reply = (
                "Hello! 👋 I am your AI Property Assistant.\n\n"
                "I can help you discover available properties, compare options, and book site visits. What kind of property are you looking for today?"
            )
            return reply, "greeting", ["Find 3 BHK", "Show Villas under 2 Cr", "Search in Gachibowli"], 5

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

        entities = cls.extract_entities(msg)
        
        # Search properties in DB
        query = db.query(Property).filter(Property.status == "AVAILABLE")
        if entities.location:
            query = query.filter(Property.location.ilike(f"%{entities.location}%"))
        if entities.property_type:
            query = query.filter(Property.property_type.ilike(f"%{entities.property_type}%"))
        if entities.bhk:
            query = query.filter(Property.bhk == entities.bhk)
        if entities.budget_max:
            # allow properties up to the budget
            query = query.filter(Property.price <= entities.budget_max)
            
        matching_properties = query.limit(5).all()
        
        prop_context = ""
        for p in matching_properties:
            price_str = f"Rs. {p.price / 10000000} Cr" if p.price >= 10000000 else f"Rs. {p.price / 100000} Lakhs"
            prop_context += f"- {p.name}: {p.bhk} BHK {p.property_type} in {p.location}. Price: {price_str}. Amenities: {p.amenities}\n"

        llm_reply = cls.call_external_llm(msg, formatted_history, req.context or {}, prop_context)
        
        if llm_reply:
            reply = llm_reply
            intent = "llm_generated"
            suggested_actions = ["Schedule Site Visit", "Compare Options", "Modify Search"]
            score_change = 10
        else:
            reply, intent, suggested_actions, score_change = cls.synthesize_conversational_response(
                msg, entities, len(history_records), matching_properties
            )

        lead_obj: Optional[Lead] = None
        try:
            if req.lead_id:
                lead_obj = db.query(Lead).filter(Lead.id == req.lead_id).first()
            elif entities.email or entities.phone:
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
                else:
                    # Update preferences if found
                    if entities.location: lead_obj.location_preference = entities.location
                    if entities.property_type: lead_obj.property_type_preference = entities.property_type
                    if entities.bhk: lead_obj.bhk_preference = entities.bhk
                    if entities.budget_max: lead_obj.budget_max = entities.budget_max
                    db.commit()
        except Exception as le:
            db.rollback()
            print(f"Notice: Lead synchronization exception: {le}")

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

        return BotChatResponse(
            reply=reply,
            intent=intent,
            session_id=session_id,
            extracted_entities=entities,
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
                } for p in matching_properties
            ] if matching_properties else None,
            timestamp=datetime.now(timezone.utc)
        )

    @classmethod
    def qualify_prospect(cls, req: BotQualifyRequest, db: Session) -> BotQualifyResponse:
        # Simple qualification based on provided constraints
        score = 50
        if req.location_preference: score += 10
        if req.budget_max: score += 20
        if req.bhk_preference or req.property_type_preference: score += 10
        if req.phone or req.email: score += 10

        score = max(0, min(100, score))

        if score >= 70:
            category = "Hot"
            rec = "Priority site visit scheduling."
        elif score >= 50:
            category = "Warm"
            rec = "Nurture and share property brochures."
        else:
            category = "Cold"
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
