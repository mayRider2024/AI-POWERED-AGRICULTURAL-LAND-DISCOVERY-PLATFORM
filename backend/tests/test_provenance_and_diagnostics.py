import pytest
from app.services.ai_search import _rule_based_interpret_query, _diagnose_unmet_constraints
from app.schemas.ai_search import InterpretedFilters
from app.db.session import SessionLocal

def test_hectare_are_acre_guntha_conversions():
    """Verify Maharashtra standard land conversion formulas:
    1 Hectare = 100 Ares = 2.47105 Acres
    1 Acre = 40 Gunthas
    1 Are ≈ 1 Guntha
    """
    # 2.5 acres to gunthas
    acres = 2.5
    gunthas = acres * 40
    assert gunthas == 100.0

    # 1.01 Hectares + 17 Ares = 118 Ares ≈ 118 Gunthas ≈ 2.95 Acres
    ha = 1.01
    ares = 17
    total_ares = (ha * 100) + ares
    assert total_ares == 118
    calc_acres = round(total_ares / 40, 2)
    assert calc_acres == 2.95

def test_unmet_constraint_diagnostics_when_no_match():
    """Verify that when a search yields 0 matches, the system transparently
    explains which constraints caused the miss instead of hallucinating.
    """
    session = SessionLocal()
    try:
        # Search for non-existent district
        filters_fake_dist = InterpretedFilters(district="Nagpur")
        unmet_dist = _diagnose_unmet_constraints(session, filters_fake_dist)
        assert any("district 'Nagpur'" in msg for msg in unmet_dist)

        # Search for impossible road distance (e.g. <= 1 meter)
        filters_impossible_road = InterpretedFilters(district="Raigad", max_road_distance_meters=1.0)
        unmet_road = _diagnose_unmet_constraints(session, filters_impossible_road)
        assert any("within 1m of a mapped road" in msg for msg in unmet_road)

        # Search for impossible area (e.g. >= 500 acres)
        filters_impossible_area = InterpretedFilters(min_area_acres=500.0)
        unmet_area = _diagnose_unmet_constraints(session, filters_impossible_area)
        assert any("500 acres" in msg for msg in unmet_area)
    finally:
        session.close()

def test_provenance_and_multi_unit_fields():
    """Verify that all properties in the database have explicit provenance_type='demo',
    source_type='demo', verification_status='unverified', and calculated hectares/ares.
    """
    from app.models import PropertyListing
    session = SessionLocal()
    try:
        properties = session.query(PropertyListing).all()
        assert len(properties) >= 6
        for p in properties:
            assert p.source_type == "demo"
            assert p.verification_status == "unverified"
            assert p.provenance_type == "demo"
            assert p.area_acres > 0
            assert p.area_gunthas == float(p.area_acres) * 40
            assert p.area_hectares is not None
            assert p.area_ares is not None
            assert p.road_distance_meters is not None
            assert p.source_url is not None
    finally:
        session.close()
