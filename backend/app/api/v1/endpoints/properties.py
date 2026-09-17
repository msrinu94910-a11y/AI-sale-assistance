from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.repositories.property_repository import PropertyRepository
from app.schemas.property import PropertyResponse, PropertySearchRequest, PropertyCreate, PropertyUpdate

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

@router.post("/", response_model=PropertyResponse)
def create_property(property_in: PropertyCreate, db: Session = Depends(get_db)):
    """
    Create a new property.
    """
    return PropertyRepository.create(db, property_in)

@router.put("/{property_id}", response_model=PropertyResponse)
def update_property(property_id: int, property_in: PropertyUpdate, db: Session = Depends(get_db)):
    """
    Update a property by ID.
    """
    db_property = PropertyRepository.get_by_id(db, property_id)
    if not db_property:
        raise HTTPException(status_code=404, detail="Property not found")
    return PropertyRepository.update(db, db_property, property_in)

@router.delete("/{property_id}")
def delete_property(property_id: int, db: Session = Depends(get_db)):
    """
    Delete a property by ID.
    """
    if not PropertyRepository.delete(db, property_id):
        raise HTTPException(status_code=404, detail="Property not found")
    return {"detail": "Property deleted successfully"}

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
