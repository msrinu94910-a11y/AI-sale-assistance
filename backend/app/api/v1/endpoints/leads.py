from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadUpdate, LeadResponse
from app.services.lead_qualification import LeadQualificationEngine

router = APIRouter()

# Seed default mock data if database is empty for seamless demo
DEFAULT_LEADS = [
    {
        "id": 1,
        "name": "Sarah Connor",
        "email": "sarah@cyberdyne.io",
        "phone": "+1 555-0192",
        "company": "Cyberdyne Systems",
        "status": "Qualified",
        "budget": 90,
        "need": 85,
        "authority": 80,
        "timeline": 95,
        "score": 88,
        "category": "Hot",
        "notes": "Looking for Enterprise AI CRM integration for 150+ reps.",
        "created_at": "2026-08-28T10:30:00Z"
    },
    {
        "id": 2,
        "name": "Marcus Vance",
        "email": "m.vance@apexdynamics.com",
        "phone": "+1 555-0144",
        "company": "Apex Dynamics",
        "status": "Contacted",
        "budget": 70,
        "need": 65,
        "authority": 60,
        "timeline": 50,
        "score": 62,
        "category": "Warm",
        "notes": "Interested in automated email follow-ups and lead scoring.",
        "created_at": "2026-08-29T14:15:00Z"
    },
    {
        "id": 3,
        "name": "Elena Rostova",
        "email": "elena@quantumscale.tech",
        "phone": "+1 555-0188",
        "company": "QuantumScale Tech",
        "status": "Proposal",
        "budget": 95,
        "need": 90,
        "authority": 85,
        "timeline": 90,
        "score": 91,
        "category": "Hot",
        "notes": "Contract in final legal review for Q4 deployment.",
        "created_at": "2026-08-30T09:00:00Z"
    },
    {
        "id": 4,
        "name": "David Miller",
        "email": "d.miller@horizoncloud.org",
        "phone": "+1 555-0122",
        "company": "Horizon Cloud",
        "status": "New",
        "budget": 30,
        "need": 40,
        "authority": 30,
        "timeline": 20,
        "score": 31,
        "category": "Cold",
        "notes": "Initial inquiry downloaded product whitepaper.",
        "created_at": "2026-09-01T16:45:00Z"
    }
]

@router.get("", response_model=List[LeadResponse])
@router.get("/", response_model=List[LeadResponse], include_in_schema=False)
def get_leads(category: Optional[str] = None, db: Session = Depends(get_db)):
    leads = db.query(Lead).all()
    if not leads:
        # Fallback to seeded demo leads
        filtered = DEFAULT_LEADS
        if category:
            filtered = [l for l in DEFAULT_LEADS if l["category"].lower() == category.lower()]
        return filtered

    if category:
        leads = [l for l in leads if l.category.lower() == category.lower()]
    return leads

@router.post("", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=LeadResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_lead(lead_in: LeadCreate, db: Session = Depends(get_db)):
    eval_result = LeadQualificationEngine.evaluate_lead(
        budget=lead_in.budget or 50,
        need=lead_in.need or 50,
        authority=lead_in.authority or 50,
        timeline=lead_in.timeline or 50
    )
    
    lead = Lead(
        name=lead_in.name,
        email=lead_in.email,
        phone=lead_in.phone,
        company=lead_in.company,
        status=lead_in.status or "New",
        budget=lead_in.budget or 50,
        need=lead_in.need or 50,
        authority=lead_in.authority or 50,
        timeline=lead_in.timeline or 50,
        score=eval_result["score"],
        category=eval_result["category"],
        notes=lead_in.notes
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead

@router.put("/{lead_id}", response_model=LeadResponse)
def update_lead(lead_id: int, lead_in: LeadUpdate, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        # Check mock list for dev preview response
        mock = next((l for l in DEFAULT_LEADS if l["id"] == lead_id), None)
        if mock:
            mock.update({k: v for k, v in lead_in.dict().items() if v is not None})
            eval_result = LeadQualificationEngine.evaluate_lead(
                budget=mock["budget"], need=mock["need"],
                authority=mock["authority"], timeline=mock["timeline"]
            )
            mock["score"] = eval_result["score"]
            mock["category"] = eval_result["category"]
            return mock
        raise HTTPException(status_code=404, detail="Lead not found")
    
    update_data = lead_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(lead, field, value)
    
    # Recalculate BANT score
    eval_result = LeadQualificationEngine.evaluate_lead(
        budget=lead.budget,
        need=lead.need,
        authority=lead.authority,
        timeline=lead.timeline
    )
    lead.score = eval_result["score"]
    lead.category = eval_result["category"]
    
    db.commit()
    db.refresh(lead)
    return lead

@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if lead:
        db.delete(lead)
        db.commit()
    return None
