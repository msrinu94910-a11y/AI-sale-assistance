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
    
    # BANT Scoring attributes (0-100 each)
    budget = Column(Integer, default=50)
    need = Column(Integer, default=50)
    authority = Column(Integer, default=50)
    timeline = Column(Integer, default=50)
    
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
