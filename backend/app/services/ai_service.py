import re
from typing import Dict, Any, List
from app.core.config import settings
from app.services.lead_qualification import LeadQualificationEngine

class AISalesEngine:
    """
    AI Sales Assistant Engine with Intent Detection,
    Prompt Building, OpenAI integration support, and Intelligent Mock Fallback.
    """

    INTENTS = {
        "pricing": [r"price", r"cost", r"pricing", r"how much", r"plan", r"discount", r"fee"],
        "qualification": [r"crm", r"feature", r"requirement", r"company size", r"employees", r"budget", r"need"],
        "scheduling": [r"demo", r"meeting", r"schedule", r"call", r"talk", r"calendar", r"book"],
        "inquiry": [r"hello", r"hi", r"help", r"what is", r"who", r"info", r"details"]
    }

    @classmethod
    def detect_intent(cls, message: str) -> str:
        msg_lower = message.lower()
        for intent, patterns in cls.INTENTS.items():
            for pattern in patterns:
                if re.search(pattern, msg_lower):
                    return intent
        return "inquiry"

    @classmethod
    def process_message(cls, message: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        intent = cls.detect_intent(message)
        
        # Check if OpenAI API key is present
        if settings.OPENAI_API_KEY:
            try:
                import httpx
                # Example API call structure for OpenAI GPT API
                headers = {
                    "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": settings.OPENAI_MODEL,
                    "messages": [
                        {"role": "system", "content": "You are an expert B2B AI Sales Assistant for SaaS CRM platforms. Qualify leads, capture budget/timeline/team size, and suggest booking product demos."},
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
                            "suggested_actions": ["Schedule Demo", "Calculate Lead Score", "Send Pricing Matrix"]
                        }
            except Exception as e:
                # Fallback to local intelligence if external API fails or is unreachable
                pass

        # Offline Intelligent Mock Generator based on Intent
        return cls._generate_mock_response(message, intent)

    @classmethod
    def _generate_mock_response(cls, message: str, intent: str) -> Dict[str, Any]:
        if intent == "pricing":
            response = (
                "Our Starter plan starts at $49/user/month, offering full CRM pipelines, lead scoring, and automated follow-ups. "
                "Enterprise plans feature custom integrations and dedicated SLA support. "
                "Would you like me to prepare a customized quote for your team?"
            )
            actions = ["Request Custom Quote", "Compare Plans", "Schedule Demo"]
            score_change = 10

        elif intent == "qualification":
            response = (
                "Great! Our AI Sales Assistant automatically streamlines lead scoring, pipeline management, and meeting scheduling. "
                "To give you the best setup recommendations, what is your team size and primary CRM challenge?"
            )
            actions = ["Team Size: 1-10", "Team Size: 11-50", "Enterprise (50+)"]
            score_change = 15

        elif intent == "scheduling":
            response = (
                "I would be delighted to set up a personalized live product demonstration with our senior solution specialist. "
                "Do you prefer a morning or afternoon slot this week?"
            )
            actions = ["Book Morning Slot", "Book Afternoon Slot", "View Full Calendar"]
            score_change = 20

        else:
            response = (
                "Hello! I am your AI Sales Assistant. I can help you qualify leads, explore our product capabilities, calculate ROI, or book a live product demonstration. How can I help you accelerate sales today?"
            )
            actions = ["Explore Features", "Calculate Lead Score", "Book Product Demo"]
            score_change = 5

        return {
            "response": response,
            "intent": intent,
            "score_change": score_change,
            "suggested_actions": actions
        }
