# AI Sales Assistant - Python FastAPI Backend

This is the backend service for the **AI Sales Assistant** platform. It is built using Python, FastAPI, SQLAlchemy, Pydantic, and an AI Sales Conversational Engine with BANT Lead Qualification scoring.

## Architecture Layers

```text
API Layer (FastAPI endpoints: auth, leads, chat, analytics, meetings)
    ↓
Service Layer (BANT Scoring Engine, AI Sales Assistant Engine, Analytics Engine)
    ↓
Repository Layer (SQLAlchemy ORM models: User, Lead, Conversation, Meeting)
    ↓
Database Layer (SQLite for local dev, PostgreSQL for production)
```

## Features

- **Lead Qualification Engine**: Automatically evaluates BANT factors (Budget 25%, Need 30%, Authority 20%, Timeline 25%) and assigns a Lead Score (0-100) and Classification (Cold, Warm, Hot).
- **AI Conversation Engine**: Intent detection (pricing, qualification, scheduling, general inquiry), prompt formatting, OpenAI GPT integration support, and intelligent mock fallback.
- **Analytics & Metrics**: Real-time sales summary, lead conversion rates, pipeline evaluation, and upcoming meetings.
- **RESTful Endpoints**: Full CRUD endpoints for leads, chat history, authentication, and meeting management.

## Setup Instructions

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

5. **Run Development Server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

6. **Interactive Documentation**:
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
