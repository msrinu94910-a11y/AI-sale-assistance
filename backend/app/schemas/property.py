from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PropertyBase(BaseModel):
    name: str
    description: Optional[str] = None
    location: str
    property_type: str
    bhk: Optional[int] = None
    price: int
    area: Optional[str] = None
    amenities: Optional[str] = None
    status: Optional[str] = "AVAILABLE"

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    property_type: Optional[str] = None
    bhk: Optional[int] = None
    price: Optional[int] = None
    area: Optional[str] = None
    amenities: Optional[str] = None
    status: Optional[str] = None

class PropertyResponse(PropertyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PropertySearchRequest(BaseModel):
    location: Optional[str] = None
    property_type: Optional[str] = None
    bhk: Optional[int] = None
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    status: Optional[str] = None
