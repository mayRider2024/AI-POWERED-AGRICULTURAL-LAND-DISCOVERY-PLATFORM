import pytest
from uuid import uuid4
from unittest.mock import MagicMock
from app.schemas.ai_search import AISearchRequest, ChatHistoryMessage
from app.models.ai_conversation import AIConversationModel, AIMessageModel
from app.services.ai_search import _interpret_query

def test_ai_search_request_schema_with_history():
    """Verify AISearchRequest accepts conversation_id and bounded history."""
    req = AISearchRequest(
        query="Farms in Panvel",
        conversation_id=str(uuid4()),
        history=[
            ChatHistoryMessage(role="user", content="Looking for land in Raigad"),
            ChatHistoryMessage(role="assistant", content="Found 3 properties in Raigad"),
        ],
    )
    assert req.query == "Farms in Panvel"
    assert req.conversation_id is not None
    assert len(req.history) == 2
    assert req.history[0].role == "user"
    assert req.history[1].role == "assistant"

def test_models_representation():
    """Verify AIConversationModel and AIMessageModel schema definition."""
    conv_id = uuid4()
    user_id = uuid4()
    conv = AIConversationModel(id=conv_id, user_id=user_id, title="Test Chat")
    assert conv.title == "Test Chat"
    assert conv.user_id == user_id

    msg = AIMessageModel(
        conversation_id=conv_id,
        role="assistant",
        content="Found 2 matching properties.",
        message_metadata={"source": "gemini", "matching_count": 2},
    )
    assert msg.role == "assistant"
    assert msg.message_metadata["matching_count"] == 2

def test_interpret_query_with_conversation_context():
    """Verify _interpret_query processes conversation history safely."""
    history = [
        {"role": "user", "content": "Show land in Raigad"},
        {"role": "assistant", "content": "Found 5 properties in Raigad."},
    ]
    # Under test environment without active GEMINI_API_KEY, fallback parses rule-based safely
    filters = _interpret_query("Show farms under ₹30 lakh", history=history)
    assert filters.max_total_price == 3000000.0

