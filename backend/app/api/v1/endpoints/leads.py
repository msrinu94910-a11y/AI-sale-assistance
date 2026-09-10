import csv
import io
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response, UploadFile, File
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
        "budget_max": 20000000,
        "location_preference": "Gachibowli",
        "property_type_preference": "Villa",
        "buying_timeline": "Within 3 months",
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
        "budget_max": 15000000,
        "location_preference": "Kondapur",
        "property_type_preference": "Apartment",
        "buying_timeline": "Within 6 months",
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
        "budget_max": 30000000,
        "location_preference": "Jubilee Hills",
        "property_type_preference": "Villa",
        "buying_timeline": "Immediately",
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
        "budget_max": 8000000,
        "location_preference": "Narsingi",
        "property_type_preference": "Plot",
        "buying_timeline": "1 year",
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
        for d in DEFAULT_LEADS:
            l_obj = Lead(
                name=d["name"],
                email=d["email"],
                phone=d["phone"],
                company=d["company"],
                status=d["status"],
                budget_max=d["budget_max"],
                location_preference=d["location_preference"],
                property_type_preference=d["property_type_preference"],
                buying_timeline=d["buying_timeline"],
                score=d["score"],
                category=d["category"],
                notes=d["notes"]
            )
            db.add(l_obj)
        db.commit()
        leads = db.query(Lead).all()

    if category:
        leads = [l for l in leads if l.category.lower() == category.lower()]
    return leads

@router.get("/export")
@router.get("/export/", include_in_schema=False)
def export_leads(category: Optional[str] = None, db: Session = Depends(get_db)):
    leads = db.query(Lead).all()
    if not leads:
        leads_data = DEFAULT_LEADS
    else:
        leads_data = [
            {
                "id": l.id,
                "name": l.name,
                "email": l.email,
                "phone": l.phone or "",
                "company": l.company or "",
                "status": l.status or "New",
                "budget_max": l.budget_max,
                "location_preference": l.location_preference or "",
                "property_type_preference": l.property_type_preference or "",
                "buying_timeline": l.buying_timeline or "",
                "score": l.score or 50,
                "category": l.category or "Warm",
                "notes": l.notes or "",
                "created_at": l.created_at.isoformat() if l.created_at else ""
            }
            for l in leads
        ]

    if category:
        leads_data = [l for l in leads_data if (l.get("category") or "").lower() == category.lower()]

    output = io.StringIO()
    fieldnames = ["id", "name", "email", "phone", "company", "status", "budget_max", "location_preference", "property_type_preference", "buying_timeline", "score", "category", "notes", "created_at"]
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    for row in leads_data:
        writer.writerow({k: row.get(k, "") for k in fieldnames})

    csv_content = output.getvalue()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leads_export.csv"}
    )

@router.post("/import")
@router.post("/import/", include_in_schema=False)
async def import_leads(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    contents = await file.read()
    try:
        text_data = contents.decode('utf-8-sig')
    except Exception:
        text_data = contents.decode('latin-1')
        
    stream = io.StringIO(text_data)
    reader = csv.DictReader(stream)
    
    imported_leads = []
    errors = []
    row_index = 1

    for row in reader:
        row_index += 1
        normalized_row = { (k.strip().lower() if k else ''): (v.strip() if v else '') for k, v in row.items() }
        
        name = normalized_row.get('name') or normalized_row.get('full name') or normalized_row.get('lead name')
        email = normalized_row.get('email') or normalized_row.get('email address')
        
        if not name or not email:
            errors.append(f"Row {row_index}: Missing required Name or Email field")
            continue
            
        phone = normalized_row.get('phone') or normalized_row.get('phone number') or None
        company = normalized_row.get('company') or normalized_row.get('organization') or None
        status_val = normalized_row.get('status') or "New"
        notes = normalized_row.get('notes') or None
        
        def parse_int(val, default=50):
            try:
                return int(float(val)) if val != '' else default
            except (ValueError, TypeError):
                return default
                
        budget_max = parse_int(normalized_row.get('budget_max'))
        
        # We don't have a LeadQualificationEngine scoring model for the new schema yet, 
        # so just insert with default score.
        score = 50
        category = "Warm"
        
        db_lead = Lead(
            name=name,
            email=email,
            phone=phone,
            company=company,
            status=status_val,
            budget_max=budget_max,
            location_preference=normalized_row.get('location_preference'),
            property_type_preference=normalized_row.get('property_type_preference'),
            buying_timeline=normalized_row.get('buying_timeline'),
            score=score,
            category=category,
            notes=notes
        )
        db.add(db_lead)
        imported_leads.append(db_lead)

    db.commit()
    for l in imported_leads:
        db.refresh(l)
        
    return {
        "success": True,
        "imported_count": len(imported_leads),
        "errors": errors,
        "leads": [LeadResponse.model_validate(l) if hasattr(LeadResponse, "model_validate") else LeadResponse.from_orm(l) for l in imported_leads]
    }

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
