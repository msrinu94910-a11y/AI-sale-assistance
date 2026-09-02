# AI Sales Assistant — Technical Requirements Document (TRD)

**Document Version:** 1.0  
**Status:** Draft / Assignment Baseline  
**Related Document:** PRD.md  
**Product:** AI-powered Website Sales Assistant  
**Primary Backend:** Python + FastAPI  
**Frontend:** HTML5 + CSS3 + JavaScript  
**AI:** OpenAI API  
**Database:** SQLite + SQLAlchemy, PostgreSQL-ready  
**Architecture:** Layered / Modular API Architecture  
**RAG:** Not used in MVP

---

# 1. Technical Overview

The AI Sales Assistant will be implemented as a lightweight Python web application.

The system will use:

```text
Frontend
   ↓
FastAPI REST API
   ↓
Application Services
   ├── AI Service
   ├── Requirement Service
   ├── Property Service
   ├── Recommendation Service
   ├── Comparison Service
   └── Booking Service
   ↓
SQLAlchemy ORM
   ↓
SQLite Database
```

The OpenAI API will be accessed only from the backend.

The frontend will never receive the AI provider's secret API key.

---

# 2. Technology Stack

## 2.1 Frontend

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Responsive UI and chatbot styling |
| JavaScript ES6+ | Chat interaction and API calls |
| Fetch API | HTTP communication with FastAPI |

### Optional Future Frontend

The API will be designed so that React or Next.js can replace the initial HTML/JavaScript frontend without changing core backend business logic.

---

# 3. Backend Stack

## 3.1 Python

Recommended Python version:

```text
Python 3.11+
```

Python will be used for:

- API development
- AI integration
- business logic
- validation
- database access
- recommendation processing
- booking workflow

---

## 3.2 FastAPI

FastAPI will expose REST endpoints for:

- chat
- property search
- property retrieval
- comparison
- site-visit booking
- health checks

FastAPI is also responsible for:

- request validation
- response serialization
- dependency injection
- API documentation

---

# 4. Backend Packages

Recommended `requirements.txt`:

```txt
fastapi
uvicorn[standard]
openai
sqlalchemy
pydantic
pydantic-settings
python-dotenv
httpx
```

Recommended optional packages:

```txt
slowapi
alembic
pytest
pytest-asyncio
```

### Package Responsibilities

| Package | Responsibility |
|---|---|
| fastapi | Web API framework |
| uvicorn | ASGI server |
| openai | OpenAI API integration |
| sqlalchemy | ORM and database access |
| pydantic | Data validation |
| pydantic-settings | Environment configuration |
| python-dotenv | Local environment loading |
| httpx | HTTP client support |
| slowapi | API rate limiting |
| alembic | Database migrations |
| pytest | Automated testing |

---

# 5. Database Technology

## 5.1 MVP

Use:

```text
SQLite
```

Reasons:

- Simple setup
- No separate database server
- Suitable for assignment development
- Easy local testing

## 5.2 Production Path

The application should remain PostgreSQL-compatible.

Database URL should be configurable through environment variables.

Example:

```env
DATABASE_URL=sqlite:///./app.db
```

Later:

```env
DATABASE_URL=postgresql+psycopg://user:password@host/database
```

The application should not hard-code the database engine.

---

# 6. ORM and Data Access

Use SQLAlchemy 2.x.

The application should follow:

```text
API
 ↓
Service
 ↓
Repository / Data Access
 ↓
SQLAlchemy
 ↓
Database
```

Business logic should not be placed directly inside route handlers.

---

# 7. AI Integration

## 7.1 AI Provider

The MVP uses the OpenAI API.

The API key must be stored in an environment variable:

```env
OPENAI_API_KEY=your_secret_key
```

Never commit the key to Git.

---

## 7.2 AI Responsibilities

The AI layer will handle:

- intent detection
- natural-language understanding
- requirement extraction
- conversational response generation
- follow-up question generation
- natural-language property explanations
- comparison summaries

The AI will not directly:

- query the database
- modify property records
- create bookings without backend validation
- determine whether a property exists
- invent inventory

---

# 8. Non-RAG Architecture

The MVP explicitly does not use Retrieval-Augmented Generation.

Instead, use tool-like application flow:

```text
User Message
     ↓
AI Intent / Extraction
     ↓
FastAPI Business Logic
     ↓
Database Query
     ↓
Verified Data
     ↓
AI Response Generation
```

Example:

```text
User:
Show me 3 BHK villas under 1 crore in Hyderabad.

AI extraction:
{
  "intent": "PROPERTY_SEARCH",
  "location": "Hyderabad",
  "property_type": "Villa",
  "bhk": 3,
  "budget_max": 10000000
}

Backend:
Search database

Database:
Return matching properties

AI:
Explain results
```

This approach avoids creating a vector database for the MVP.

---

# 9. API Architecture

Base URL:

```text
/api/v1
```

Recommended endpoints:

```text
GET    /api/v1/health

POST   /api/v1/chat

GET    /api/v1/properties
GET    /api/v1/properties/{property_id}

POST   /api/v1/properties/search

POST   /api/v1/properties/compare

POST   /api/v1/bookings/site-visit
GET    /api/v1/bookings/{booking_id}
```

---

# 10. Chat API

## Endpoint

```text
POST /api/v1/chat
```

### Request

```json
{
  "session_id": "uuid",
  "message": "I need a 3 BHK in Hyderabad under 1 crore"
}
```

### Response

```json
{
  "session_id": "uuid",
  "intent": "PROPERTY_SEARCH",
  "message": "I found some properties matching your requirements.",
  "requirements": {
    "location": "Hyderabad",
    "property_type": null,
    "bhk": 3,
    "budget_min": null,
    "budget_max": 10000000
  },
  "properties": []
}
```

The response may contain:

- assistant message
- extracted requirements
- property results
- suggested actions
- booking state

---

# 11. Intent Detection

The system should support configurable intent categories:

```text
GREETING
PROPERTY_SEARCH
BUDGET_SEARCH
LOCATION_SEARCH
PROPERTY_DETAILS
COMPARE_PROPERTIES
BOOK_SITE_VISIT
UPDATE_REQUIREMENTS
HELP
UNKNOWN
```

The AI should return structured intent information.

The backend validates the resulting structure before using it.

---

# 12. Structured AI Output

The AI extraction layer should produce structured JSON.

Example:

```json
{
  "intent": "PROPERTY_SEARCH",
  "requirements": {
    "location": "Gachibowli",
    "property_type": "Apartment",
    "bhk": 3,
    "budget_min": null,
    "budget_max": 9000000
  },
  "missing_fields": []
}
```

Pydantic models should validate this response.

Invalid AI output must not be trusted directly.

---

# 13. Requirement Extraction

Create a Pydantic model similar to:

```python
class PropertyRequirements(BaseModel):
    location: str | None = None
    property_type: str | None = None
    bhk: int | None = None
    budget_min: int | None = None
    budget_max: int | None = None
    purpose: str | None = None
    buying_timeline: str | None = None
```

Additional customer fields:

```python
class CustomerDetails(BaseModel):
    name: str | None = None
    phone: str | None = None
    email: str | None = None
```

---

# 14. Session Management

The MVP can use server-side session persistence backed by the database.

Each chat session should have:

```text
session_id
created_at
updated_at
customer details
requirements
last intent
selected properties
```

Conversation messages may be stored as:

```text
role
content
created_at
```

Supported roles:

```text
user
assistant
system
```

The system should limit conversation history sent to the AI to the context actually required.

---

# 15. Property Search Engine

Property search should be implemented as deterministic backend logic.

Example filters:

```python
query = select(Property).where(
    Property.status == "AVAILABLE"
)
```

Then conditionally apply:

```text
location
property_type
bhk
price >= budget_min
price <= budget_max
```

This keeps inventory search independent from the AI model.

---

# 16. Recommendation Logic

The recommendation service should rank matching properties.

Suggested scoring model:

```text
Location exact match      +30
Property type exact       +20
BHK exact                 +20
Within budget             +20
Available status          +10
------------------------------
Maximum                    100
```

The scoring weights should be configurable.

Example:

```text
Property A → 95
Property B → 85
Property C → 70
```

The top results should be returned to the frontend.

This is a business-rule ranking system, not an ML recommendation engine.

---

# 17. Budget Normalization

Natural-language budget expressions should be converted into numeric INR values.

Examples:

```text
80 lakhs
→ 8,000,000

1 crore
→ 10,000,000

1.2 crore
→ 12,000,000
```

The normalization layer should handle common variations such as:

```text
lakh
lakhs
lac
crore
cr
```

Currency defaults to INR for this project unless explicitly configured otherwise.

---

# 18. Location Normalization

The system should normalize common location input before searching.

Example:

```text
"gachibowli"
"Gachibowli"
"GACHIBOWLI"
```

should map to a consistent normalized value.

Initially, use application-controlled location values.

---

# 19. Property Details API

## Endpoint

```text
GET /api/v1/properties/{property_id}
```

Response:

```json
{
  "id": 1,
  "name": "Green Valley Villas",
  "description": "Premium villa community",
  "location": "Gachibowli",
  "property_type": "Villa",
  "bhk": 4,
  "price": 13500000,
  "area": 2450,
  "amenities": [
    "Clubhouse",
    "Swimming Pool",
    "Gym"
  ],
  "status": "AVAILABLE"
}
```

Only fields actually stored in the database should be exposed.

---

# 20. Comparison API

## Endpoint

```text
POST /api/v1/properties/compare
```

### Request

```json
{
  "property_ids": [1, 2]
}
```

### Response

```json
{
  "properties": [
    {
      "id": 1,
      "name": "Property A",
      "price": 8500000,
      "location": "Gachibowli",
      "bhk": 3,
      "area": 1650
    },
    {
      "id": 2,
      "name": "Property B",
      "price": 9200000,
      "location": "Kondapur",
      "bhk": 3,
      "area": 1720
    }
  ]
}
```

The backend provides factual comparison data.

The AI can generate an optional natural-language summary.

---

# 21. Site Visit Booking API

## Endpoint

```text
POST /api/v1/bookings/site-visit
```

### Request

```json
{
  "session_id": "uuid",
  "property_id": 1,
  "customer": {
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com"
  },
  "visit_date": "2026-09-14",
  "visit_time": "11:00"
}
```

### Response

```json
{
  "booking_id": 101,
  "booking_reference": "SV-20260914-001",
  "status": "REQUESTED",
  "property_id": 1,
  "visit_date": "2026-09-14",
  "visit_time": "11:00"
}
```

The booking must only be created after backend validation.

---

# 22. Booking Validation

The service must validate:

- Property exists.
- Property is eligible for site visits.
- Customer name is present.
- Phone number is valid enough for the application's format.
- Date is valid.
- Date is not obviously in the past.
- Time is valid.
- Required confirmation has occurred.

Future calendar availability integration is out of scope for MVP.

---

# 23. Database Models

Minimum models:

```text
Property
ChatSession
ChatMessage
Lead
SiteVisitBooking
```

Potential relationships:

```text
ChatSession
 ├── ChatMessage
 └── Lead

Lead
 └── SiteVisitBooking

Property
 └── SiteVisitBooking
```

Detailed fields are defined in the database design document.

---

# 24. Service Layer

Recommended service modules:

```text
AIService
ChatService
RequirementService
PropertyService
RecommendationService
ComparisonService
BookingService
SessionService
```

### AIService

Handles:

- OpenAI API calls
- intent extraction
- structured responses
- assistant response generation

### PropertyService

Handles:

- property retrieval
- search
- filtering
- availability checks

### RecommendationService

Handles:

- match scoring
- ranking
- fallback recommendations

### ComparisonService

Handles:

- selected property validation
- comparison preparation

### BookingService

Handles:

- booking validation
- reference generation
- persistence

---

# 25. Repository Layer

Where practical, isolate database operations.

Example:

```text
repositories/
├── property_repository.py
├── session_repository.py
├── lead_repository.py
└── booking_repository.py
```

This prevents SQLAlchemy queries from spreading through the entire application.

---

# 26. API Schemas

Create separate Pydantic schemas for:

```text
chat requests/responses
property responses
property search
comparison
customer
lead
booking
errors
```

Do not expose SQLAlchemy model objects directly as the public API contract.

---

# 27. Error Handling

Use a consistent API error format.

Example:

```json
{
  "success": false,
  "error": {
    "code": "PROPERTY_NOT_FOUND",
    "message": "The requested property could not be found."
  }
}
```

Recommended codes:

```text
INVALID_REQUEST
PROPERTY_NOT_FOUND
NO_MATCHING_PROPERTIES
BOOKING_VALIDATION_ERROR
AI_SERVICE_ERROR
DATABASE_ERROR
RATE_LIMITED
INTERNAL_SERVER_ERROR
```

Sensitive internal details must not be returned to the browser.

---

# 28. HTTP Status Codes

Recommended usage:

```text
200 OK
201 Created
400 Bad Request
404 Not Found
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
```

---

# 29. Security Requirements

## API Key Security

```text
Backend .env
     ↓
Python configuration
     ↓
OpenAI client
```

Never:

```text
Frontend
     ↓
OpenAI API directly
```

## Input Validation

Validate:

- message length
- session ID format
- property IDs
- phone
- email
- dates
- time
- budget

## Rate Limiting

Chat endpoints should have basic per-client/session rate limiting.

---

# 30. CORS

During development, configure allowed origins explicitly.

Example:

```python
allowed_origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500"
]
```

For deployment, use the actual frontend domain.

Do not use unrestricted CORS in production unless specifically required.

---

# 31. Environment Configuration

Example `.env`:

```env
APP_NAME=AI Sales Assistant
APP_ENV=development
DEBUG=true

OPENAI_API_KEY=your_api_key

DATABASE_URL=sqlite:///./app.db

ALLOWED_ORIGINS=http://localhost:5500

RATE_LIMIT_PER_MINUTE=30
```

`.env` must be included in `.gitignore`.

Provide `.env.example` without secrets.

---

# 32. Project Structure

Recommended high-quality structure:

```text
ai-sales-assistant/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   │
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── router.py
│   │   │       ├── chat.py
│   │   │       ├── properties.py
│   │   │       └── bookings.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── logging.py
│   │   │
│   │   ├── database/
│   │   │   ├── database.py
│   │   │   └── base.py
│   │   │
│   │   ├── models/
│   │   │   ├── property.py
│   │   │   ├── session.py
│   │   │   ├── message.py
│   │   │   ├── lead.py
│   │   │   └── booking.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── chat.py
│   │   │   ├── property.py
│   │   │   ├── comparison.py
│   │   │   └── booking.py
│   │   │
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   ├── chat_service.py
│   │   │   ├── requirement_service.py
│   │   │   ├── property_service.py
│   │   │   ├── recommendation_service.py
│   │   │   ├── comparison_service.py
│   │   │   └── booking_service.py
│   │   │
│   │   └── repositories/
│   │       ├── property_repository.py
│   │       ├── session_repository.py
│   │       ├── lead_repository.py
│   │       └── booking_repository.py
│   │
│   ├── tests/
│   ├── requirements.txt
│   ├── .env.example
│   └── alembic.ini
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       ├── chat.js
│       └── api.js
│
├── docs/
│
├── .gitignore
└── README.md
```

---

# 33. Request Flow

## 33.1 Normal Chat

```text
Browser
  ↓
POST /api/v1/chat
  ↓
Chat Router
  ↓
Chat Service
  ↓
AI Service
  ↓
OpenAI API
  ↓
Structured AI result
  ↓
Requirement validation
  ↓
Property Service
  ↓
Database
  ↓
Recommendation Service
  ↓
AI response generation
  ↓
API Response
  ↓
Browser
```

---

# 34. Property Search Flow

```text
User Message
      ↓
Intent Detection
      ↓
Requirement Extraction
      ↓
Pydantic Validation
      ↓
Property Search Service
      ↓
SQLAlchemy Query
      ↓
SQLite
      ↓
Matching Properties
      ↓
Recommendation Ranking
      ↓
Frontend Property Cards
```

---

# 35. Comparison Flow

```text
User selects Property A + Property B
               ↓
Frontend sends property IDs
               ↓
Comparison API
               ↓
Property Service
               ↓
Database
               ↓
Verified property records
               ↓
Comparison response
               ↓
Frontend comparison table
               ↓
Optional AI summary
```

---

# 36. Site Visit Flow

```text
User selects property
        ↓
AI asks for date
        ↓
AI asks for time
        ↓
Customer confirms
        ↓
Frontend sends booking request
        ↓
Booking API
        ↓
Validation
        ↓
Property eligibility check
        ↓
Create booking
        ↓
Generate reference
        ↓
Return confirmation
```

---

# 37. AI Prompt Architecture

Use separate prompt responsibilities rather than one uncontrolled prompt.

Recommended components:

```text
SYSTEM_PROMPT
INTENT_PROMPT
EXTRACTION_PROMPT
RESPONSE_PROMPT
COMPARISON_PROMPT
BOOKING_PROMPT
```

System instructions should establish:

- assistant role
- supported capabilities
- no-fabrication rule
- database authority
- safe fallback behavior
- response style

---

# 38. AI Context Construction

The backend should construct the minimum context required for each request.

Example:

```text
System Instructions
+
Current conversation context
+
Customer requirements
+
Verified property data
+
Current workflow state
```

Do not send unrelated internal database data to the model.

---

# 39. Hallucination Controls

The system should enforce:

```text
Property facts → database
Prices → database
Property status → database
Booking reference → backend
Booking date/time → backend validation
```

The AI may summarize these facts but must not generate alternative factual values.

---

# 40. Frontend Requirements

The chatbot UI should contain:

```text
Floating Chat Button
       ↓
Chat Window
       ├── Header
       ├── Messages
       ├── Suggested Prompts
       ├── Property Cards
       ├── Comparison Actions
       └── Message Input
```

Property cards should support:

```text
View Details
Compare
Book Site Visit
```

---

# 41. Frontend API Client

Create one API wrapper:

```text
frontend/js/api.js
```

Responsibilities:

- API base URL
- fetch handling
- JSON serialization
- error handling

Avoid repeating raw `fetch()` logic throughout UI modules.

---

# 42. Loading and Failure States

The UI must clearly display:

```text
AI is typing...
Searching properties...
Creating your booking...
```

For errors:

```text
Something went wrong.
Please try again.
```

Technical stack traces must never be displayed to users.

---

# 43. Testing Requirements

## Unit Tests

Test:

- budget normalization
- location normalization
- requirement validation
- recommendation scoring
- booking validation
- booking reference generation

## API Tests

Test:

- chat endpoint
- property search
- property details
- comparison
- booking creation
- invalid requests
- not-found responses

## AI Integration Tests

Test representative prompts:

```text
I need a 3 BHK under 1 crore.
Show villas in Hyderabad.
Compare these two.
I want to book a visit.
```

AI tests should validate structured output rather than relying only on exact wording.

---

# 44. Seed Data

The development environment should include sample properties.

Example:

```text
10–20 properties
multiple locations
multiple BHK values
multiple property types
different price ranges
different amenities
different statuses
```

Seed data allows all seven core features to be demonstrated without external systems.

---

# 45. API Documentation

FastAPI should expose interactive API documentation.

Expected development URLs:

```text
/docs
/redoc
```

The project should document:

- endpoints
- request schemas
- response schemas
- error responses
- examples

---

# 46. Logging

Structured application logging should capture:

```text
timestamp
request_id
session_id
route
status_code
duration_ms
AI success/failure
database operation failure
booking success/failure
```

Do not log:

```text
OPENAI_API_KEY
full sensitive customer information
authentication secrets
```

---

# 47. Health Check

Endpoint:

```text
GET /api/v1/health
```

Response:

```json
{
  "status": "ok",
  "service": "ai-sales-assistant"
}
```

A deeper readiness check may later verify:

- database connectivity
- AI provider configuration

---

# 48. Deployment Readiness

The application should be deployable as:

```text
Frontend
   ↓
Static hosting / web server

Backend
   ↓
Python ASGI server
   ↓
FastAPI

Database
   ↓
PostgreSQL in production
```

Environment-specific configuration must be externalized.

---

# 49. Development Commands

Backend setup:

```bash
python -m venv .venv
```

Windows:

```bash
.venv\\Scripts\\activate
```

Install:

```bash
pip install -r requirements.txt
```

Run:

```bash
uvicorn app.main:app --reload
```

Expected:

```text
http://127.0.0.1:8000
```

API docs:

```text
http://127.0.0.1:8000/docs
```

---

# 50. Technical Acceptance Criteria

## TR-AC-01

The backend starts successfully using Uvicorn.

## TR-AC-02

The frontend can send a chat message to FastAPI.

## TR-AC-03

FastAPI can call the configured OpenAI API without exposing the key.

## TR-AC-04

The system can extract structured property requirements.

## TR-AC-05

Structured requirements can be validated using Pydantic.

## TR-AC-06

Property searches use SQLAlchemy and database records.

## TR-AC-07

Recommendation results contain only database properties.

## TR-AC-08

Two or more properties can be compared.

## TR-AC-09

A valid site visit request is persisted.

## TR-AC-10

A booking reference is generated server-side.

## TR-AC-11

Invalid requests return controlled API errors.

## TR-AC-12

No RAG/vector database is required for the MVP.

---

# 51. Technical Constraints

The MVP shall:

- use Python for backend development
- use FastAPI
- use SQLAlchemy
- use SQLite
- use OpenAI API
- avoid RAG
- avoid direct frontend-to-OpenAI communication
- keep property inventory database-controlled
- use REST APIs
- support future PostgreSQL migration

---

# 52. Definition of Done

The technical implementation is considered complete when:

```text
Frontend
   ↓
Chat
   ↓
AI understands request
   ↓
Requirements extracted
   ↓
Database searched
   ↓
Matching properties displayed
   ↓
Properties compared
   ↓
Site visit requested
   ↓
Booking validated
   ↓
Booking persisted
   ↓
Confirmation displayed
```

All major backend components must have validation, controlled errors, and basic automated tests.

---

# 53. Final Technical Architecture Principle

The system must maintain this responsibility boundary:

```text
AI
= Understand + Extract + Explain

FastAPI
= Orchestrate + Validate + Control

Business Services
= Apply Rules

Database
= Store + Provide Truth

Frontend
= Present + Collect Input
```

This architecture keeps the AI powerful while ensuring that business-critical data and actions remain deterministic, testable, and controlled.
