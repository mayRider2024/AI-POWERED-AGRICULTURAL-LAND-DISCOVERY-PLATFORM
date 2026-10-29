from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...db.session import SessionLocal
from ...schemas.ai_search import AISearchRequest, AISearchResponse
from ...services.ai_search import perform_ai_search

router = APIRouter(prefix="/ai", tags=["AI"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/search", response_model=AISearchResponse)
def ai_search(request: AISearchRequest, db: Session = Depends(get_db)):
    try:
        return perform_ai_search(request, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
