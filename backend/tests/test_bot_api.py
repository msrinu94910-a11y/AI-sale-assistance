import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_bot_status():
    res = client.get("/api/v1/bot/status")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert data["bot_name"] == "SalesBot API"

def test_bot_chat_turn_and_session():
    # Turn 1: Greeting
    payload_1 = {"message": "Hello, how does the BANT scoring work?"}
    res_1 = client.post("/api/v1/bot/chat", json=payload_1)
    assert res_1.status_code == 200
    data_1 = res_1.json()
    assert "reply" in data_1
    assert "session_id" in data_1
    session_id = data_1["session_id"]
    assert len(data_1["suggested_actions"]) > 0

    # Turn 2: Entity capture (prospect provides details)
    payload_2 = {
        "message": "My name is John Connor from TechCorp. My email is john@techcorp.io and budget is $75,000.",
        "session_id": session_id
    }
    res_2 = client.post("/api/v1/bot/chat", json=payload_2)
    assert res_2.status_code == 200
    data_2 = res_2.json()
    entities = data_2["extracted_entities"]
    assert entities["email"] == "john@techcorp.io"
    assert entities["name"] == "John Connor"
    assert data_2["lead"] is not None
    assert data_2["lead"]["email"] == "john@techcorp.io" or data_2["lead"]["name"] == "John Connor"

    # Turn 3: Demo Booking via Chat
    payload_3 = {
        "message": "Please book the afternoon slot for our demo",
        "session_id": session_id
    }
    res_3 = client.post("/api/v1/bot/chat", json=payload_3)
    assert res_3.status_code == 200
    data_3 = res_3.json()
    assert data_3["intent"] == "demo_booked"
    assert "Demo Confirmed" in data_3["reply"] or "booked" in data_3["reply"].lower()

    # Verify session history
    hist_res = client.get(f"/api/v1/bot/sessions/{session_id}/history")
    assert hist_res.status_code == 200
    hist_data = hist_res.json()
    assert hist_data["session_id"] == session_id
    # 3 turns * 2 messages (user + assistant) = 6 messages
    assert hist_data["total_messages"] >= 6

def test_bot_qualify():
    payload = {
        "name": "Sarah Connor",
        "email": "sarah.connor@cyberdyne.org",
        "company": "Cyberdyne Systems",
        "budget": 90,
        "need": 85,
        "authority": 80,
        "timeline": 95,
        "notes": "Urgent enterprise CRM rollout."
    }
    res = client.post("/api/v1/bot/qualify", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Sarah Connor"
    assert data["score"] >= 80
    assert data["category"] == "Hot"

def test_bot_direct_book():
    payload = {
        "lead_name": "Marcus Vance",
        "lead_email": "m.vance@apex.com",
        "title": "API Sales Architecture Consultation",
        "slot": "morning"
    }
    res = client.post("/api/v1/bot/book", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["meeting_id"] is not None
    assert "Marcus Vance" in data["lead_name"]
