from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class LeadBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    status: Optional[str] = "New"
    location_preference: Optional[str] = None
    property_type_preference: Optional[str] = None
    bhk_preference: Optional[int] = None
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    purpose: Optional[str] = None
    buying_timeline: Optional[str] = None
    notes: Optional[str] = None
    
    # BANT Scoring fields (Frontend expects these)
    budget: Optional[int] = 50
    need: Optional[int] = 50
    authority: Optional[int] = 50
    timeline: Optional[int] = 50

class LeadCreate(LeadBase):
    pass

class LeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    status: Optional[str] = None
    location_preference: Optional[str] = None
    property_type_preference: Optional[str] = None
    bhk_preference: Optional[int] = None
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    purpose: Optional[str] = None
    buying_timeline: Optional[str] = None
    notes: Optional[str] = None

class LeadResponse(LeadBase):
    id: int
    score: int
    category: str
    created_at: datetime

    class Config:
        from_attributes = True
