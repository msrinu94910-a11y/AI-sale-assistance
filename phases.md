# AI Sales Assistant — Implementation Phases

**Document Version:** 1.0  
**Status:** Draft / Assignment Baseline  
**Product:** AI-powered Website Sales Assistant  
**Primary Backend:** Python + FastAPI  
**Frontend:** HTML5 + CSS3 + JavaScript  
**AI:** OpenAI API  
**Database:** SQLite + SQLAlchemy  
**RAG:** Not used in MVP

---

# 1. Purpose

This document defines the implementation roadmap for the AI Sales Assistant.

The development process is divided into controlled phases so that each phase produces a working part of the system before the next phase begins.

The project must be developed incrementally rather than building the entire application at once.

## Final MVP Journey

```text
Phase 1
Project Foundation
        ↓
Phase 2
Database + Property Data
        ↓
Phase 3
Backend API Foundation
        ↓
Phase 4
AI Conversation
        ↓
Phase 5
Requirement Collection
        ↓
Phase 6
Property Search + Recommendation
        ↓
Phase 7
Property Comparison
        ↓
Phase 8
Site Visit Booking
        ↓
Phase 9
Frontend Integration + UX
        ↓
Phase 10
Testing + Security + Optimization
        ↓
Phase 11
Deployment + Documentation
```

---

# 2. Development Strategy

The implementation follows these principles:

### Build in Layers

```text
Infrastructure
    ↓
Data
    ↓
API
    ↓
AI
    ↓
Business Logic
    ↓
UI
    ↓
Testing
    ↓
Deployment
```

### Every Phase Must Be Testable

A phase is not complete merely because code exists.

Each phase must have:

- implementation
- validation
- test cases
- documentation
- working integration with previous phases

### No RAG in MVP

The current project does not use:

- vector databases
- embeddings
- document retrieval pipelines
- knowledge-base RAG

Property information comes directly from the application's database.

---

# 3. Phase 0 — Project Planning and Repository Setup

## Objective

Prepare a clean project workspace and establish development conventions.

## Tasks

- Create Git repository.
- Create project root.
- Create `backend/` directory.
- Create `frontend/` directory.
- Create `docs/` directory.
- Add `.gitignore`.
- Add `README.md`.
- Create Python virtual environment.
- Define supported Python version.
- Define package management approach.
- Create `.env.example`.
- Establish naming conventions.

## Initial Structure

```text
ai-sales-assistant/
├── backend/
├── frontend/
├── docs/
├── .gitignore
└── README.md
```

## Deliverables

```text
Git repository
Python environment
Base project structure
README.md
.env.example
.gitignore
```

## Exit Criteria

- Repository initializes successfully.
- Python environment activates successfully.
- README explains project purpose.
- Secret files are excluded from Git.

---

# 4. Phase 1 — Python Backend Foundation

## Objective

Create the FastAPI backend and establish the base application architecture.

## Tasks

Install:

```text
fastapi
uvicorn
openai
sqlalchemy
pydantic
pydantic-settings
python-dotenv
httpx
```

Optional:

```text
pytest
pytest-asyncio
slowapi
alembic
```

Create:

```text
backend/app/
├── main.py
├── api/
├── core/
├── database/
├── models/
├── schemas/
├── services/
└── repositories/
```

Implement:

- FastAPI application.
- API versioning.
- configuration management.
- environment loading.
- CORS configuration.
- health endpoint.
- global error handling foundation.
- logging foundation.

## First Endpoint

```http
GET /api/v1/health
```

Expected:

```json
{
  "status": "ok",
  "service": "ai-sales-assistant"
}
```

## Deliverables

- Running FastAPI application.
- `/docs`.
- `/redoc`.
- Health API.
- Configuration module.

## Exit Criteria

```bash
uvicorn app.main:app --reload
```

starts successfully and API documentation is accessible.

---

# 5. Phase 2 — Database and Property Data

## Objective

Build the data layer that will act as the source of truth for property information.

## Technology

```text
SQLite
SQLAlchemy 2.x
```

## Core Models

```text
Property
ChatSession
ChatMessage
Lead
SiteVisitBooking
```

## Property Fields

Minimum:

```text
id
name
description
location
property_type
bhk
price
area
amenities
status
created_at
updated_at
```

## Property Status

```text
AVAILABLE
RESERVED
SOLD
INACTIVE
```

## Tasks

- Configure SQLAlchemy.
- Create database engine.
- Create session factory.
- Create declarative base.
- Create models.
- Create relationships.
- Create indexes.
- Create database initialization.
- Create seed script.
- Insert sample properties.

## Seed Data

Create at least:

```text
10–20 properties
```

Cover:

- multiple locations
- apartments
- villas
- plots
- independent houses
- different BHK values
- different price ranges
- different amenities
- different property statuses

## Deliverables

```text
database.py
base.py
property.py
session.py
message.py
lead.py
booking.py
seed.py
```

## Exit Criteria

- Database initializes successfully.
- Tables are created.
- Seed data loads successfully.
- Properties can be queried from Python.
- Unavailable properties can be filtered out.

---

# 6. Phase 3 — Database Access and Repository Layer

## Objective

Create clean and reusable database access methods.

## Tasks

Implement repositories:

```text
property_repository.py
session_repository.py
lead_repository.py
booking_repository.py
```

Property repository methods:

```text
get_by_id()
get_all()
search()
get_available()
```

Session repository methods:

```text
create()
get_by_id()
update()
```

Lead repository methods:

```text
create()
get_by_id()
```

Booking repository methods:

```text
create()
get_by_id()
```

## Exit Criteria

Application services can access data through repository functions instead of embedding SQL queries in API routes.

---

# 7. Phase 4 — API and Schema Foundation

## Objective

Define stable API contracts before building advanced AI functionality.

## Schemas

Create Pydantic models for:

```text
ChatRequest
ChatResponse
PropertyResponse
PropertySearchRequest
PropertySearchResponse
PropertyCompareRequest
PropertyCompareResponse
CustomerDetails
PropertyRequirements
SiteVisitBookingRequest
SiteVisitBookingResponse
ErrorResponse
```

## API Version

```text
/api/v1
```

## Initial Endpoints

```text
GET  /health

GET  /properties
GET  /properties/{property_id}

POST /properties/search

POST /properties/compare

POST /bookings/site-visit
GET  /bookings/{booking_id}

POST /chat
```

## Exit Criteria

- Request models validate correctly.
- Invalid requests return controlled errors.
- Response models have documented structure.
- Swagger documentation reflects the schemas.

---

# 8. Phase 5 — AI Service Integration

## Objective

Connect the Python backend to the OpenAI API securely.

## Tasks

Create:

```text
services/ai_service.py
```

Implement:

- OpenAI client configuration.
- system prompt.
- conversation prompt construction.
- structured extraction.
- assistant response generation.
- AI error handling.
- timeout handling.

## Environment

```env
OPENAI_API_KEY=your_secret_key
```

Never expose the key to frontend code.

## AI Responsibilities

The AI should:

- understand the user.
- identify intent.
- extract requirements.
- ask follow-up questions.
- generate natural responses.

The AI should not:

- invent properties.
- invent prices.
- directly access the database.
- directly create bookings.

## Exit Criteria

A backend test request can successfully send a user message to the AI service and receive a controlled response.

---

# 9. Phase 6 — Conversation and Session Management

## Objective

Make the assistant capable of maintaining useful conversational context.

## Tasks

Implement:

```text
ChatService
SessionService
```

Create session context:

```json
{
  "session_id": "uuid",
  "requirements": {},
  "last_intent": null,
  "selected_property_ids": []
}
```

Store:

```text
user message
assistant response
timestamp
```

## Conversation Rules

The assistant should:

- remember known requirements.
- avoid repetitive questions.
- understand follow-up messages.
- allow corrections.

Example:

```text
User:
I need a 3 BHK.

AI:
Which location?

User:
Gachibowli.

AI:
What's your budget?

User:
Under 1 crore.
```

The final session state should contain all three requirements.

## Exit Criteria

The same session can maintain context across multiple messages.

---

# 10. Phase 7 — Requirement Collection

## Objective

Convert natural-language customer requests into structured property requirements.

## Requirement Fields

```text
location
property_type
bhk
budget_min
budget_max
purpose
buying_timeline
name
phone
email
```

## Tasks

Implement:

```text
RequirementService
```

Implement:

- extraction validation.
- field merging.
- field correction.
- missing-field detection.
- requirement normalization.

## Example

User:

```text
I need a 3 BHK villa in Hyderabad under 1 crore.
```

System state:

```json
{
  "location": "Hyderabad",
  "property_type": "Villa",
  "bhk": 3,
  "budget_min": null,
  "budget_max": 10000000
}
```

## Exit Criteria

Natural-language messages can populate structured requirements reliably.

---

# 11. Phase 8 — Budget and Location Normalization

## Objective

Convert natural language into values usable by deterministic backend search.

## Budget Examples

```text
80 lakhs → 8000000
1 crore → 10000000
1.2 crore → 12000000
```

Support:

```text
lakh
lakhs
lac
crore
cr
```

## Location Normalization

Normalize capitalization and whitespace.

Example:

```text
gachibowli
Gachibowli
GACHIBOWLI
```

→

```text
Gachibowli
```

## Exit Criteria

Normalized values can be passed directly into database queries.

---

# 12. Phase 9 — Property Search Engine

## Objective

Implement deterministic database-backed property search.

## Search Inputs

```text
location
property_type
bhk
budget_min
budget_max
status
```

## Search Rules

Always prefer:

```text
status = AVAILABLE
```

Apply only relevant filters.

Example:

```text
location = Gachibowli
property_type = Villa
bhk = 3
price <= 10000000
```

## No-Match Handling

Return:

```text
NO_MATCHING_PROPERTIES
```

The assistant can suggest:

- expanding budget.
- changing location.
- changing property type.

## Exit Criteria

The backend can return accurate property records for supported search combinations.

---

# 13. Phase 10 — Recommendation Engine

## Objective

Rank property matches so the assistant can present the best results first.

## Initial Scoring

```text
Location exact match      +30
Property type exact       +20
BHK exact                 +20
Within budget             +20
Available status          +10
```

Maximum:

```text
100
```

## Recommendation Rules

- exact matches first.
- available properties only.
- configurable scoring.
- deterministic results.
- limited result count.

## Important Constraint

This is not an ML model.

It is a transparent business-rule ranking system.

## Exit Criteria

Search results can be ranked consistently and the top results returned to the chat UI.

---

# 14. Phase 11 — Property Details Experience

## Objective

Allow users to inspect a selected property before comparing or booking.

## API

```http
GET /api/v1/properties/{property_id}
```

## UI Data

Display:

```text
Property name
Price
Location
Type
BHK
Area
Amenities
Status
Description
```

## Actions

```text
Compare
Book Site Visit
```

## Exit Criteria

A property returned by the assistant can be opened and its database-backed details displayed.

---

# 15. Phase 12 — Property Comparison

## Objective

Allow customers to compare multiple properties.

## API

```http
POST /api/v1/properties/compare
```

## Input

```json
{
  "property_ids": [1, 2]
}
```

## Comparison Fields

```text
Property
Price
Location
Type
BHK
Area
Amenities
Status
```

## AI Summary

The AI may explain:

```text
Property A is cheaper.
Property B offers a larger area.
```

Only verified fields may be used.

## Exit Criteria

At least two properties can be compared in one user flow.

---

# 16. Phase 13 — Site Visit Booking

## Objective

Convert an interested visitor into a site-visit request.

## Workflow

```text
Select Property
      ↓
Request Visit
      ↓
Collect Name
      ↓
Collect Phone
      ↓
Collect Email
      ↓
Collect Date
      ↓
Collect Time
      ↓
Show Summary
      ↓
Customer Confirmation
      ↓
Backend Validation
      ↓
Create Booking
      ↓
Generate Reference
```

## Booking Status

```text
REQUESTED
CONFIRMED
COMPLETED
CANCELLED
```

## Validation

Check:

- property exists.
- property is eligible.
- customer name exists.
- phone is valid enough.
- date is valid.
- date is not in the past.
- time is valid.
- customer confirmed details.

## Exit Criteria

A valid site-visit request is stored in the database and returns a booking reference.

---

# 17. Phase 14 — Lead Persistence

## Objective

Preserve useful customer information for the sales workflow.

## Lead Trigger

Recommended:

```text
Contact Information
+
Meaningful Property Requirement
```

## Lead Source

```text
AI_CHATBOT
```

## Lead Information

```text
name
phone
email
location
property_type
bhk
budget
purpose
buying_timeline
selected_property
session_id
source
created_at
```

## Exit Criteria

A meaningful customer conversation can produce a persistent lead record.

---

# 18. Phase 15 — Frontend Chatbot UI

## Objective

Build the website chatbot interface.

## UI Structure

```text
Website
  ↓
Floating Chat Button
  ↓
Chat Window
  ├── Header
  ├── Assistant Greeting
  ├── Message List
  ├── Suggested Prompts
  ├── Property Cards
  ├── Comparison Actions
  └── Message Input
```

## UI Components

### Chat Header

Include:

```text
AI Property Assistant
Online / Active indicator
Close / Minimize
```

### Message Bubble

Differentiate:

```text
User
Assistant
```

### Suggested Prompts

```text
Find a property
Properties under ₹1 Cr
Find a 3 BHK
Compare properties
Book a site visit
```

### Property Cards

Actions:

```text
View Details
Compare
Book Visit
```

## Exit Criteria

The chatbot UI is usable on desktop and common mobile screen sizes.

---

# 19. Phase 16 — Frontend API Integration

## Objective

Connect the browser UI to FastAPI.

## Frontend Modules

```text
api.js
chat.js
app.js
```

## API Client Responsibilities

- send messages.
- receive assistant response.
- render requirements.
- render properties.
- request comparisons.
- submit bookings.
- display errors.

## Loading States

Display:

```text
AI is typing...
Searching properties...
Preparing comparison...
Creating booking...
```

## Exit Criteria

The complete frontend can execute the main backend workflows without mock data.

---

# 20. Phase 17 — End-to-End Sales Journey

## Objective

Connect all completed modules into one coherent user journey.

## Golden Path

```text
Visitor opens website
        ↓
Opens chatbot
        ↓
Greets assistant
        ↓
Provides requirements
        ↓
Requirements extracted
        ↓
Backend searches properties
        ↓
Recommendations displayed
        ↓
User views property
        ↓
User selects two properties
        ↓
Comparison displayed
        ↓
User selects preferred property
        ↓
Requests site visit
        ↓
Provides contact details
        ↓
Provides date/time
        ↓
Confirms
        ↓
Booking created
        ↓
Reference displayed
```

## Exit Criteria

The complete journey works without manual database manipulation.

---

# 21. Phase 18 — Validation and Error Handling

## Objective

Make the system reliable under incorrect or unexpected input.

## Test Scenarios

### User Input

```text
empty message
very long message
unclear request
unsupported request
incorrect budget
invalid phone
invalid email
invalid date
invalid time
```

### Property Scenarios

```text
property not found
no matching property
sold property requested
inactive property requested
```

### AI Scenarios

```text
OpenAI unavailable
timeout
invalid structured response
unexpected intent
```

### Database Scenarios

```text
connection failure
constraint failure
duplicate booking
```

## Exit Criteria

Every major failure produces a controlled response and does not crash the application.

---

# 22. Phase 19 — Security Hardening

## Objective

Prepare the application for safe demonstration and future deployment.

## Tasks

- protect API key.
- validate all inputs.
- configure explicit CORS.
- add rate limiting.
- prevent arbitrary SQL input.
- sanitize AI output.
- prevent unrestricted AI actions.
- hide internal stack traces.
- secure environment configuration.
- remove secrets from logs.
- verify `.gitignore`.

## Security Boundary

```text
Frontend
   ↓
FastAPI
   ↓
Validation
   ↓
Business Logic
   ↓
Database
```

The frontend must never directly access:

```text
OPENAI_API_KEY
DATABASE credentials
internal system prompts
```

## Exit Criteria

Security review checklist passes.

---

# 23. Phase 20 — Testing

## Objective

Verify the application at unit, API, AI, and end-to-end levels.

## Unit Tests

Test:

```text
budget normalization
location normalization
requirement merging
recommendation scoring
booking validation
booking reference generation
```

## API Tests

Test:

```text
GET health
GET properties
GET property details
POST search
POST compare
POST booking
POST chat
```

## AI Tests

Use representative prompts:

```text
I need a 3 BHK under 1 crore.
I want a villa in Hyderabad.
Show me something in Gachibowli.
Compare the first two.
I want to visit this property.
```

## End-to-End Tests

Test:

```text
Chat → Search → Recommendation → Compare → Booking
```

## Exit Criteria

Critical workflows pass automated tests.

---

# 24. Phase 21 — Performance Optimization

## Objective

Improve response efficiency without over-engineering the MVP.

## Tasks

- add database indexes.
- limit search result count.
- limit AI context size.
- avoid unnecessary AI calls.
- reuse database sessions correctly.
- add request timeouts.
- optimize frequently used queries.
- measure API response times.

## AI Optimization

Do not send unnecessary data to the model.

Context should contain:

```text
Required instructions
+
Relevant conversation
+
Current requirements
+
Verified property data
```

## Exit Criteria

No obvious performance bottlenecks remain in the primary user journey.

---

# 25. Phase 22 — Observability and Logging

## Objective

Make the system diagnosable.

## Log Fields

```text
timestamp
request_id
session_id
endpoint
status_code
duration_ms
AI success/failure
database errors
booking success/failure
```

## Do Not Log

```text
API keys
passwords
secrets
unnecessary sensitive customer data
```

## Exit Criteria

Application failures can be traced without exposing sensitive information.

---

# 26. Phase 23 — Deployment Preparation

## Objective

Prepare the application to run outside the local machine.

## Tasks

- production environment configuration.
- production CORS configuration.
- database configuration through environment variables.
- static frontend deployment strategy.
- ASGI server configuration.
- health checks.
- startup/shutdown configuration.
- deployment documentation.

## Production Database Path

```text
SQLite
   ↓
PostgreSQL
```

The application should not require major business-logic changes for this migration.

## Exit Criteria

A clean deployment environment can be configured using environment variables.

---

# 27. Phase 24 — Final Documentation

## Objective

Produce complete project documentation for evaluation and future maintenance.

## Documentation Set

```text
PRD.md
TRD.md
phases.md
architecture.md
design.md
database.md
README.md
```

## README Should Include

- project overview
- features
- architecture summary
- setup
- environment variables
- installation
- database initialization
- seed data
- backend startup
- frontend startup
- API documentation
- testing
- deployment notes

## Exit Criteria

A new developer can understand and run the project using the documentation.

---

# 28. Phase 25 — Final Acceptance and Demo

## Objective

Verify that all required features work as one finished product.

## Required Features

```text
1. AI Conversation
2. Requirement Collection
3. Smart Property Recommendation
4. Budget-Based Search
5. Location-Based Search
6. Property Comparison
7. Site Visit Booking
```

## Final Demo Script

### Step 1

Open website.

### Step 2

Open chatbot.

### Step 3

Enter:

```text
I need a 3 BHK villa in Hyderabad under 1 crore.
```

### Step 4

Verify requirements.

### Step 5

Display recommended properties.

### Step 6

Select two properties.

### Step 7

Compare them.

### Step 8

Select preferred property.

### Step 9

Request site visit.

### Step 10

Provide:

```text
Name
Phone
Email
Date
Time
```

### Step 11

Confirm.

### Step 12

Display:

```text
Booking Created
Booking Reference
Property
Date
Time
```

## Final Acceptance Criteria

The application passes only when the complete flow works from the browser through:

```text
Frontend
→ FastAPI
→ AI
→ Business Logic
→ SQLAlchemy
→ SQLite
→ Booking Persistence
→ Frontend Confirmation
```

---

# 29. Recommended Implementation Order

For a practical assignment, implement in this exact order:

```text
1. Project Setup
2. FastAPI Foundation
3. Database Setup
4. Property Seed Data
5. Repository Layer
6. API Schemas
7. OpenAI Integration
8. Chat Session
9. Requirement Extraction
10. Budget/Location Normalization
11. Property Search
12. Recommendation Engine
13. Property Details
14. Comparison
15. Lead Persistence
16. Site Visit Booking
17. Chat UI
18. API Integration
19. End-to-End Workflow
20. Testing
21. Security
22. Performance
23. Deployment
24. Documentation
25. Final Demo
```

---

# 30. Phase Completion Checklist

Each phase should satisfy:

```text
[ ] Implementation complete
[ ] Previous phase integration verified
[ ] Unit tests where applicable
[ ] API tests where applicable
[ ] Error handling implemented
[ ] Documentation updated
[ ] Git commit created
```

Recommended Git approach:

```text
feat: project foundation
feat: fastapi setup
feat: database models
feat: property seed data
feat: repository layer
feat: ai service
feat: chat session
feat: requirement extraction
feat: property search
feat: recommendation engine
feat: property comparison
feat: site visit booking
feat: chatbot frontend
test: end to end workflows
security: harden api
docs: complete project documentation
```

---

# 31. MVP Boundary

The following must be completed for the assignment:

```text
CORE
├── AI Conversation
├── Requirement Collection
├── Property Recommendation
├── Budget Search
├── Location Search
├── Property Comparison
└── Site Visit Booking

SUPPORTING
├── Session Management
├── Lead Persistence
├── Database
├── Validation
├── Error Handling
├── Security
└── Testing
```

The following remain outside MVP:

```text
RAG
Vector Database
Voice Calling
WhatsApp
CRM Integration
Advanced Analytics
ML Recommendation Model
Payment Processing
Calendar Integration
```

---

# 32. Final Phase Architecture

```text
                    ┌─────────────────────┐
                    │      FRONTEND       │
                    │ HTML + CSS + JS     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      FASTAPI        │
                    │     REST API        │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼──────────────────┐
             ▼                 ▼                  ▼
       ┌───────────┐    ┌─────────────┐    ┌─────────────┐
       │ AI Service│    │   Services  │    │   Schemas   │
       └─────┬─────┘    └──────┬──────┘    └─────────────┘
             │                 │
             ▼                 ▼
       ┌───────────┐     ┌──────────────┐
       │ OpenAI API│     │ Repositories │
       └───────────┘     └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │  SQLAlchemy  │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │    SQLite    │
                         └──────────────┘
```

---

# 33. Definition of Project Completion

The AI Sales Assistant is considered complete when:

```text
A visitor can open the website
        ↓
chat with the AI
        ↓
describe their property requirement
        ↓
receive database-backed recommendations
        ↓
search by budget
        ↓
search by location
        ↓
compare properties
        ↓
select a property
        ↓
request a site visit
        ↓
complete contact information
        ↓
confirm date and time
        ↓
receive a booking reference
```

The final implementation must preserve the central rule:

```text
AI understands.
Backend controls.
Database provides truth.
Frontend presents.
```
