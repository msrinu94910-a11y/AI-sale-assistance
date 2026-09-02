from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class LeadBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    status: Optional[str] = "New"
    budget: Optional[int] = 50
    need: Optional[int] = 50
    authority: Optional[int] = 50
    timeline: Optional[int] = 50
    notes: Optional[str] = None

class LeadCreate(LeadBase):
    pass

class LeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    status: Optional[str] = None
    budget: Optional[int] = None
    need: Optional[int] = None
    authority: Optional[int] = None
    timeline: Optional[int] = None
    notes: Optional[str] = None

class LeadResponse(LeadBase):
    id: int
    score: int
    category: str
    created_at: datetime

    class Config:
        from_attributes = True
