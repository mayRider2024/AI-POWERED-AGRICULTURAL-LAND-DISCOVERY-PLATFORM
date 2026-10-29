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

    # Marathi digits transliteration at the very start so all regexes see standard Arabic numerals
    marathi_nums = {'०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'}
    for m_digit, eng_digit in marathi_nums.items():
        q = q.replace(m_digit, eng_digit)
    q_trans = q

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

    # Road proximity parsing (English & Marathi: "within 100 metres of a road", "no more than 100 meters from a road", "रस्त्यापासून २०० मीटर")
    max_road_distance = None
    road_req = False
    road_match = re.search(
        r'(?:no\s+more\s+than|within|under|less\s+than|up\s+to|at\s+most|maximum(?:\s+of)?|कमी)?\s*(\d+(?:\.\d+)?)\s*(?:m\b|meters?\b|metres?\b|मीटर)\s*(?:from|of|अंतरावर|अंतरापर्यंत)?\s*(?:a\s*)?(?:road|highway|रस्ता|रस्त्या)',
        q
    )
    if not road_match:
        # Check Marathi prefix form: "रस्त्यापासून २०० मीटर", "रस्त्यालगत ५० मीटर"
        road_match = re.search(
            r'(?:रस्त्यापासून|रस्त्यालगत|रस्त्यावरून|रस्ता)\s*(?:कमीत\s*कमी|जास्तीत\s*जास्त|सुमारे|आत|पर्यंत)?\s*(\d+(?:\.\d+)?)\s*(?:m\b|meters?\b|metres?\b|मीटर)',
            q
        )

    if road_match:
        max_road_distance = float(road_match.group(1))
        road_req = True
    elif "road" in q or "highway" in q or "रस्ता" in q or "रस्त्या" in q:
        road_req = True

    # Area parsing (acres / एकर / gunthas / गुंठा)
    min_area = None
    min_area_strict = False
    max_area = None
    max_area_strict = False

    # Marathi digits transliteration
    marathi_nums = {'०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'}
    q_trans = q
    for m_digit, eng_digit in marathi_nums.items():
        q_trans = q_trans.replace(m_digit, eng_digit)

    area_unit = r'(?:acres?|acre|एकर)'

    # Check for area range (e.g. "5 to 10 acres", "between 5 and 10 acres", "५ ते १० एकर")
    area_range = re.search(rf'(?:between\s+)?(\d+(?:\.\d+)?)\s*(?:-|to|and|ते)\s*(\d+(?:\.\d+)?)\s*{area_unit}', q_trans)
    if area_range:
        min_area = float(area_range.group(1))
        max_area = float(area_range.group(2))
    else:
        # Unit MUST be explicitly present - never make unit optional to prevent capturing road distance or prices!
        area_at_least = re.search(rf'(?:at\s+least|minimum(?:\s+of)?|min|no\s+less\s+than|कमीतकमी)\s*(\d+(?:\.\d+)?)\s*{area_unit}', q_trans)
        area_above = re.search(rf'(?:above|more\s+than|greater\s+than|>|पेक्षा\s+जास्त)\s*(\d+(?:\.\d+)?)\s*{area_unit}', q_trans)
        area_under = re.search(rf'(?:under|less\s+than|below|no\s+more\s+than|<|पेक्षा\s+कमी|पर्यंत)\s*(\d+(?:\.\d+)?)\s*{area_unit}', q_trans)
        area_exact = re.search(rf'\b(\d+(?:\.\d+)?)\s*{area_unit}\b', q_trans)

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
            # "10 acres of land", "10 acre agricultural land"
            min_area = float(area_exact.group(1))
            min_area_strict = False

    # Price per guntha parsing (e.g. "between ₹10 lakh and ₹15 lakh per guntha", "Rs 10 lac per gunta to Rs 15 lac a gunta", "₹50000 per guntha")
    min_price_per_guntha = None
    max_price_per_guntha = None
    guntha_unit = r'(?:gunthas?|guntha|guntas?|gunta|गुंठा|गुंठे)'
    lac_unit = r'(?:lakhs?|lakh|lacs?|lac|लाख)'
    curr_prefix = r'(?:₹|rs\.?|inr)?'

    guntha_range = re.search(
        rf'(?:price\s+range\s+)?(?:between\s+)?{curr_prefix}\s*(\d+(?:\.\d+)?)\s*{lac_unit}?\s*(?:per|/|a)?\s*{guntha_unit}?\s*(?:to|and|-|ते)\s*{curr_prefix}\s*(\d+(?:\.\d+)?)\s*{lac_unit}\s*(?:per|/|a)\s*{guntha_unit}',
        q_trans
    )
    if guntha_range:
        g1 = float(guntha_range.group(1))
        g2 = float(guntha_range.group(2))
        min_price_per_guntha = g1 * 100_000 if g1 < 1000 else g1
        max_price_per_guntha = g2 * 100_000 if g2 < 1000 else g2
    else:
        single_guntha_price = re.search(
            rf'{curr_prefix}\s*(\d+(?:\.\d+)?)\s*({lac_unit})?\s*(?:per|/|a)\s*{guntha_unit}',
            q_trans
        )
        if single_guntha_price:
            amt = float(single_guntha_price.group(1))
            if single_guntha_price.group(2) or amt < 1000:
                amt = amt * 100_000
            max_price_per_guntha = amt

    # Total Price parsing (e.g. "under ₹40 lakh", "under ₹30 lakh in Raigad")
    max_total_price = None
    min_total_price = None
    if not max_price_per_guntha:
        lakh_under = re.search(r'(?:under|below|less than|up to|max|कमी|खाली)?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|लाख)', q_trans)
        if lakh_under and not ("per guntha" in q_trans or "per gunta" in q_trans or "a gunta" in q_trans or "a guntha" in q_trans or "गुंठा" in q_trans):
            max_total_price = float(lakh_under.group(1)) * 100_000

        if max_total_price is None:
            direct_price_under = re.search(r'(?:under|below|less than|up to)\s*(?:₹|rs\.?|inr)?\s*(\d{5,10})', q_trans)
            if direct_price_under:
                max_total_price = float(direct_price_under.group(1))

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
                "CRITICAL INSTRUCTIONS ON UNITS AND CONSTRAINTS: "
                "- Never confuse road distance with land acreage. '100 meters from a road' -> max_road_distance_meters = 100. "
                "- '10 acre land' -> min_area_acres = 10. Do not assign distance in meters to acreage. "
                "- 'Rs 10 lac per gunta to Rs 15 lac a gunta' -> min_price_per_guntha = 1000000, max_price_per_guntha = 1500000. "
                "District options: 'Raigad' or 'Palghar'. "
                "Note: Panvel is a taluka in Raigad. 1 lakh/lac = 100,000 INR and 1 crore = 10,000,000 INR. 1 acre = 40 gunthas. "
                "Extract survey_number if mentioned (e.g., '125/2', 'R-001', 'P-001'). "
                "Extract max_road_distance_meters if road proximity is specified (e.g., 'within 100 metres of a road', 'no more than 100 meters from a road'). "
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
