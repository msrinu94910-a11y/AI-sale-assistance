from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BotSettingsUpdate(BaseModel):
    personality: str
    custom_instructions: Optional[str] = None

class BotSettingsResponse(BaseModel):
    personality: str
    custom_instructions: Optional[str] = None
    updated_at: datetime

    class Config:
        from_attributes = True

class KnowledgeDocumentResponse(BaseModel):
    id: int
    filename: str
    status: str
    upload_date: datetime

    class Config:
        from_attributes = True
