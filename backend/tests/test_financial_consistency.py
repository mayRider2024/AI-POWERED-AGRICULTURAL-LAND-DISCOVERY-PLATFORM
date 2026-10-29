import pytest
from app.models.property_listing import GUNTHAS_PER_ACRE, PropertyListing
from app.services.ai_search import _rule_based_interpret_query

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
    Never multiply small numbers by 10.
    """
    f1 = _rule_based_interpret_query("Show farms under ₹30 lakh in Raigad")
    assert f1.district == "Raigad"
    assert f1.max_total_price == 3000000.0  # 30 * 100,000

    f2 = _rule_based_interpret_query("Show land below 1.5 lakhs")
    assert f2.max_total_price == 150000.0  # 1.5 * 100,000

    f3 = _rule_based_interpret_query("Farms under ₹50 lac in Palghar")
    assert f3.district == "Palghar"
    assert f3.max_total_price == 5000000.0  # 50 * 100,000

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
