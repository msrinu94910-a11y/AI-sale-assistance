from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.property import Property
from app.schemas.property import PropertySearchRequest

class PropertyRepository:
    @staticmethod
    def get_by_id(db: Session, property_id: int) -> Optional[Property]:
        return db.query(Property).filter(Property.id == property_id).first()

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Property]:
        return db.query(Property).offset(skip).limit(limit).all()

    @staticmethod
    def search(db: Session, search_req: PropertySearchRequest) -> List[Property]:
        query = db.query(Property)
        
        # Always prefer available status if not specified
        if search_req.status:
            query = query.filter(Property.status == search_req.status)
        else:
            query = query.filter(Property.status == "AVAILABLE")
            
        if search_req.location:
            query = query.filter(Property.location.ilike(f"%{search_req.location}%"))
            
        if search_req.property_type:
            query = query.filter(Property.property_type.ilike(f"%{search_req.property_type}%"))
            
        if search_req.bhk is not None:
            query = query.filter(Property.bhk == search_req.bhk)
            
        if search_req.budget_min is not None:
            query = query.filter(Property.price >= search_req.budget_min)
            
        if search_req.budget_max is not None:
            query = query.filter(Property.price <= search_req.budget_max)
            
        return query.all()

    @staticmethod
    def get_available(db: Session, skip: int = 0, limit: int = 100) -> List[Property]:
        return db.query(Property).filter(Property.status == "AVAILABLE").offset(skip).limit(limit).all()
