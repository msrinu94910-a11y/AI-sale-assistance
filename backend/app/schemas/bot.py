from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field

class ExtractedEntities(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    budget: Optional[str] = None
    need: Optional[str] = None
    timeline: Optional[str] = None

class LeadSyncStatus(BaseModel):
    lead_id: Optional[int] = None
    name: Optional[str] = None
    email: Optional[str] = None
    company: Optional[str] = None
    status: Optional[str] = None
    score: Optional[int] = None
    category: Optional[str] = None

class BotChatRequest(BaseModel):
    message: str = Field(..., description="Customer or sales query message")
    session_id: Optional[str] = Field(None, description="Client session ID to maintain conversation state")
    lead_id: Optional[int] = Field(None, description="Optional lead ID if prospect is already known")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Optional metadata or custom parameters")

class BotChatResponse(BaseModel):
    reply: str
    intent: str
    session_id: str
    extracted_entities: ExtractedEntities
    suggested_actions: List[str] = []
    lead: Optional[LeadSyncStatus] = None
    score_change: int = 0
    timestamp: datetime

class BotQualifyRequest(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    phone: Optional[str] = None
    budget: int = Field(50, ge=0, le=100, description="Budget score 0-100 (25% weight)")
    need: int = Field(50, ge=0, le=100, description="Business need score 0-100 (30% weight)")
    authority: int = Field(50, ge=0, le=100, description="Decision authority score 0-100 (20% weight)")
    timeline: int = Field(50, ge=0, le=100, description="Urgency / timeline score 0-100 (25% weight)")
    notes: Optional[str] = None

class BotQualifyResponse(BaseModel):
    lead_id: Optional[int] = None
    name: str
    score: int
    category: str
    bant_breakdown: Dict[str, int]
    recommended_action: str
    created_or_updated: bool

class BotBookRequest(BaseModel):
    lead_id: Optional[int] = None
    lead_name: str
    lead_email: Optional[str] = None
    title: str = "Sales AI Demo & Architecture Review"
    slot: Optional[str] = "afternoon" # "morning", "afternoon"
    meeting_date: Optional[datetime] = None
    notes: Optional[str] = None

class BotBookResponse(BaseModel):
    meeting_id: int
    lead_name: str
    title: str
    meeting_date: datetime
    duration_minutes: int
    status: str
    confirmation_message: str

class BotMessageItem(BaseModel):
    id: Optional[int] = None
    sender: str
    message: str
    intent: Optional[str] = None
    timestamp: datetime

class BotSessionHistoryResponse(BaseModel):
    session_id: str
    total_messages: int
    messages: List[BotMessageItem]
