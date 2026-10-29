import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint_public():
    """Verify health endpoint is accessible and returns no sensitive data."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "service" in data
    assert "key" not in data
    assert "password" not in data

def test_ai_search_query_validation():
    """Verify that empty queries or overly large payloads (>500 chars) are rejected."""
    # Empty query rejected with 422 Unprocessable Entity
    resp_empty = client.post("/api/ai/search", json={"query": ""})
    assert resp_empty.status_code == 422

    # Huge query (> 500 chars) rejected with 422
    resp_large = client.post("/api/ai/search", json={"query": "A" * 501})
    assert resp_large.status_code == 422

def test_ai_search_demo_notice_present():
    """Verify that AI search responses explicitly label results as demo/unverified."""
    resp = client.post("/api/ai/search", json={"query": "Farms in Raigad"})
    assert resp.status_code == 200
    data = resp.json()
    assert "demo_notice" in data
    assert "unverified" in data["demo_notice"].lower()
    # Ensure no secret keys or database connection strings are present in response
    resp_str = resp.text.lower()
    assert "gemini_api_key" not in resp_str
    assert "password" not in resp_str
    assert "aq." not in resp_str

def test_property_routes_public_sanitized():
    """Verify property listing endpoint returns only sanitized public fields."""
    resp = client.get("/api/properties/")
    assert resp.status_code == 200
    data = resp.json()
    assert "properties" in data
    for prop in data["properties"]:
        # Verify no owner personal phone number, private email, or bank details are returned
        assert "phone" not in prop
        assert "owner_phone" not in prop
        assert "owner_email" not in prop
        assert "aadhar" not in prop
