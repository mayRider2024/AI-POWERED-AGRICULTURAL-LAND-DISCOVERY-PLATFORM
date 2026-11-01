import json
from typing import List, Optional, Any, Dict

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

    # Marathi/Hindi Devanagari digits transliteration at the very start so all regexes see standard Arabic numerals
    devanagari_nums = {'०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'}
    for d_digit, eng_digit in devanagari_nums.items():
        q = q.replace(d_digit, eng_digit)
    q_trans = q

    # District detection (including Marathi/Hindi transliterations: रायगड, रायगढ़, पालघर)
    district = None
    if "raigad" in q or "रायगड" in q or "रायगढ़" in q:
        district = "Raigad"
    elif "palghar" in q or "पालघर" in q:
        district = "Palghar"

    # Taluka detection (including Panvel, Alibag, Pen, Mhasala, Talasari, Vikramgad, Dahanu and Marathi/Hindi terms)
    taluka = None
    talukas_map = {
        "panvel": "Panvel",
        "पनवेल": "Panvel",
        "alibag": "Alibag",
        "alibaug": "Alibag",
        "अलिबाग": "Alibag",
        "अलीबाग": "Alibag",
        "pen": "Pen",
        "पेण": "Pen",
        "पेन": "Pen",
        "mhasala": "Mhasala",
        "म्हसळा": "Mhasala",
        "म्हासला": "Mhasala",
        "talasari": "Talasari",
        "तलासरी": "Talasari",
        "vikramgad": "Vikramgad",
        "विक्रमगड": "Vikramgad",
        "विक्रमगढ़": "Vikramgad",
        "dahanu": "Dahanu",
        "डहाणू": "Dahanu",
        "दहानू": "Dahanu",
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

    # Survey / Gat number parsing (e.g. "survey number 125/2", "gat no 45", "survey 125", "r-001", "p-001", "खसरा 125")
    survey_number = None
    survey_match = re.search(r'(?:survey(?:\s*(?:no\.?|number))?|gat(?:\s*(?:no\.?|number))?|सर्व्हे(?:\s*क्र\.?)?|गट(?:\s*क्र\.?)?|सर्वे(?:\s*नंबर)?|खसरा(?:\s*नं\.?)?)\s*[:#-]?\s*([a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:/[0-9]+)?)', q)
    if survey_match:
        survey_number = survey_match.group(1).upper()
    else:
        # direct code like R-001, P-003
        code_match = re.search(r'\b([rp]-[0-9]{3})\b', q)
        if code_match:
            survey_number = code_match.group(1).upper()

    # Road proximity parsing (English, Marathi & Hindi: "within 100 metres of a road", "रस्त्यापासून १०० मीटर", "सड़क से 100 मीटर")
    max_road_distance = None
    road_req = False
    road_match = re.search(
        r'(?:no\s+more\s+than|within|under|less\s+than|up\s+to|at\s+most|maximum(?:\s+of)?|कमी|अधिक)?\s*(\d+(?:\.\d+)?)\s*(?:m\b|meters?\b|metres?\b|मीटर)\s*(?:from|of|अंतरावर|अंतरापर्यंत|दूरी|दूर)?\s*(?:a\s*)?(?:road|highway|रस्ता|रस्त्या|सड़क)',
        q
    )
    if not road_match:
        # Check prefix form: "रस्त्यापासून २०० मीटर", "रस्त्यालगत ५० मीटर", "सड़क से १०० मीटर"
        road_match = re.search(
            r'(?:रस्त्यापासून|रस्त्यालगत|रस्त्यावरून|रस्ता|सड़क\s*से|सड़क)\s*(?:कमीत\s*कमी|जास्तीत\s*जास्त|सुमारे|आत|पर्यंत|अधिक)?\s*(\d+(?:\.\d+)?)\s*(?:m\b|meters?\b|metres?\b|मीटर)',
            q
        )

    if road_match:
        max_road_distance = float(road_match.group(1))
        road_req = True
    elif "road" in q or "highway" in q or "रस्ता" in q or "रस्त्या" in q or "सड़क" in q:
        road_req = True

    # Area parsing (acres / एकर / एकड़ / gunthas / गुंठा)
    exact_area = None
    min_area = None
    min_area_strict = False
    max_area = None
    max_area_strict = False

    area_unit = r'(?:acres?|acre|एकर|एकड़)'

    # Check for area range (e.g. "5 to 10 acres", "between 5 and 10 acres", "५ ते १० एकर", "5 से 10 एकड़")
    area_range = re.search(rf'(?:between\s+)?(\d+(?:\.\d+)?)\s*(?:-|to|and|ते|से)\s*(\d+(?:\.\d+)?)\s*{area_unit}', q_trans)
    if area_range:
        min_area = float(area_range.group(1))
        max_area = float(area_range.group(2))
    else:
        # Unit MUST be explicitly present - never make unit optional to prevent capturing road distance or prices!
        area_at_least = (
            re.search(rf'(?:at\s+least|minimum(?:\s+of)?|min\b|no\s+less\s+than|कमीतकमी|कम\s*से\s*कम)\s*(\d+(?:\.\d+)?)\s*{area_unit}', q_trans) or
            re.search(rf'(\d+(?:\.\d+)?)\s*{area_unit}\s*(?:or\s+more|and\s+above|\+|किंवा\s*अधिक|या\s*अधिक|या\s*ज्यादा)', q_trans)
        )
        area_above = re.search(rf'(?<!no\s)(?<!not\s)(?:above|more\s+than|greater\s+than|>|पेक्षा\s+जास्त|से\s*अधिक|से\s*ज्यादा)\s*(\d+(?:\.\d+)?)\s*{area_unit}', q_trans)
        area_under = (
            re.search(rf'(?:under|less\s+than|below|no\s+more\s+than|up\s+to|at\s+most|maximum(?:\s+of)?|max\b|<|पेक्षा\s+कमी|पर्यंत|से\s*कम|तक)\s*(\d+(?:\.\d+)?)\s*{area_unit}', q_trans) or
            re.search(rf'(\d+(?:\.\d+)?)\s*{area_unit}\s*(?:or\s+less|and\s+below|किंवा\s*कमी|या\s*कम)', q_trans)
        )
        area_explicit_exact = re.search(rf'(?:exact(?:ly)?|नक्की|अचूक|सटीक|ठीक)\s*(\d+(?:\.\d+)?)\s*{area_unit}', q_trans)
        area_standard_exact = re.search(rf'(?:^|\s|[^\w\u0900-\u097F])(\d+(?:\.\d+)?)\s*[-]?\s*{area_unit}(?:$|\s|[.,;:!?।,])', q_trans)

        if area_at_least:
            min_area = float(area_at_least.group(1))
            min_area_strict = False
        elif area_above:
            min_area = float(area_above.group(1))
            min_area_strict = True
        elif area_under:
            max_area = float(area_under.group(1))
            max_area_strict = False if any(kw in area_under.group(0) for kw in ["up to", "at most", "maximum", "max", "no more than", "पर्यंत", "तक"]) else True
        elif area_explicit_exact:
            exact_area = float(area_explicit_exact.group(1))
        elif area_standard_exact:
            exact_area = float(area_standard_exact.group(1))

    # Price per guntha parsing (e.g. "between ₹10 lakh and ₹15 lakh per guntha", "१० ते १५ लाख प्रति गुंठा", "10 लाख से 15 लाख रुपये प्रति गुंठा")
    min_price_per_guntha = None
    max_price_per_guntha = None
    guntha_unit = r'(?:gunthas?|guntha|guntas?|gunta|गुंठा|गुंठे)'
    lac_unit = r'(?:lakhs?|lakh|lacs?|lac|लाख)'
    curr_prefix = r'(?:₹|rs\.?|inr|रुपये)?'

    guntha_range = (
        re.search(
            rf'(?:price\s+range\s+)?(?:between\s+)?{curr_prefix}\s*(\d+(?:\.\d+)?)\s*{lac_unit}?\s*(?:per|/|a)?\s*{guntha_unit}?\s*(?:to|and|-|ते|से)\s*{curr_prefix}\s*(\d+(?:\.\d+)?)\s*{lac_unit}\s*(?:रुपये\s*)?(?:per|/|a|प्रति)\s*{guntha_unit}',
            q_trans
        ) or
        re.search(
            rf'(?:प्रति\s*{guntha_unit}|{guntha_unit}\s*(?:प्रति|दर)?)\s*{curr_prefix}\s*(\d+(?:\.\d+)?)\s*(?:-|to|ते|से)\s*(\d+(?:\.\d+)?)\s*{lac_unit}',
            q_trans
        ) or
        re.search(
            rf'{curr_prefix}\s*(\d+(?:\.\d+)?)\s*(?:-|to|ते|से)\s*(\d+(?:\.\d+)?)\s*{lac_unit}\s*(?:प्रति|दर)?\s*{guntha_unit}',
            q_trans
        )
    )
    if guntha_range:
        g1 = float(guntha_range.group(1))
        g2 = float(guntha_range.group(2))
        min_price_per_guntha = g1 * 100_000 if g1 < 1000 else g1
        max_price_per_guntha = g2 * 100_000 if g2 < 1000 else g2
    else:
        single_guntha_price = re.search(
            rf'{curr_prefix}\s*(\d+(?:\.\d+)?)\s*({lac_unit})?\s*(?:per|/|a|प्रति)\s*{guntha_unit}',
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
        lakh_under = re.search(r'(?:under|below|less than|up to|max|कमी|खाली|कम|तक)?\s*(?:₹|rs\.?|inr|रुपये)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|लाख)', q_trans)
        if lakh_under and not ("per guntha" in q_trans or "per gunta" in q_trans or "a gunta" in q_trans or "a guntha" in q_trans or "गुंठा" in q_trans):
            max_total_price = float(lakh_under.group(1)) * 100_000

        if max_total_price is None:
            direct_price_under = re.search(r'(?:under|below|less than|up to|कम|तक)\s*(?:₹|rs\.?|inr|रुपये)?\s*(\d{5,10})', q_trans)
            if direct_price_under:
                max_total_price = float(direct_price_under.group(1))

    return InterpretedFilters(
        district=district,
        taluka=taluka,
        village=None,
        survey_number=survey_number,
        land_type="agricultural",
        exact_area_acres=exact_area,
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

def _normalize_acreage_filters(filters: InterpretedFilters, query: str) -> InterpretedFilters:
    """Ensure acreage semantics strictly adhere to user intent:
    - If user specifies an acreage without explicit bounding keywords ("at least", "minimum", "10 acres or more", "under", "between", etc.),
      it must be interpreted as exact acreage (exact_area_acres) with floating-point tolerance.
    - Only use min_area_acres when the user explicitly says 'at least', 'minimum', or '10 acres or more' (or equivalent).
    """
    q = query.lower()
    marathi_nums = {'०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'}
    for m_digit, eng_digit in marathi_nums.items():
        q = q.replace(m_digit, eng_digit)

    area_unit = r'(?:acres?|acre|एकर|एकड़)'
    has_range = bool(re.search(rf'(?:between\s+)?(\d+(?:\.\d+)?)\s*(?:-|to|and|ते|से)\s*(\d+(?:\.\d+)?)\s*{area_unit}', q))
    has_explicit_min = bool(
        re.search(rf'(?:at\s+least|minimum(?:\s+of)?|min\b|no\s+less\s+than|कमीतकमी|कम\s*से\s*कम)\s*(\d+(?:\.\d+)?)\s*{area_unit}', q) or
        re.search(rf'(\d+(?:\.\d+)?)\s*{area_unit}\s*(?:or\s+more|and\s+above|\+|किंवा\s*अधिक|या\s*अधिक|या\s*ज्यादा)', q) or
        re.search(rf'(?<!no\s)(?<!not\s)(?:above|more\s+than|greater\s+than|>|पेक्षा\s+जास्त|से\s*अधिक|से\s*ज्यादा)\s*(\d+(?:\.\d+)?)\s*{area_unit}', q)
    )
    has_explicit_max = bool(
        re.search(rf'(?:under|less\s+than|below|no\s+more\s+than|up\s+to|at\s+most|maximum(?:\s+of)?|max\b|<|पेक्षा\s+कमी|पर्यंत|से\s*कम|तक)\s*(\d+(?:\.\d+)?)\s*{area_unit}', q) or
        re.search(rf'(\d+(?:\.\d+)?)\s*{area_unit}\s*(?:or\s+less|and\s+below|किंवा\s*कमी|या\s*कम)', q)
    )

    # If both min and max are set and equal (or within floating point delta), treat as exact
    if filters.min_area_acres is not None and filters.max_area_acres is not None:
        if abs(filters.min_area_acres - filters.max_area_acres) < 0.01:
            filters.exact_area_acres = filters.min_area_acres
            filters.min_area_acres = None
            filters.max_area_acres = None

    # If min_area_acres was set by LLM without explicit minimum or range keywords in the query:
    if filters.exact_area_acres is None and not has_range and not has_explicit_min:
        if filters.min_area_acres is not None and filters.max_area_acres is None:
            filters.exact_area_acres = filters.min_area_acres
            filters.min_area_acres = None

    # If max_area_acres was set without explicit max or range keywords:
    if filters.exact_area_acres is None and not has_range and not has_explicit_max:
        if filters.max_area_acres is not None and filters.min_area_acres is None:
            filters.exact_area_acres = filters.max_area_acres
            filters.max_area_acres = None

    # If explicit minimum was requested, ensure exact_area_acres is NOT set
    if has_explicit_min and filters.exact_area_acres is not None:
        if filters.min_area_acres is None:
            filters.min_area_acres = filters.exact_area_acres
        filters.exact_area_acres = None

    return filters

def _interpret_query(query: str, history: Optional[List[Any]] = None) -> InterpretedFilters:
    if settings.GEMINI_API_KEY:
        try:
            client = _get_gemini_client()
            
            # Format prior conversational messages if available (bounded to last 6 turns to manage context window)
            context_section = ""
            if history:
                bounded_history = history[-6:]
                history_lines = []
                for msg in bounded_history:
                    role_label = "User" if (getattr(msg, "role", None) == "user" or (isinstance(msg, dict) and msg.get("role") == "user")) else "Assistant"
                    content_str = getattr(msg, "content", None) if not isinstance(msg, dict) else msg.get("content")
                    if content_str:
                        # Clean content to first 250 characters
                        clean_content = content_str.strip()[:250].replace("\n", " ")
                        history_lines.append(f"{role_label}: {clean_content}")
                if history_lines:
                    context_section = "Prior conversation context:\n" + "\n".join(history_lines) + "\n\n"

            prompt = (
                "Extract structured search filters from this Indian agricultural land query in English, Hindi, or Marathi.\n"
                "CRITICAL INSTRUCTIONS ON ACREAGE INTERPRETATION:\n"
                "- When the query mentions an acreage without bounding terms (e.g., '10 acres', '10 acre', '10-acre', 'exactly 10 acres', '१० एकर'), "
                "set exact_area_acres = 10.0. Leave min_area_acres and max_area_acres as null.\n"
                "- ONLY set min_area_acres when the query explicitly uses minimum terminology: 'at least', 'minimum', '10 acres or more', 'no less than', 'कमीतकमी', 'किंवा अधिक'. Set min_area_strict=true only if 'more than' or 'above' or 'greater than' is used.\n"
                "- ONLY set max_area_acres when the query explicitly uses maximum terminology: 'under', 'less than', 'below', 'up to', 'maximum', 'at most', 'कमी', 'पर्यंत'. Set max_area_strict=true only if 'less than' or 'under' or 'below' is used.\n"
                "- For ranges (e.g., 'between 8 and 12 acres', '8 to 12 acres', '८ ते १२ एकर'): set min_area_acres = 8.0 and max_area_acres = 12.0. Leave exact_area_acres as null.\n"
                "- Never confuse road distance with land acreage. '100 meters from a road' -> max_road_distance_meters = 100. Do not assign distance in meters to acreage.\n"
                "- 'Rs 10 lac per gunta to Rs 15 lac a gunta' or 'between ₹10 lakh and ₹15 lakh per guntha' -> min_price_per_guntha = 1000000, max_price_per_guntha = 1500000.\n"
                "District options: 'Raigad' or 'Palghar'.\n"
                "Note: Panvel is a taluka in Raigad. 1 lakh/lac = 100,000 INR and 1 crore = 10,000,000 INR. 1 acre = 40 gunthas.\n"
                "Extract survey_number if mentioned (e.g., '125/2', 'R-001', 'P-001').\n"
                "Extract max_road_distance_meters if road proximity is specified (e.g., 'within 100 metres of a road', 'no more than 100 meters from a road').\n"
                "If the query references previous constraints from conversation context (e.g. 'what about under 20 lakh instead?' or 'in Panvel now'), merge and update the filters accordingly.\n\n"
                f"{context_section}"
                f"Current User Query: {query}"
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
            filters = InterpretedFilters.model_validate(data)
            return _normalize_acreage_filters(filters, query)
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

    # Exact acreage with small floating-point tolerance (±0.05 acres)
    if filters.exact_area_acres is not None:
        query = query.filter(
            PropertyListing.area_acres >= filters.exact_area_acres - 0.05,
            PropertyListing.area_acres <= filters.exact_area_acres + 0.05,
        )
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
    if filters.exact_area_acres is not None:
        area_count = db.query(PropertyListing).filter(
            PropertyListing.area_acres >= filters.exact_area_acres - 0.05,
            PropertyListing.area_acres <= filters.exact_area_acres + 0.05,
        ).count()
        if area_count == 0:
            unmet.append(f"No properties found with exactly {filters.exact_area_acres:g} acres.")
    elif filters.min_area_acres is not None or filters.max_area_acres is not None:
        q = db.query(PropertyListing)
        if filters.min_area_acres is not None:
            if filters.min_area_strict:
                q = q.filter(PropertyListing.area_acres > filters.min_area_acres)
            else:
                q = q.filter(PropertyListing.area_acres >= filters.min_area_acres)
        if filters.max_area_acres is not None:
            if filters.max_area_strict:
                q = q.filter(PropertyListing.area_acres < filters.max_area_acres)
            else:
                q = q.filter(PropertyListing.area_acres <= filters.max_area_acres)
        if q.count() == 0:
            if filters.min_area_acres and filters.max_area_acres:
                unmet.append(f"No properties found between {filters.min_area_acres:g} and {filters.max_area_acres:g} acres.")
            elif filters.min_area_acres:
                unmet.append(f"No properties found with at least {filters.min_area_acres:g} acres.")
            else:
                unmet.append(f"No properties found under {filters.max_area_acres:g} acres.")
    # If individual constraints have hits but combined is empty
    if not unmet:
        unmet.append("No single property satisfies all combined criteria simultaneously (district, acreage, road distance, and price).")
    return unmet

def perform_ai_search(request: AISearchRequest, db: Session) -> AISearchResponse:
    lang = (getattr(request, "language", None) or "en").strip().lower()[:2]
    # Interpret natural language query with context awareness
    filters = _interpret_query(request.query, history=getattr(request, "history", None))
    # Query DB with filters
    properties = _apply_filters(db, filters)

    unmet_constraints = []
    if properties:
        if lang == "mr":
            explanation = "जेमिनी एआय द्वारे स्पष्ट केलेले निकष."
        elif lang == "hi":
            explanation = "जेमिनी एआई द्वारा व्याख्यायित फिल्टर."
        else:
            explanation = "Filters interpreted by Gemini AI."
    else:
        unmet_constraints = _diagnose_unmet_constraints(db, filters)
        if lang == "mr":
            explanation = "कोणतीही जमीन सापडली नाही. " + " ".join(unmet_constraints)
        elif lang == "hi":
            explanation = "कोई ज़मीन नहीं मिली. " + " ".join(unmet_constraints)
        else:
            explanation = f"No matching properties found. " + " ".join(unmet_constraints)

    demo_notice = "Demo data – unverified. Fictional parcels are never represented as official government records."
    if lang == "mr":
        demo_notice = "प्रात्यक्षिक माहिती – असत्यापित. काल्पनिक जमिनी अधिकृत सरकारी नोंदी म्हणून दर्शविल्या जात नाहीत."
    elif lang == "hi":
        demo_notice = "डेमो डेटा – असत्यापित. काल्पनिक ज़मीनों को आधिकारिक सरकारी रिकॉर्ड के रूप में कभी प्रस्तुत नहीं किया जाता है."

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
        demo_notice=demo_notice,
    )
