from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field

class ExtractedEntities(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    property_type: Optional[str] = None
    bhk: Optional[int] = None
    budget_max: Optional[int] = None
    budget_min: Optional[int] = None
    purpose: Optional[str] = None
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
    properties: Optional[List[Dict[str, Any]]] = None
    timestamp: datetime

class BotQualifyRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    location_preference: Optional[str] = None
    property_type_preference: Optional[str] = None
    bhk_preference: Optional[int] = None
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    purpose: Optional[str] = None
    buying_timeline: Optional[str] = None
    notes: Optional[str] = None

class BotQualifyResponse(BaseModel):
    lead_id: Optional[int] = None
    name: str
    score: int
    category: str
    requirements_breakdown: Dict[str, Any]
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
