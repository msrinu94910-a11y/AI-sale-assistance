from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MeetingBase(BaseModel):
    lead_id: Optional[int] = None
    lead_name: str
    title: str
    meeting_date: datetime
    duration_minutes: Optional[int] = 30
    notes: Optional[str] = None
    status: Optional[str] = "Scheduled"

class MeetingCreate(MeetingBase):
    pass

class MeetingResponse(MeetingBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
