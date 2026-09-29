import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.settings import BotSettings, KnowledgeDocument
from app.schemas.settings import BotSettingsUpdate, BotSettingsResponse, KnowledgeDocumentResponse
from app.services.rag_service import rag_service

router = APIRouter()

UPLOAD_DIR = "./knowledge_docs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("", response_model=BotSettingsResponse)
def get_bot_settings(db: Session = Depends(get_db)):
    settings = db.query(BotSettings).first()
    if not settings:
        settings = BotSettings(personality="Professional", custom_instructions="")
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("", response_model=BotSettingsResponse)
def update_bot_settings(update_data: BotSettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(BotSettings).first()
    if not settings:
        settings = BotSettings()
        db.add(settings)
    
    settings.personality = update_data.personality
    settings.custom_instructions = update_data.custom_instructions
    db.commit()
    db.refresh(settings)
    return settings

@router.get("/documents", response_model=List[KnowledgeDocumentResponse])
def get_knowledge_documents(db: Session = Depends(get_db)):
    return db.query(KnowledgeDocument).order_by(KnowledgeDocument.upload_date.desc()).all()

@router.post("/documents", response_model=KnowledgeDocumentResponse)
def upload_knowledge_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Add record to DB
    doc = KnowledgeDocument(
        filename=file.filename,
        file_path=file_path,
        status="Processing"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    # Process RAG in background
    def process_rag_background(doc_id: int, file_path: str):
        try:
            rag_service.add_document(str(doc_id), file_path)
            status = "Processed"
        except Exception as e:
            status = f"Failed: {str(e)}"
            
        from app.core.database import SessionLocal
        bg_db = SessionLocal()
        bg_doc = bg_db.query(KnowledgeDocument).filter(KnowledgeDocument.id == doc_id).first()
        if bg_doc:
            bg_doc.status = status
            bg_db.commit()
        bg_db.close()
        
    background_tasks.add_task(process_rag_background, doc.id, file_path)
    
    return doc

@router.delete("/documents/{doc_id}")
def delete_knowledge_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(KnowledgeDocument).filter(KnowledgeDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Delete from RAG vector DB
    rag_service.delete_document(str(doc.id))
    
    # Delete file
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)
        
    db.delete(doc)
    db.commit()
    return {"status": "success"}
