from fastapi import APIRouter
from app.api.v1.endpoints import auth, leads, analytics, meetings, bot

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(leads.router, prefix="/leads", tags=["Leads & Scoring"])
api_router.include_router(bot.router, prefix="/bot", tags=["Sales Assistant Bot API"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics & KPIs"])
api_router.include_router(meetings.router, prefix="/meetings", tags=["Meeting Management"])
