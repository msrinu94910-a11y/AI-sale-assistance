from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.models.conversation import Conversation
from app.services.bot_service import SalesBotService
from app.schemas.bot import (
    BotChatRequest,
    BotChatResponse,
    BotQualifyRequest,
    BotQualifyResponse,
    BotBookRequest,
    BotBookResponse,
    BotSessionHistoryResponse,
    BotMessageItem
)

router = APIRouter()

@router.get("/status")
def get_bot_status():
    """
    Check the Sales Assistant Bot status, active providers, and operational configuration.
    """
    providers = []
    if settings.GEMINI_API_KEY:
        providers.append("Google Gemini (gemini-1.5-flash)")
    if settings.GROQ_API_KEY:
        providers.append("Groq Cloud (llama3-8b-8192)")
    if settings.OPENAI_API_KEY:
        providers.append(f"OpenAI ({settings.OPENAI_MODEL or 'gpt-3.5-turbo'})")
    providers.append("Built-in Deterministic NLP Synthesizer (High-Resilience Active)")

    return {
        "status": "online",
        "bot_name": "SalesBot API",
        "version": "1.0.0",
        "active_providers": providers,
        "features": [
            "Multi-turn Session Context",
            "Automatic Entity Extraction (Name, Email, Phone, Company, Budget)",
            "Automated BANT Lead Scoring",
            "Calendar Demo Booking",
            "Lead Database Synchronization"
        ]
    }

@router.post("/chat", response_model=BotChatResponse)
def chat_with_bot(
    chat_req: BotChatRequest,
    db: Session = Depends(get_db)
):
    """
    Interact with the Sales Assistant Bot.
    
    Accepts:
    - `message`: User input text
    - `session_id`: (Optional) Session ID to maintain conversation history
    - `lead_id`: (Optional) Existing lead ID
    - `context`: (Optional) Custom API keys or metadata
    
    Returns:
    - Structured natural language reply
    - Identified intent & extracted entities
    - Suggested quick actions
    - Auto-synced lead status & score changes
    """
    try:
        return SalesBotService.process_chat(chat_req, db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing bot chat turn: {str(e)}"
        )

@router.get("/sessions/{session_id}/history", response_model=BotSessionHistoryResponse)
def get_session_history(
    session_id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieve full multi-turn conversation logs for a given session.
    """
    conversations = db.query(Conversation).filter(
        Conversation.session_id == session_id
    ).order_by(Conversation.timestamp.asc()).all()

    items = [
        BotMessageItem(
            id=c.id,
            sender=c.sender,
            message=c.message,
            intent=c.intent,
            timestamp=c.timestamp
        )
        for c in conversations
    ]

    return BotSessionHistoryResponse(
        session_id=session_id,
        total_messages=len(items),
        messages=items
    )

@router.post("/qualify", response_model=BotQualifyResponse)
def qualify_prospect(
    req: BotQualifyRequest,
    db: Session = Depends(get_db)
):
    """
    Evaluate a prospect through the standard BANT Scoring Algorithm (0 - 100):
    - Budget: 25%
    - Need: 30%
    - Authority: 20%
    - Timeline: 25%
    
    Saves or updates the lead record and outputs actionable sales recommendations.
    """
    try:
        return SalesBotService.qualify_prospect(req, db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error qualifying prospect: {str(e)}"
        )

@router.post("/book", response_model=BotBookResponse)
def book_demo_meeting(
    req: BotBookRequest,
    db: Session = Depends(get_db)
):
    """
    Book a product demonstration or discovery meeting directly via the bot.
    """
    try:
        return SalesBotService.book_demo(req, db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error booking demo meeting: {str(e)}"
        )
