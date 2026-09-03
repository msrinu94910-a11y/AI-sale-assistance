from typing import List
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.meeting import Meeting
from app.schemas.meeting import MeetingCreate, MeetingResponse

router = APIRouter()

DEFAULT_MEETINGS = [
    {
        "id": 1,
        "lead_id": 1,
        "lead_name": "Sarah Connor (Cyberdyne Systems)",
        "title": "Enterprise CRM Architecture Review & Live Demo",
        "meeting_date": (datetime.now(timezone.utc) + timedelta(days=1)).isoformat(),
        "duration_minutes": 45,
        "status": "Scheduled",
        "notes": "Focus on security compliance, SSO, and 150-user seat pricing.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": 2,
        "lead_id": 3,
        "lead_name": "Elena Rostova (QuantumScale Tech)",
        "title": "Contract Closing & Implementation Scope",
        "meeting_date": (datetime.now(timezone.utc) + timedelta(days=2)).isoformat(),
        "duration_minutes": 30,
        "status": "Scheduled",
        "notes": "Final procurement sign-off meeting.",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
]

@router.get("", response_model=List[MeetingResponse])
@router.get("/", response_model=List[MeetingResponse], include_in_schema=False)
def get_meetings(db: Session = Depends(get_db)):
    meetings = db.query(Meeting).all()
    if not meetings:
        return DEFAULT_MEETINGS
    return meetings

@router.post("", response_model=MeetingResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=MeetingResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_meeting(meeting_in: MeetingCreate, db: Session = Depends(get_db)):
    meeting = Meeting(
        lead_id=meeting_in.lead_id,
        lead_name=meeting_in.lead_name,
        title=meeting_in.title,
        meeting_date=meeting_in.meeting_date,
        duration_minutes=meeting_in.duration_minutes or 30,
        status=meeting_in.status or "Scheduled",
        notes=meeting_in.notes
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting
