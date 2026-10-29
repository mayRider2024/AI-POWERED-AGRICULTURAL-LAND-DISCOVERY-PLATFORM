from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ...db.session import SessionLocal
from ...schemas.ai_search import AISearchRequest, AISearchResponse
from ...services.ai_search import perform_ai_search
from ...core.rate_limit import ai_rate_limiter

router = APIRouter(prefix="/ai", tags=["AI"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/search", response_model=AISearchResponse)
def ai_search(request_payload: AISearchRequest, request: Request, db: Session = Depends(get_db)):
    # 1. Enforce per-client sliding window rate limiting
    ai_rate_limiter.check_rate_limit(request)

    # 2. Perform search
    try:
        return perform_ai_search(request_payload, db)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Search processing encountered an internal error. Please try again.")
