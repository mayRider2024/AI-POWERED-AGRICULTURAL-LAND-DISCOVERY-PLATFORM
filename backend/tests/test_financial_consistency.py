import pytest
from app.models.property_listing import GUNTHAS_PER_ACRE, PropertyListing
from app.services.ai_search import _rule_based_interpret_query
from app.schemas.ai_search import InterpretedFilters

def test_guntha_area_and_total_price_calculation():
    """Verify formula:
    1 acre = 40 gunthas
    total_price = area_acres * 40 * price_per_guntha
    """
    assert GUNTHAS_PER_ACRE == 40

    # R-001 (Alibag): 2.5 acres, ₹50,000/guntha
    gunthas, total = PropertyListing.calculate_derived(2.5, 50000.0)
    assert gunthas == 100.0
    assert total == 5000000.0  # ₹50 Lakh

    # R-002 (Pen): 1.8 acres, ₹52,000/guntha
    gunthas, total = PropertyListing.calculate_derived(1.8, 52000.0)
    assert gunthas == 72.0
    assert total == 3744000.0  # ₹37.44 Lakh

    # P-001 (Talasari): 3.0 acres, ₹48,000/guntha
    gunthas, total = PropertyListing.calculate_derived(3.0, 48000.0)
    assert gunthas == 120.0
    assert total == 5760000.0  # ₹57.60 Lakh

    # P-002 (Vikramgad): 2.2 acres, ₹47,000/guntha
    gunthas, total = PropertyListing.calculate_derived(2.2, 47000.0)
    assert gunthas == 88.0
    assert total == 4136000.0  # ₹41.36 Lakh

    # R-003 (Mhasala): 1.2 acres, ₹51,000/guntha
    gunthas, total = PropertyListing.calculate_derived(1.2, 51000.0)
    assert gunthas == 48.0
    assert total == 2448000.0  # ₹24.48 Lakh

    # P-003 (Dahanu): 2.7 acres, ₹46,000/guntha
    gunthas, total = PropertyListing.calculate_derived(2.7, 46000.0)
    assert gunthas == 108.0
    assert total == 4968000.0  # ₹49.68 Lakh

def test_indian_currency_parsing():
    """Verify Indian currency conversion:
    1 Lakh = 100,000 INR
    """
    f1 = _rule_based_interpret_query("Show farms under ₹30 lakh in Raigad")
    assert f1.district == "Raigad"
    assert f1.max_total_price == 3000000.0

    f2 = _rule_based_interpret_query("Show land below 1.5 lakhs")
    assert f2.max_total_price == 150000.0

    f3 = _rule_based_interpret_query("Farms under ₹50 lac in Palghar")
    assert f3.district == "Palghar"
    assert f3.max_total_price == 5000000.0

def test_prompt_assignment_queries():
    """Verify required assignment test queries from Prompt Section 4:
    1. 'Find me 10 acres of agricultural land in Palghar between ₹10 lakh and ₹15 lakh per guntha, within 100 metres of a road.'
    2. 'Show agricultural land under ₹40 lakh in Raigad.'
    3. 'Find survey number 125/2 in Panvel.'
    4. 'मला पालघरमध्ये ५ एकर शेतीची जमीन दाखवा.'
    """
    # 1. 10 acres, Palghar, between 10L and 15L per guntha, within 100m of road
    q1 = "Find me 10 acres of agricultural land in Palghar between ₹10 lakh and ₹15 lakh per guntha, within 100 metres of a road."
    f1 = _rule_based_interpret_query(q1)
    assert f1.district == "Palghar"
    assert f1.min_area_acres == 10.0
    assert f1.min_price_per_guntha == 1000000.0
    assert f1.max_price_per_guntha == 1500000.0
    assert f1.max_road_distance_meters == 100.0

    # 2. Under 40 lakh in Raigad
    q2 = "Show agricultural land under ₹40 lakh in Raigad."
    f2 = _rule_based_interpret_query(q2)
    assert f2.district == "Raigad"
    assert f2.max_total_price == 4000000.0

    # 3. Survey number 125/2 in Panvel
    q3 = "Find survey number 125/2 in Panvel."
    f3 = _rule_based_interpret_query(q3)
    assert f3.taluka == "Panvel"
    assert f3.district == "Raigad"  # Panvel belongs to Raigad
    assert f3.survey_number == "125/2"

    # 4. Marathi: मला पालघरमध्ये ५ एकर शेतीची जमीन दाखवा.
    q4 = "मला पालघरमध्ये ५ एकर शेतीची जमीन दाखवा."
    f4 = _rule_based_interpret_query(q4)
    assert f4.district == "Palghar"
    assert f4.min_area_acres == 5.0

def test_area_strict_inequality_parsing():
    """Verify strict inequality:
    'above 2 acres' -> min_area_strict = True (area > 2.0)
    'at least 2 acres' -> min_area_strict = False (area >= 2.0)
    """
    f_above = _rule_based_interpret_query("Show land above 2 acres")
    assert f_above.min_area_acres == 2.0
    assert f_above.min_area_strict is True

    f_at_least = _rule_based_interpret_query("Show land at least 2 acres")
    assert f_at_least.min_area_acres == 2.0
    assert f_at_least.min_area_strict is False

def test_pydantic_schema_validation():
    """Verify that InterpretedFilters pydantic schema validates all fields."""
    filters = InterpretedFilters(
        district="Raigad",
        taluka="Panvel",
        village="Karnala",
        survey_number="125/2",
        min_area_acres=5.0,
        max_area_acres=10.0,
        min_total_price=1000000.0,
        max_total_price=5000000.0,
        min_price_per_guntha=25000.0,
        max_price_per_guntha=50000.0,
        max_road_distance_meters=150.0,
        min_area_strict=False,
    )
    assert filters.district == "Raigad"
    assert filters.taluka == "Panvel"
    assert filters.survey_number == "125/2"
    assert filters.max_road_distance_meters == 150.0
