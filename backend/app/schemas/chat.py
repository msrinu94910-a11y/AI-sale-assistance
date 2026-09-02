from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ChatMessageRequest(BaseModel):
    message: str
    lead_id: Optional[int] = None
    context: Optional[dict] = None

class ChatMessageResponse(BaseModel):
    id: Optional[int] = None
    message: str
    response: str
    intent: str
    score_change: Optional[int] = 0
    suggested_actions: Optional[List[str]] = []
    timestamp: datetime
