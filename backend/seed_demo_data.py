import sys
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import SessionLocal
from app.models import District, Taluka, Village, PropertyListing, DataSource
from app.models.property_listing import GUNTHAS_PER_ACRE

def get_or_create(session: Session, model, **kwargs):
    """Retrieve existing record or create new instance without duplicates."""
    instance = session.query(model).filter_by(**kwargs).first()
    if not instance:
        instance = model(**kwargs)
        session.add(instance)
        session.flush()
    return instance

def seed_demo_data(verbose: bool = True):
    """Idempotently seed the 6 fictional demonstration properties + Panvel reference parcel.

    Guarantees:
    - Never deletes or modifies non-demo properties or user-submitted records.
    - Idempotent: Can be run multiple times safely without duplicate rows.
    - Explicitly marks all records with source_type='demo' and verification_status='unverified'.
    - Maintains exact 40 Gunthas = 1 Acre financial consistency.
    """
    session = SessionLocal()
    try:
        # 1. Districts (Raigad, Palghar)
        raigad = get_or_create(session, District, name="Raigad")
        palghar = get_or_create(session, District, name="Palghar")

        # 2. Talukas
        t_alibag = get_or_create(session, Taluka, name="Alibag", district_id=raigad.id)
        t_pen = get_or_create(session, Taluka, name="Pen", district_id=raigad.id)
        t_mhasala = get_or_create(session, Taluka, name="Mhasala", district_id=raigad.id)
        t_panvel = get_or_create(session, Taluka, name="Panvel", district_id=raigad.id)

        t_talasari = get_or_create(session, Taluka, name="Talasari", district_id=palghar.id)
        t_vikramgad = get_or_create(session, Taluka, name="Vikramgad", district_id=palghar.id)
        t_dahanu = get_or_create(session, Taluka, name="Dahanu", district_id=palghar.id)

        # 3. Villages
        v_uppal = get_or_create(session, Village, name="Uppal", taluka_id=t_alibag.id)
        v_kashipur = get_or_create(session, Village, name="Kashipur", taluka_id=t_pen.id)
        v_kadam = get_or_create(session, Village, name="Kadam", taluka_id=t_mhasala.id)
        v_apta = get_or_create(session, Village, name="Apta", taluka_id=t_panvel.id)

        v_dhumal = get_or_create(session, Village, name="Dhumal", taluka_id=t_talasari.id)
        v_nandur = get_or_create(session, Village, name="Nandur", taluka_id=t_vikramgad.id)
        v_murdadi = get_or_create(session, Village, name="Murdadi", taluka_id=t_dahanu.id)

        # 4. Data Source
        ds = get_or_create(session, DataSource, name="LandLens Demo Dataset")

        # 5. Demonstration Properties Dataset (Reusing existing project data)
        demo_properties_data = [
            {
                "survey_number": "R-001",
                "title": "R-001 (Alibag Farm)",
                "description": "Fictional demonstration property in Alibag – NOT REAL",
                "district": raigad,
                "taluka": t_alibag,
                "village": v_uppal,
                "area_acres": 2.5,
                "price_per_guntha": 50000.0,
                "lat": 18.60,
                "lng": 73.15,
            },
            {
                "survey_number": "R-002",
                "title": "R-002 (Pen Farm)",
                "description": "Fictional demonstration property in Pen – NOT REAL",
                "district": raigad,
                "taluka": t_pen,
                "village": v_kashipur,
                "area_acres": 1.8,
                "price_per_guntha": 52000.0,
                "lat": 18.78,
                "lng": 73.25,
            },
            {
                "survey_number": "P-001",
                "title": "P-001 (Talasari Farm)",
                "description": "Fictional demonstration property in Talasari – NOT REAL",
                "district": palghar,
                "taluka": t_talasari,
                "village": v_dhumal,
                "area_acres": 3.0,
                "price_per_guntha": 48000.0,
                "lat": 19.25,
                "lng": 73.05,
            },
            {
                "survey_number": "P-002",
                "title": "P-002 (Vikramgad Farm)",
                "description": "Fictional demonstration property in Vikramgad – NOT REAL",
                "district": palghar,
                "taluka": t_vikramgad,
                "village": v_nandur,
                "area_acres": 2.2,
                "price_per_guntha": 47000.0,
                "lat": 19.35,
                "lng": 73.12,
            },
            {
                "survey_number": "R-003",
                "title": "R-003 (Mhasala Farm)",
                "description": "Fictional demonstration property in Mhasala – NOT REAL",
                "district": raigad,
                "taluka": t_mhasala,
                "village": v_kadam,
                "area_acres": 1.2,
                "price_per_guntha": 51000.0,
                "lat": 18.55,
                "lng": 73.33,
            },
            {
                "survey_number": "P-003",
                "title": "P-003 (Dahanu Farm)",
                "description": "Fictional demonstration property in Dahanu – NOT REAL",
                "district": palghar,
                "taluka": t_dahanu,
                "village": v_murdadi,
                "area_acres": 2.7,
                "price_per_guntha": 46000.0,
                "lat": 19.40,
                "lng": 72.90,
            },
            {
                "survey_number": "125/2",
                "title": "Panvel Demonstration Parcel (Gat 125/2)",
                "description": "Fictional demonstration property in Panvel – NOT REAL",
                "district": raigad,
                "taluka": t_panvel,
                "village": v_apta,
                "area_acres": 10.0,
                "price_per_guntha": 1250000.0,  # ₹12.5 lakh per guntha
                "lat": 18.99,
                "lng": 73.11,
            },
        ]

        seeded_count = 0
        updated_count = 0

        for pdata in demo_properties_data:
            area_gunthas = pdata["area_acres"] * GUNTHAS_PER_ACRE
            total_price = area_gunthas * pdata["price_per_guntha"]
            location_str = f"{pdata['lat']},{pdata['lng']}"

            # Query by unique demo survey_number to ensure idempotent insertions
            prop = session.query(PropertyListing).filter_by(survey_number=pdata["survey_number"]).first()
            if not prop:
                prop = PropertyListing(survey_number=pdata["survey_number"])
                session.add(prop)
                seeded_count += 1
            else:
                updated_count += 1

            prop.title = pdata["title"]
            prop.description = pdata["description"]
            prop.location = location_str
            prop.area_acres = pdata["area_acres"]
            prop.area_gunthas = area_gunthas
            prop.price_per_guntha = pdata["price_per_guntha"]
            prop.total_price = total_price
            prop.land_type = "agricultural"
            prop.source_type = "demo"
            prop.verification_status = "unverified"
            prop.district_id = pdata["district"].id
            prop.taluka_id = pdata["taluka"].id
            prop.village_id = pdata["village"].id
            prop.data_source_id = ds.id

        session.commit()
        if verbose:
            print(f"Successfully seeded database: {seeded_count} inserted, {updated_count} verified/updated.")
            print("All demonstration records are explicitly tagged as source_type='demo' and verification_status='unverified'.")
    except Exception as e:
        session.rollback()
        print(f"Error seeding demo data: {e}", file=sys.stderr)
        raise
    finally:
        session.close()

if __name__ == "__main__":
    seed_demo_data()
