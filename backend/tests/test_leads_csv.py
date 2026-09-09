import io
import csv
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_export_leads_csv():
    response = client.get("/api/v1/leads/export")
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/csv")
    assert "attachment; filename=leads_export.csv" in response.headers["content-disposition"]
    
    content = response.text
    assert "name" in content.lower()
    assert "email" in content.lower()

def test_import_leads_csv():
    csv_data = (
        "Name,Email,Phone,Company,Status,Budget,Need,Authority,Timeline,Notes\n"
        "Alice Smith,alice@techcorp.io,+1 555-9988,TechCorp Inc,Qualified,90,80,85,90,High interest\n"
        "Bob Jones,bob@innovate.org,+1 555-4433,Innovate Ltd,New,30,40,20,30,Initial outreach\n"
    )
    
    file_bytes = io.BytesIO(csv_data.encode('utf-8'))
    response = client.post(
        "/api/v1/leads/import",
        files={"file": ("test_leads.csv", file_bytes, "text/csv")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["imported_count"] == 2
    assert len(data["leads"]) == 2
    
    # Verify BANT score was calculated automatically
    alice = next(l for l in data["leads"] if l["name"] == "Alice Smith")
    assert alice["score"] >= 71
    assert alice["category"] == "Hot"
