from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from datetime import datetime, timezone
from app.core.database import Base

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    location = Column(String, nullable=False, index=True)
    property_type = Column(String, nullable=False, index=True) # Villa, Apartment, Plot, etc.
    bhk = Column(Integer, nullable=True)
    price = Column(Integer, nullable=False) # Store in smallest unit or raw integer (e.g. 15000000 for 1.5 Cr)
    area = Column(String, nullable=True) # e.g. "2500 sqft"
    amenities = Column(Text, nullable=True) # comma separated list of amenities
    status = Column(String, default="AVAILABLE") # AVAILABLE, RESERVED, SOLD, INACTIVE
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
