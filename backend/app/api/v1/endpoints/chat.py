from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.chat import ChatMessageRequest, ChatMessageResponse
from app.services.ai_service import AISalesEngine
from app.models.conversation import Conversation

router = APIRouter()

@router.post("/message", response_model=ChatMessageResponse)
def send_message(chat_in: ChatMessageRequest, db: Session = Depends(get_db)):
    result = AISalesEngine.process_message(chat_in.message, chat_in.context)
    
    # Save conversation log if db session exists
    try:
        conv = Conversation(
            lead_id=chat_in.lead_id,
            sender="user",
            message=chat_in.message,
            intent=result["intent"],
            timestamp=datetime.now(timezone.utc)
        )
        db.add(conv)
        db.commit()
    except Exception:
        pass

    return {
        "id": 1,
        "message": chat_in.message,
        "response": result["response"],
        "intent": result["intent"],
        "score_change": result.get("score_change", 0),
        "suggested_actions": result.get("suggested_actions", []),
        "timestamp": datetime.now(timezone.utc)
    }

@router.get("/history")
def get_chat_history(lead_id: int = None, db: Session = Depends(get_db)):
    return [
        {
            "sender": "assistant",
            "message": "Hi! I am your AI Sales Assistant. How can I help you accelerate lead qualification and sales today?",
            "timestamp": "2026-09-02T10:00:00Z"
        }
    ]
