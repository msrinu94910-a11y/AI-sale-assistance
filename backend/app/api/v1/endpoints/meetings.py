from typing import List, Optional
from datetime import datetime, timedelta, timezone, date
from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.meeting import Meeting
from app.schemas.meeting import MeetingCreate, MeetingUpdate, MeetingResponse, TimeSlotResponse

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

def validate_meeting_conflict(
    db: Session, 
    meeting_date: datetime, 
    duration_minutes: int = 30, 
    exclude_meeting_id: Optional[int] = None
):
    """
    Check if the proposed meeting time range overlaps with any active (non-Cancelled) meeting.
    Overlap occurs when: (new_start < existing_end) and (new_end > existing_start).
    """
    if meeting_date.tzinfo is None:
        meeting_date = meeting_date.replace(tzinfo=timezone.utc)

    new_start = meeting_date
    new_end = meeting_date + timedelta(minutes=duration_minutes)

    query = db.query(Meeting).filter(Meeting.status != "Cancelled")
    if exclude_meeting_id:
        query = query.filter(Meeting.id != exclude_meeting_id)

    active_meetings = query.all()

    for existing in active_meetings:
        ex_start = existing.meeting_date
        if ex_start.tzinfo is None:
            ex_start = ex_start.replace(tzinfo=timezone.utc)
        ex_end = ex_start + timedelta(minutes=existing.duration_minutes or 30)

        # Overlap condition
        if new_start < ex_end and new_end > ex_start:
            time_str = ex_start.strftime('%I:%M %p')
            end_time_str = ex_end.strftime('%I:%M %p')
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Time slot conflict: Meeting overlaps with '{existing.title}' for {existing.lead_name} ({time_str} - {end_time_str})."
            )

@router.get("", response_model=List[MeetingResponse])
@router.get("/", response_model=List[MeetingResponse], include_in_schema=False)
def get_meetings(db: Session = Depends(get_db)):
    meetings = db.query(Meeting).all()
    if not meetings:
        for m in DEFAULT_MEETINGS:
            m_obj = Meeting(
                lead_id=m["lead_id"],
                lead_name=m["lead_name"],
                title=m["title"],
                meeting_date=datetime.fromisoformat(m["meeting_date"]),
                duration_minutes=m["duration_minutes"],
                status=m["status"],
                notes=m["notes"]
            )
            db.add(m_obj)
        db.commit()
        meetings = db.query(Meeting).all()
    return meetings

@router.get("/available-slots", response_model=List[TimeSlotResponse])
def get_available_slots(
    target_date: str = Query(..., description="Target date string YYYY-MM-DD"),
    duration_minutes: int = Query(30, description="Meeting duration in minutes"),
    db: Session = Depends(get_db)
):
    try:
        parsed_date = datetime.strptime(target_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    # Get all active meetings for that date
    active_meetings = db.query(Meeting).filter(Meeting.status != "Cancelled").all()

    # Standard slot hours (9 AM to 5 PM)
    slot_hours = [
        (9, 0), (9, 30), (10, 0), (10, 30), (11, 0), (11, 30),
        (13, 0), (13, 30), (14, 0), (14, 30), (15, 0), (15, 30), (16, 0), (16, 30)
    ]

    slots = []
    for h, m in slot_hours:
        slot_start = datetime(parsed_date.year, parsed_date.month, parsed_date.day, h, m, tzinfo=timezone.utc)
        slot_end = slot_start + timedelta(minutes=duration_minutes)
        time_label = slot_start.strftime("%I:%M %p")

        is_available = True
        conflict_title = None
        conflict_lead = None

        for existing in active_meetings:
            ex_start = existing.meeting_date
            if ex_start.tzinfo is None:
                ex_start = ex_start.replace(tzinfo=timezone.utc)
            ex_end = ex_start + timedelta(minutes=existing.duration_minutes or 30)

            if slot_start < ex_end and slot_end > ex_start:
                is_available = False
                conflict_title = existing.title
                conflict_lead = existing.lead_name
                break

        slots.append(TimeSlotResponse(
            time=time_label,
            datetime=slot_start.isoformat(),
            available=is_available,
            conflict_title=conflict_title,
            conflict_lead=conflict_lead
        ))

    return slots

@router.post("", response_model=MeetingResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=MeetingResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_meeting(meeting_in: MeetingCreate, db: Session = Depends(get_db)):
    # Validate conflict before saving
    validate_meeting_conflict(
        db=db, 
        meeting_date=meeting_in.meeting_date, 
        duration_minutes=meeting_in.duration_minutes or 30
    )

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

@router.put("/{meeting_id}", response_model=MeetingResponse)
def update_meeting(meeting_id: int, meeting_in: MeetingUpdate, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    update_data = meeting_in.dict(exclude_unset=True)
    
    # Target date and duration for conflict checking
    target_date = update_data.get("meeting_date", meeting.meeting_date)
    target_duration = update_data.get("duration_minutes", meeting.duration_minutes or 30)
    target_status = update_data.get("status", meeting.status)

    if target_status != "Cancelled":
        validate_meeting_conflict(
            db=db,
            meeting_date=target_date,
            duration_minutes=target_duration,
            exclude_meeting_id=meeting_id
        )

    for field, value in update_data.items():
        setattr(meeting, field, value)
    
    db.commit()
    db.refresh(meeting)
    return meeting

@router.delete("/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if meeting:
        db.delete(meeting)
        db.commit()
    return None
