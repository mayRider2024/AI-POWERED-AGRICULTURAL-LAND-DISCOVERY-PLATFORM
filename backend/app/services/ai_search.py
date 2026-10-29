import json
from typing import List

from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from google import genai
from google.genai import types

from ..core.config import Settings
from ..models import PropertyListing, District, Taluka, Village
from ..schemas.ai_search import AISearchRequest, AISearchResponse, InterpretedFilters
from ..schemas.property import PropertyResponse

settings = Settings()

def _get_gemini_client():
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=502, detail="GEMINI_API_KEY not configured")
    return genai.Client(api_key=settings.GEMINI_API_KEY)

import re

def _rule_based_interpret_query(query: str) -> InterpretedFilters:
    q = query.lower()
    district = None
    if "raigad" in q:
        district = "Raigad"
    elif "palghar" in q:
        district = "Palghar"

    taluka = None
    for t in ["alibag", "pen", "mhasala", "talasari", "vikramgad", "dahanu"]:
        if t in q:
            taluka = t.capitalize()
            break

    min_area = None
    min_area_strict = False
    max_area = None
    max_area_strict = False

    # Check for 'above X' vs 'at least X'
    area_at_least = re.search(r'(?:at least|minimum of|min)\s*(\d+(?:\.\d+)?)\s*(?:acres?|acre)?', q)
    if area_at_least:
        min_area = float(area_at_least.group(1))
        min_area_strict = False
    else:
        area_above = re.search(r'(?:above|more than|greater than|>)\s*(\d+(?:\.\d+)?)\s*(?:acres?|acre)?', q)
        if area_above:
            min_area = float(area_above.group(1))
            min_area_strict = True

    # Check for 'under X' vs 'at most X'
    area_at_most = re.search(r'(?:at most|maximum of|max|up to)\s*(\d+(?:\.\d+)?)\s*(?:acres?|acre)?', q)
    if area_at_most:
        max_area = float(area_at_most.group(1))
        max_area_strict = False
    else:
        area_under = re.search(r'(?:under|less than|below|<)\s*(\d+(?:\.\d+)?)\s*(?:acres?|acre)?', q)
        if area_under:
            max_area = float(area_under.group(1))
            max_area_strict = True

    # Accurate Indian Currency conversion:
    # 1 Lakh = 100,000 INR
    # 1 Crore = 10,000,000 INR
    # Never multiply small numbers by 10
    max_total_price = None
    min_total_price = None

    # Check for lakh (e.g. "under ₹30 lakh", "below 30 lakhs", "up to 30 lac")
    lakh_under = re.search(r'(?:under|below|less than|up to|max)?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs)', q)
    if lakh_under:
        val = float(lakh_under.group(1)) * 100_000
        max_total_price = val

    # Check for direct numbers with ₹ or Rs if no lakh mentioned (e.g. "under 3000000" or "under ₹300000")
    if max_total_price is None:
        direct_price_under = re.search(r'(?:under|below|less than|up to)\s*(?:₹|rs\.?|inr)?\s*(\d{5,10})', q)
        if direct_price_under:
            max_total_price = float(direct_price_under.group(1))

    return InterpretedFilters(
        district=district,
        taluka=taluka,
        min_area_acres=min_area,
        max_area_acres=max_area,
        min_area_strict=min_area_strict,
        max_area_strict=max_area_strict,
        min_total_price=min_total_price,
        max_total_price=max_total_price,
    )

def _interpret_query(query: str) -> InterpretedFilters:
    if settings.GEMINI_API_KEY:
        try:
            client = _get_gemini_client()
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=[
                    f"Extract search filters from this agricultural land query in India. Note: 1 lakh = 100,000 INR and 1 crore = 10,000,000 INR. Query: {query}"
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=InterpretedFilters.model_json_schema(),
                    temperature=0,
                ),
            )
            json_text = response.candidates[0].content.parts[0].text
            data = json.loads(json_text)
            return InterpretedFilters.model_validate(data)
        except Exception:
            # Fallback to local rule-based NLP parser on quota/permission error
            return _rule_based_interpret_query(query)
    return _rule_based_interpret_query(query)

def _apply_filters(db: Session, filters: InterpretedFilters) -> List[PropertyListing]:
    query = db.query(PropertyListing)
    if filters.district:
        query = query.join(District).filter(District.name == filters.district)
    if filters.taluka:
        query = query.join(Taluka).filter(Taluka.name == filters.taluka)
    if filters.village:
        query = query.join(Village).filter(Village.name == filters.village)
    if filters.min_area_acres is not None:
        if filters.min_area_strict:
            query = query.filter(PropertyListing.area_acres > filters.min_area_acres)
        else:
            query = query.filter(PropertyListing.area_acres >= filters.min_area_acres)
    if filters.max_area_acres is not None:
        if filters.max_area_strict:
            query = query.filter(PropertyListing.area_acres < filters.max_area_acres)
        else:
            query = query.filter(PropertyListing.area_acres <= filters.max_area_acres)
    if filters.min_price_per_guntha is not None:
        query = query.filter(PropertyListing.price_per_guntha >= filters.min_price_per_guntha)
    if filters.max_price_per_guntha is not None:
        query = query.filter(PropertyListing.price_per_guntha <= filters.max_price_per_guntha)
    if filters.min_total_price is not None:
        query = query.filter(PropertyListing.total_price >= filters.min_total_price)
    if filters.max_total_price is not None:
        query = query.filter(PropertyListing.total_price <= filters.max_total_price)
    return query.all()

def perform_ai_search(request: AISearchRequest, db: Session) -> AISearchResponse:
    # Interpret natural language query
    filters = _interpret_query(request.query)
    # Query DB with filters
    properties = _apply_filters(db, filters)
    # Serialize results safely, handling geometry and total_price calculation
    serialized = []
    for p in properties:
        # Extract coordinates from property directly (location is stored as 'lat,lng' string)
        lat = p.latitude
        lng = p.longitude
        # Compute total_price if not stored
        total_price = getattr(p, "total_price", None)
        if total_price is None:
            total_price = (p.area_acres or 0) * 40 * (p.price_per_guntha or 0)
        serialized.append({
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "survey_number": p.survey_number,
            "latitude": lat,
            "longitude": lng,
            "area_acres": float(p.area_acres),
            "price_per_guntha": float(p.price_per_guntha),
            "land_type": p.land_type,
            "verification_status": p.verification_status,
            "source_type": p.source_type,
            "total_price": float(total_price),
            "district": getattr(p.district, "name", None),
            "taluka": getattr(p.taluka, "name", None),
            "village": getattr(p.village, "name", None),
        })
    return AISearchResponse(
        original_query=request.query,
        interpreted_filters=filters,
        matching_count=len(serialized),
        properties=serialized,
        explanation="Filters interpreted by Gemini AI.",
        unsupported=[],
    )
