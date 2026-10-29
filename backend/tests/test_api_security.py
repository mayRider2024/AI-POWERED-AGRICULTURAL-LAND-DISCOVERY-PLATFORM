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

def test_ai_search_rate_limiting():
    """Verify that exceeding rate limit returns HTTP 429 Too Many Requests."""
    from app.core.rate_limit import ai_rate_limiter
    # Reset limiter state for test client IP
    test_ip = "192.0.2.1"
    ai_rate_limiter._requests[test_ip] = []

    headers = {"X-Forwarded-For": test_ip}

    # First 5 requests should succeed (200 OK)
    for i in range(5):
        resp = client.post("/api/ai/search", json={"query": f"Land in Panvel {i}"}, headers=headers)
        assert resp.status_code == 200, f"Request {i+1} failed with {resp.status_code}"

    # 6th request within window must be rejected with 429 Too Many Requests
    resp_rate_limited = client.post("/api/ai/search", json={"query": "Another query"}, headers=headers)
    assert resp_rate_limited.status_code == 429
    assert "Rate limit exceeded" in resp_rate_limited.json()["detail"]
    assert "Retry-After" in resp_rate_limited.headers

    # A different client IP should still be able to make requests
    different_ip_headers = {"X-Forwarded-For": "192.0.2.2"}
    resp_other = client.post("/api/ai/search", json={"query": "Land in Raigad"}, headers=different_ip_headers)
    assert resp_other.status_code == 200
