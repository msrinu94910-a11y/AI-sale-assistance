from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.repositories.property_repository import PropertyRepository
from app.schemas.property import PropertyResponse, PropertySearchRequest

router = APIRouter()

@router.get("/", response_model=List[PropertyResponse])
def get_properties(
    skip: int = 0, 
    limit: int = 100, 
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve properties.
    """
    if status:
        search_req = PropertySearchRequest(status=status)
        return PropertyRepository.search(db, search_req)
    return PropertyRepository.get_all(db, skip=skip, limit=limit)

@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(property_id: int, db: Session = Depends(get_db)):
    """
    Get property by ID.
    """
    property = PropertyRepository.get_by_id(db, property_id)
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    return property

@router.post("/search", response_model=List[PropertyResponse])
def search_properties(search_req: PropertySearchRequest, db: Session = Depends(get_db)):
    """
    Search for properties based on criteria.
    """
    return PropertyRepository.search(db, search_req)

class CompareRequest(BaseModel):
    property_ids: List[int]

@router.post("/compare", response_model=List[PropertyResponse])
def compare_properties(req: CompareRequest, db: Session = Depends(get_db)):
    """
    Compare multiple properties by ID.
    """
    properties = []
    for pid in req.property_ids:
        prop = PropertyRepository.get_by_id(db, pid)
        if prop:
            properties.append(prop)
    return properties
