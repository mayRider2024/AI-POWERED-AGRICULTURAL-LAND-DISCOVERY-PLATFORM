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

    # District detection (including Marathi/Hindi transliterations: रायगड, पालघर)
    district = None
    if "raigad" in q or "रायगड" in q:
        district = "Raigad"
    elif "palghar" in q or "पालघर" in q:
        district = "Palghar"

    # Taluka detection (including Panvel, Alibag, Pen, Mhasala, Talasari, Vikramgad, Dahanu and Marathi terms)
    taluka = None
    talukas_map = {
        "panvel": "Panvel",
        "पनवेल": "Panvel",
        "alibag": "Alibag",
        "alibaug": "Alibag",
        "अलिबाग": "Alibag",
        "pen": "Pen",
        "पेण": "Pen",
        "mhasala": "Mhasala",
        "म्हसळा": "Mhasala",
        "talasari": "Talasari",
        "तलासरी": "Talasari",
        "vikramgad": "Vikramgad",
        "विक्रमगड": "Vikramgad",
        "dahanu": "Dahanu",
        "डहाणू": "Dahanu",
    }
    for key, name in talukas_map.items():
        if key in q:
            taluka = name
            # Panvel is in Raigad district
            if name in ["Panvel", "Alibag", "Pen", "Mhasala"] and not district:
                district = "Raigad"
            elif name in ["Talasari", "Vikramgad", "Dahanu"] and not district:
                district = "Palghar"
            break

    # Survey / Gat number parsing (e.g. "survey number 125/2", "gat no 45", "survey 125", "r-001", "p-001")
    survey_number = None
    survey_match = re.search(r'(?:survey(?:\s*(?:no\.?|number))?|gat(?:\s*(?:no\.?|number))?|सर्व्हे(?:\s*क्र\.?)?|गट(?:\s*क्र\.?)?)\s*[:#-]?\s*([a-zA-Z0-9]+(?:/[0-9]+)?)', q)
    if survey_match:
        survey_number = survey_match.group(1).upper()
    else:
        # direct code like R-001, P-003
        code_match = re.search(r'\b([rp]-[0-9]{3})\b', q)
        if code_match:
            survey_number = code_match.group(1).upper()

    # Area parsing (acres / एकर / gunthas / गुंठा)
    min_area = None
    min_area_strict = False
    max_area = None
    max_area_strict = False

    # Check for area range (e.g. "5 to 10 acres", "between 5 and 10 acres", "10 acres", "५ एकर")
    area_range = re.search(r'(?:between\s+)?(\d+(?:\.\d+)?)\s*(?:-|to|and)\s*(\d+(?:\.\d+)?)\s*(?:acres?|acre|एकर)', q)
    if area_range:
        min_area = float(area_range.group(1))
        max_area = float(area_range.group(2))
    else:
        # Check for Marathi number e.g. "५ एकर"
        marathi_nums = {'०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'}
        q_trans = q
        for m_digit, eng_digit in marathi_nums.items():
            q_trans = q_trans.replace(m_digit, eng_digit)

        area_at_least = re.search(r'(?:at least|minimum of|min|कमीतकमी)\s*(\d+(?:\.\d+)?)\s*(?:acres?|acre|एकर)?', q_trans)
        area_above = re.search(r'(?:above|more than|greater than|>|पेक्षा जास्त)\s*(\d+(?:\.\d+)?)\s*(?:acres?|acre|एकर)?', q_trans)
        area_under = re.search(r'(?:under|less than|below|<|पेक्षा कमी|पर्यंत)\s*(\d+(?:\.\d+)?)\s*(?:acres?|acre|एकर)?', q_trans)
        area_exact = re.search(r'(\d+(?:\.\d+)?)\s*(?:acres?|acre|एकर)', q_trans)

        if area_at_least:
            min_area = float(area_at_least.group(1))
            min_area_strict = False
        elif area_above:
            min_area = float(area_above.group(1))
            min_area_strict = True
        elif area_under:
            max_area = float(area_under.group(1))
            max_area_strict = True
        elif area_exact:
            # "10 acres of land"
            min_area = float(area_exact.group(1))
            min_area_strict = False

    # Price per guntha parsing (e.g. "between ₹10 lakh and ₹15 lakh per guntha", "₹50000 per guntha")
    min_price_per_guntha = None
    max_price_per_guntha = None
    guntha_range = re.search(r'(?:between\s+)?(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs)?\s*(?:to|and|-)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs)\s*(?:per|/)\s*(?:guntha|गुंठा)', q)
    if guntha_range:
        g1 = float(guntha_range.group(1))
        g2 = float(guntha_range.group(2))
        min_price_per_guntha = g1 * 100_000 if g1 < 1000 else g1
        max_price_per_guntha = g2 * 100_000 if g2 < 1000 else g2

    # Total Price parsing (e.g. "under ₹40 lakh", "under ₹30 lakh in Raigad")
    max_total_price = None
    min_total_price = None
    if not max_price_per_guntha:
        lakh_under = re.search(r'(?:under|below|less than|up to|max|कमी|खाली)?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|लाख)', q)
        if lakh_under and not ("per guntha" in q or "गुंठा" in q):
            max_total_price = float(lakh_under.group(1)) * 100_000

        if max_total_price is None:
            direct_price_under = re.search(r'(?:under|below|less than|up to)\s*(?:₹|rs\.?|inr)?\s*(\d{5,10})', q)
            if direct_price_under:
                max_total_price = float(direct_price_under.group(1))

    # Road proximity parsing (e.g. "within 100 metres of a road", "roadside", "near road")
    max_road_distance = None
    road_req = False
    road_match = re.search(r'(?:within|under|near|कमी)?\s*(\d+(?:\.\d+)?)\s*(?:m|meters?|metres?|मीटर)\s*(?:of\s*(?:a\s*)?)?(?:road|highway|रस्ता)', q)
    if road_match:
        max_road_distance = float(road_match.group(1))
        road_req = True
    elif "road" in q or "highway" in q or "रस्ता" in q:
        road_req = True

    return InterpretedFilters(
        district=district,
        taluka=taluka,
        village=None,
        survey_number=survey_number,
        land_type="agricultural",
        min_area_acres=min_area,
        max_area_acres=max_area,
        min_area_strict=min_area_strict,
        max_area_strict=max_area_strict,
        min_price_per_guntha=min_price_per_guntha,
        max_price_per_guntha=max_price_per_guntha,
        min_total_price=min_total_price,
        max_total_price=max_total_price,
        max_road_distance_meters=max_road_distance,
        road_proximity_required=road_req,
    )

def _interpret_query(query: str) -> InterpretedFilters:
    if settings.GEMINI_API_KEY:
        try:
            client = _get_gemini_client()
            prompt = (
                "Extract structured search filters from this Indian agricultural land query in English, Hindi, or Marathi. "
                "District options: 'Raigad' or 'Palghar'. "
                "Note: Panvel is a taluka in Raigad. 1 lakh = 100,000 INR and 1 crore = 10,000,000 INR. "
                "Extract survey_number if mentioned (e.g., '125/2', 'R-001'). "
                "Extract max_road_distance_meters if road proximity is specified (e.g., 'within 100 metres of a road'). "
                f"Query: {query}"
            )
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=[prompt],
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
        query = query.join(District).filter(District.name.ilike(filters.district))
    if filters.taluka:
        query = query.join(Taluka).filter(Taluka.name.ilike(filters.taluka))
    if filters.village:
        query = query.join(Village).filter(Village.name.ilike(filters.village))
    if filters.survey_number:
        query = query.filter(PropertyListing.survey_number.ilike(f"%{filters.survey_number}%"))
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
    if filters.max_road_distance_meters is not None:
        query = query.filter(PropertyListing.road_distance_meters <= filters.max_road_distance_meters)
    return query.all()

def _diagnose_unmet_constraints(db: Session, filters: InterpretedFilters) -> List[str]:
    """When a multi-constraint search yields 0 results, identify which constraints caused the miss."""
    unmet = []
    # Check district
    if filters.district:
        dist_count = db.query(PropertyListing).join(District).filter(District.name.ilike(filters.district)).count()
        if dist_count == 0:
            unmet.append(f"No properties found in district '{filters.district}'.")
    # Check road proximity
    if filters.max_road_distance_meters is not None:
        road_count = db.query(PropertyListing).filter(PropertyListing.road_distance_meters <= filters.max_road_distance_meters).count()
        if road_count == 0:
            unmet.append(f"No properties within {filters.max_road_distance_meters:g}m of a mapped road.")
    # Check price per guntha
    if filters.min_price_per_guntha or filters.max_price_per_guntha:
        q = db.query(PropertyListing)
        if filters.min_price_per_guntha:
            q = q.filter(PropertyListing.price_per_guntha >= filters.min_price_per_guntha)
        if filters.max_price_per_guntha:
            q = q.filter(PropertyListing.price_per_guntha <= filters.max_price_per_guntha)
        if q.count() == 0:
            unmet.append("No properties found within the specified price per guntha range.")
    # Check area
    if filters.min_area_acres:
        area_count = db.query(PropertyListing).filter(PropertyListing.area_acres >= filters.min_area_acres).count()
        if area_count == 0:
            unmet.append(f"No properties found with at least {filters.min_area_acres:g} acres.")
    # If individual constraints have hits but combined is empty
    if not unmet:
        unmet.append("No single property satisfies all combined criteria simultaneously (district, acreage, road distance, and price).")
    return unmet

def perform_ai_search(request: AISearchRequest, db: Session) -> AISearchResponse:
    # Interpret natural language query
    filters = _interpret_query(request.query)
    # Query DB with filters
    properties = _apply_filters(db, filters)

    unmet_constraints = []
    explanation = "Filters interpreted by Gemini AI."
    if not properties:
        unmet_constraints = _diagnose_unmet_constraints(db, filters)
        explanation = f"No matching properties found. " + " ".join(unmet_constraints)

    # Serialize results safely, handling geometry, multi-unit area, and provenance
    serialized = []
    for p in properties:
        lat = p.latitude
        lng = p.longitude
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
            "area_gunthas": float(p.area_gunthas) if p.area_gunthas is not None else float(p.area_acres * 40),
            "area_hectares": float(p.area_hectares) if p.area_hectares is not None else round(float(p.area_acres) * 0.404686, 4),
            "price_per_guntha": float(p.price_per_guntha),
            "total_price": float(total_price),
            "land_type": p.land_type,
            "road_distance_meters": float(p.road_distance_meters) if p.road_distance_meters is not None else None,
            "road_type": p.road_type,
            "geometry_type": getattr(p, "geometry_type", "point"),
            "provenance_type": getattr(p, "provenance_type", "demo"),
            "source_url": p.source_url,
            "verified_at": p.verified_at.isoformat() if p.verified_at else None,
            "verification_status": p.verification_status,
            "source_type": p.source_type,
            "district": getattr(p.district, "name", None),
            "taluka": getattr(p.taluka, "name", None),
            "village": getattr(p.village, "name", None),
        })

    return AISearchResponse(
        original_query=request.query,
        interpreted_filters=filters,
        matching_count=len(serialized),
        properties=serialized,
        explanation=explanation,
        unmet_constraints=unmet_constraints,
        unsupported=[],
        demo_notice="Demo data – unverified. Fictional parcels are never represented as official government records.",
    )
