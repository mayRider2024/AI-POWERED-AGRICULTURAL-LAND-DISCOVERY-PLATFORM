from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import Optional
import uuid

from ...db.session import SessionLocal
from ...schemas.ai_search import AISearchRequest, AISearchResponse
from ...services.ai_search import perform_ai_search
from ...core.rate_limit import ai_rate_limiter
from ...core.auth import get_optional_current_user
from ...models.ai_conversation import AIConversationModel, AIMessageModel

router = APIRouter(prefix="/ai", tags=["AI"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/search", response_model=AISearchResponse)
async def ai_search(
    request_payload: AISearchRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Optional[dict] = Depends(get_optional_current_user),
):
    # 1. Enforce per-client sliding window rate limiting
    ai_rate_limiter.check_rate_limit(request)

    # 2. Perform search
    try:
        response = perform_ai_search(request_payload, db)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Search processing encountered an internal error. Please try again.")

    # 3. Secure Server-Side Storage of Assistant Message
    # If the user is authenticated and provided an active conversation_id,
    # strictly verify ownership of the parent conversation before persisting assistant response.
    if current_user and request_payload.conversation_id:
        try:
            conv_uuid = uuid.UUID(request_payload.conversation_id)
            user_uuid = uuid.UUID(current_user["id"])

            # Verify ownership server-side; do not trust client claims
            conv = db.query(AIConversationModel).filter(
                AIConversationModel.id == conv_uuid,
                AIConversationModel.user_id == user_uuid,
            ).first()

            if conv:
                # Build metadata from trusted server results
                assistant_metadata = {
                    "source": "gemini",
                    "explanation": response.explanation,
                    "unmetConstraints": response.unmet_constraints,
                    "unsupported": response.unsupported,
                    "results": response.properties,
                }
                assistant_msg = AIMessageModel(
                    conversation_id=conv.id,
                    role="assistant",
                    content=response.explanation or f"Found {response.matching_count} matching properties.",
                    message_metadata=assistant_metadata,
                )
                db.add(assistant_msg)
                db.commit()
        except Exception as e:
            # Persistence failure should not crash the user's search response
            db.rollback()
            print(f"Warning: Failed to save assistant message securely server-side: {e}")

    return response
