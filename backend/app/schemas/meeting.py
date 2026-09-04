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

class MeetingUpdate(BaseModel):
    lead_id: Optional[int] = None
    lead_name: Optional[str] = None
    title: Optional[str] = None
    meeting_date: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    notes: Optional[str] = None
    status: Optional[str] = None

class MeetingResponse(MeetingBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

