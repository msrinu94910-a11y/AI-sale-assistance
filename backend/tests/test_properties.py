import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.models.property import Property

client = TestClient(app)

@pytest.fixture(scope="module")
def setup_properties():
    db = SessionLocal()
    # Add a dummy property for testing
    dummy_prop = Property(
        name="Test Villa",
        description="A beautiful test villa",
        location="Test City",
        property_type="Villa",
        bhk=4,
        price=15000000,
        area="3000 sqft",
        status="AVAILABLE"
    )
    db.add(dummy_prop)
    db.commit()
    db.refresh(dummy_prop)
    
    yield dummy_prop
    
    # Cleanup
    db_prop = db.query(Property).filter(Property.id == dummy_prop.id).first()
    if db_prop:
        db.delete(db_prop)
        db.commit()
    db.close()

def test_create_property():
    payload = {
        "name": "New Test Apartment",
        "description": "A new test apartment",
        "location": "New City",
        "property_type": "Apartment",
        "bhk": 2,
        "price": 8000000,
        "status": "AVAILABLE"
    }
    res = client.post("/api/v1/properties/", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "New Test Apartment"
    assert "id" in data
    
    # Cleanup
    db = SessionLocal()
    prop = db.query(Property).filter(Property.id == data["id"]).first()
    if prop:
        db.delete(prop)
        db.commit()
    db.close()

def test_get_properties(setup_properties):
    res = client.get("/api/v1/properties/")
    assert res.status_code == 200
    data = res.json()
    assert len(data) > 0

def test_get_property_by_id(setup_properties):
    res = client.get(f"/api/v1/properties/{setup_properties.id}")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == setup_properties.id
    assert data["name"] == "Test Villa"

def test_update_property(setup_properties):
    payload = {
        "price": 16000000
    }
    res = client.put(f"/api/v1/properties/{setup_properties.id}", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["price"] == 16000000
    
def test_search_properties(setup_properties):
    payload = {
        "location": "Test City",
        "property_type": "Villa"
    }
    res = client.post("/api/v1/properties/search", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data) > 0
    assert data[0]["location"] == "Test City"

def test_compare_properties(setup_properties):
    payload = {
        "property_ids": [setup_properties.id]
    }
    res = client.post("/api/v1/properties/compare", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 1
    assert data[0]["id"] == setup_properties.id

def test_delete_property():
    # First create a property to delete
    payload = {
        "name": "Delete Me",
        "location": "Nowhere",
        "property_type": "Plot",
        "price": 1000000
    }
    create_res = client.post("/api/v1/properties/", json=payload)
    assert create_res.status_code == 200
    prop_id = create_res.json()["id"]
    
    # Then delete it
    del_res = client.delete(f"/api/v1/properties/{prop_id}")
    assert del_res.status_code == 200
    assert del_res.json()["detail"] == "Property deleted successfully"
    
    # Verify it's gone
    get_res = client.get(f"/api/v1/properties/{prop_id}")
    assert get_res.status_code == 404
