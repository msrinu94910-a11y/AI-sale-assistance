import re
from typing import Dict, Any, List
from app.core.config import settings

class AISalesEngine:
    """
    Intelligent AI Sales Assistant Engine with Comprehensive NLP Pattern Matching,
    BANT Lead Qualification, Dynamic Answer Generation, and External LLM Integration.
    """

    @classmethod
    def detect_intent(cls, message: str) -> str:
        msg_lower = message.lower()
        if any(w in msg_lower for w in ["price", "pricing", "cost", "how much", "plan", "discount", "fee", "tier", "quote"]):
            return "pricing"
        elif any(w in msg_lower for w in ["demo", "meeting", "schedule", "call", "talk", "calendar", "book", "slot", "time"]):
            return "scheduling"
        elif any(w in msg_lower for w in ["score", "bant", "qualify", "budget", "need", "authority", "timeline", "hot", "warm", "cold"]):
            return "qualification"
        elif any(w in msg_lower for w in ["feature", "capability", "crm", "workflow", "automation", "dashboard", "analytics"]):
            return "features"
        elif any(w in msg_lower for w in ["team", "size", "employee", "reps", "enterprise", "1-10", "11-50", "50+"]):
            return "team_size"
        elif any(w in msg_lower for w in ["sarah", "marcus", "elena", "david", "lead"]):
            return "lead_query"
        else:
            return "general"

    @classmethod
    def process_message(cls, message: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        intent = cls.detect_intent(message)
        
        # Check if OpenAI API key is present for external LLM call
        if settings.OPENAI_API_KEY:
            try:
                import httpx
                headers = {
                    "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": settings.OPENAI_MODEL,
                    "messages": [
                        {"role": "system", "content": "You are SalesBot AI, an intelligent B2B Sales Assistant. Answer questions accurately about CRM features, BANT lead scoring (Budget 25%, Need 30%, Authority 20%, Timeline 25%), pricing, and meeting booking."},
                        {"role": "user", "content": message}
                    ],
                    "temperature": 0.7
                }
                with httpx.Client(timeout=10.0) as client:
                    res = client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        response_text = data["choices"][0]["message"]["content"]
                        return {
                            "response": response_text,
                            "intent": intent,
                            "score_change": 5,
                            "suggested_actions": ["Schedule Demo", "Calculate Lead Score", "Compare Pricing"]
                        }
            except Exception:
                pass

        # Smart Comprehensive Offline Response Generator
        return cls._generate_intelligent_response(message, intent)

    @classmethod
    def _generate_intelligent_response(cls, message: str, intent: str) -> Dict[str, Any]:
        msg_lower = message.lower()

        if intent == "pricing":
            response = (
                "SalesBot AI offers 3 flexible pricing tiers:\n"
                "• Starter ($49/user/month): Includes BANT lead scoring, core CRM, and basic analytics.\n"
                "• Professional ($99/user/month): Adds AI Sales Assistant, live calendar sync, and automated follow-ups.\n"
                "• Enterprise (Custom Quote): Includes dedicated SLA, SSO compliance, and custom CRM integrations.\n\n"
                "Would you like me to generate a tailored quote for your team?"
            )
            actions = ["Request Custom Quote", "Book Demo for Pricing", "Compare All Features"]
            score_change = 10

        elif intent == "team_size":
            if "11-50" in msg_lower or "50+" in msg_lower or "enterprise" in msg_lower:
                response = (
                    "For mid-market and enterprise teams (10+ reps), SalesBot AI unlocks automated lead routing, "
                    "multi-user BANT score thresholding, and real-time pipeline velocity dashboards to maximize deal conversion."
                )
            else:
                response = (
                    "For growing sales teams (1-10 reps), SalesBot AI provides instant setup with pre-configured BANT qualification weights "
                    "and automated calendar booking so you can focus on closing deals."
                )
            actions = ["Schedule Product Demo", "View BANT Evaluation Matrix", "Explore Pricing Plans"]
            score_change = 15

        elif intent == "features":
            response = (
                "SalesBot AI empowers your sales pipeline with 4 core capabilities:\n"
                "1. Automated BANT Lead Scoring (Budget, Need, Authority, Timeline).\n"
                "2. Intelligent Conversation Workspace for automated lead qualification.\n"
                "3. One-Click Demo & Meeting Calendar Scheduling.\n"
                "4. Real-time Pipeline & Lead Score Analytics."
            )
            actions = ["Test BANT Qualification", "Book Live Demo", "View Analytics Dashboard"]
            score_change = 10

        elif intent == "qualification":
            response = (
                "Our BANT Lead Qualification framework automatically scores prospects on a 0-100 scale using weighted metrics:\n"
                "• Budget Allocation (25%)\n"
                "• Need Alignment (30%)\n"
                "• Decision Authority (20%)\n"
                "• Timeline Urgency (25%)\n\n"
                "Leads scored 71+ are flagged as Hot 🔥, 41-70 as Warm ⚡, and <40 as Cold ❄️."
            )
            actions = ["Score New Lead", "Filter Hot Leads", "Add New Lead"]
            score_change = 15

        elif intent == "scheduling":
            response = (
                "I can schedule a personalized 1-on-1 product demo with our senior solution architect. "
                "We can review live BANT scoring, custom CRM workflows, and team onboarding options. "
                "Which date or time slot works best for you?"
            )
            actions = ["Book Morning Slot", "Book Afternoon Slot", "Select Custom Date"]
            score_change = 20

        elif intent == "lead_query":
            if "sarah" in msg_lower:
                response = "Sarah Connor is a Hot Lead (Score: 88/100) from Cyberdyne Systems looking for an Enterprise AI CRM for 150+ reps."
            elif "marcus" in msg_lower:
                response = "Marcus Vance is a Warm Lead (Score: 62/100) from Apex Dynamics interested in automated follow-ups."
            elif "elena" in msg_lower:
                response = "Elena Rostova is a Hot Lead (Score: 91/100) from QuantumScale Tech with a contract in legal review."
            elif "david" in msg_lower:
                response = "David Miller is a Cold Lead (Score: 31/100) from Horizon Cloud who downloaded the product whitepaper."
            else:
                response = "You can view, search, and manage all your active leads in the 'Leads & Scoring' directory tab above!"
            actions = ["View All Leads", "Add New Lead", "Book Demo"]
            score_change = 10

        else:
            response = (
                f"Thank you for asking! SalesBot AI is designed to automate lead qualification, answer product inquiries, "
                f"and streamline demo scheduling. You can ask me about pricing, BANT lead scoring, product features, or book a live demo."
            )
            actions = ["Explore Features", "Calculate Lead Score", "View Pricing Plans"]
            score_change = 5

        return {
            "response": response,
            "intent": intent,
            "score_change": score_change,
            "suggested_actions": actions
        }
