from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from datetime import datetime, timezone
from app.core.database import Base

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, nullable=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=True)
    sender = Column(String, default="user") # user, assistant, system
    message = Column(Text, nullable=False)
    intent = Column(String, nullable=True)   # inquiry, qualification, scheduling, pricing
    confidence = Column(String, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
