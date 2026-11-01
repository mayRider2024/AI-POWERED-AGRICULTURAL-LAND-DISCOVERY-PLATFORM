import pytest
from app.schemas.ai_search import InterpretedFilters
from app.services.ai_search import (
    _rule_based_interpret_query,
    _normalize_acreage_filters,
    _apply_filters,
)
from app.db.session import SessionLocal
from app.models import PropertyListing, District

def test_acreage_distinction_exact_10_acres():
    """Verify queries requesting '10 acre' or '10 acres' or 'exactly 10 acres' map to exact_area_acres=10.0."""
    queries = [
        "10 acres in Palghar between ₹10 lakh and ₹15 lakh per guntha, within 100 metres of a road",
        "Find me a 10 acre agricultural land in palghar in the price range Rs 10 lac per gunta to Rs 15 lac a gunta. It should be no more than 100 meters from a road.",
        "Find 10 acre agricultural land in Palghar",
        "exactly 10 acres in Palghar",
        "पालघरमध्ये १० एकर शेतजमीन",
    ]
    for q in queries:
        f = _rule_based_interpret_query(q)
        assert f.exact_area_acres == 10.0, f"Query '{q}' failed exact_area_acres check: got {f.exact_area_acres}"
        assert f.min_area_acres is None, f"Query '{q}' unexpectedly set min_area_acres: {f.min_area_acres}"
        assert f.max_area_acres is None, f"Query '{q}' unexpectedly set max_area_acres: {f.max_area_acres}"

def test_acreage_distinction_at_least_10_acres():
    """Verify queries requesting 'at least', 'minimum', or '10 acres or more' map to min_area_acres=10.0."""
    queries = [
        "at least 10 acres in Palghar",
        "minimum 10 acres in Palghar",
        "10 acres or more in Palghar",
        "no less than 10 acres in Palghar",
        "10 acres and above in Palghar",
        "पालघरमध्ये कमीतकमी १० एकर जमीन",
    ]
    for q in queries:
        f = _rule_based_interpret_query(q)
        assert f.exact_area_acres is None, f"Query '{q}' unexpectedly set exact_area_acres: {f.exact_area_acres}"
        assert f.min_area_acres == 10.0, f"Query '{q}' failed min_area_acres check: got {f.min_area_acres}"
        assert f.max_area_acres is None, f"Query '{q}' unexpectedly set max_area_acres: {f.max_area_acres}"

def test_acreage_distinction_maximum_10_acres():
    """Verify queries requesting 'maximum', 'up to', 'under', or 'at most' 10 acres map to max_area_acres=10.0."""
    queries = [
        "maximum 10 acres in Palghar",
        "up to 10 acres in Palghar",
        "under 10 acres in Palghar",
        "at most 10 acres in Palghar",
        "no more than 10 acres in Palghar",
        "less than 10 acres in Palghar",
    ]
    for q in queries:
        f = _rule_based_interpret_query(q)
        assert f.exact_area_acres is None, f"Query '{q}' unexpectedly set exact_area_acres: {f.exact_area_acres}"
        assert f.min_area_acres is None, f"Query '{q}' unexpectedly set min_area_acres: {f.min_area_acres}"
        assert f.max_area_acres == 10.0, f"Query '{q}' failed max_area_acres check: got {f.max_area_acres}"

def test_acreage_distinction_between_8_and_12_acres():
    """Verify range queries like 'between 8 and 12 acres' map to min_area_acres=8.0 and max_area_acres=12.0."""
    queries = [
        "between 8 and 12 acres in Palghar",
        "8 to 12 acres in Palghar",
        "8 - 12 acres in Palghar",
        "पालघरमध्ये ८ ते १२ एकर जमीन",
    ]
    for q in queries:
        f = _rule_based_interpret_query(q)
        assert f.exact_area_acres is None, f"Query '{q}' unexpectedly set exact_area_acres: {f.exact_area_acres}"
        assert f.min_area_acres == 8.0, f"Query '{q}' failed min_area_acres check: got {f.min_area_acres}"
        assert f.max_area_acres == 12.0, f"Query '{q}' failed max_area_acres check: got {f.max_area_acres}"

def test_normalization_guards_llm_hallucinations():
    """Verify that _normalize_acreage_filters converts unintentional min_area_acres to exact_area_acres
    when the query contains no minimum/range keywords."""
    f_raw = InterpretedFilters(min_area_acres=10.0)
    # Query with no minimum keyword -> must normalize to exact 10 acres
    normalized = _normalize_acreage_filters(f_raw, "10 acres in Palghar between 10L and 15L per guntha")
    assert normalized.exact_area_acres == 10.0
    assert normalized.min_area_acres is None

    # Query with explicit minimum keyword -> must retain min_area_acres
    f_min = InterpretedFilters(exact_area_acres=10.0)
    normalized_min = _normalize_acreage_filters(f_min, "at least 10 acres in Palghar")
    assert normalized_min.min_area_acres == 10.0
    assert normalized_min.exact_area_acres is None

def test_database_exact_query_excludes_p_dah_147_and_returns_6_properties():
    """Verify against database that exact 10-acre query returns exactly 6 properties
    and explicitly excludes 12-acre property P-DAH-147."""
    session = SessionLocal()
    try:
        q = "10 acres in Palghar between ₹10 lakh and ₹15 lakh per guntha, within 100 metres of a road"
        filters = _rule_based_interpret_query(q)

        results = _apply_filters(session, filters)
        surveys = [p.survey_number for p in results]

        # Must return exactly 6 properties
        assert len(results) == 6, f"Expected exactly 6 properties, got {len(results)}: {surveys}"

        # P-DAH-147 has 12 acres and must NOT be in the results
        assert "P-DAH-147" not in surveys, "P-DAH-147 (12 acres) was incorrectly included in exact 10-acre query!"

        # All 6 properties must have exactly 10.0 acres
        for p in results:
            assert abs(float(p.area_acres) - 10.0) <= 0.05, f"Property {p.survey_number} has area {p.area_acres}, not 10.0"

        # The six known 10-acre synthetic demonstration properties
        expected_surveys = {"P-PAL-100", "P-PAL-101", "P-VIK-101", "P-DAH-103", "P-TAL-107", "P-DAH-109"}
        assert set(surveys) == expected_surveys, f"Mismatch in expected surveys: {set(surveys)} vs {expected_surveys}"
    finally:
        session.close()

def test_database_at_least_10_acres_includes_p_dah_147():
    """Verify that an explicit 'at least 10 acres' query DOES include P-DAH-147 (12 acres)."""
    session = SessionLocal()
    try:
        q = "at least 10 acres in Palghar between ₹10 lakh and ₹15 lakh per guntha, within 100 metres of a road"
        filters = _rule_based_interpret_query(q)
        results = _apply_filters(session, filters)
        surveys = [p.survey_number for p in results]

        # Must return 7 properties (the 6 ten-acre ones plus P-DAH-147)
        assert len(results) == 7, f"Expected 7 properties for at-least query, got {len(results)}: {surveys}"
        assert "P-DAH-147" in surveys, "P-DAH-147 should be included in 'at least 10 acres' query"
    finally:
        session.close()

def test_database_between_8_and_12_acres_includes_all_7():
    """Verify that 'between 8 and 12 acres' query includes all 7 properties (6 with 10 acres and 1 with 12 acres)."""
    session = SessionLocal()
    try:
        q = "between 8 and 12 acres in Palghar between ₹10 lakh and ₹15 lakh per guntha, within 100 metres of a road"
        filters = _rule_based_interpret_query(q)
        results = _apply_filters(session, filters)
        surveys = [p.survey_number for p in results]

        assert len(results) == 7, f"Expected 7 properties for 8-12 acres range, got {len(results)}: {surveys}"
        assert "P-DAH-147" in surveys
    finally:
        session.close()

