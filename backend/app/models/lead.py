from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime, timezone
from app.core.database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    email = Column(String, nullable=False, index=True)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    status = Column(String, default="New")  # New, Contacted, Qualified, Proposal, Closed
    score = Column(Integer, default=50)      # 0-100
    category = Column(String, default="Warm") # Cold, Warm, Hot
    
    # Real Estate Requirements
    location_preference = Column(String, nullable=True)
    property_type_preference = Column(String, nullable=True)
    bhk_preference = Column(Integer, nullable=True)
    budget_min = Column(Integer, nullable=True)
    budget_max = Column(Integer, nullable=True)
    purpose = Column(String, nullable=True)
    buying_timeline = Column(String, nullable=True)
    
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
