import os
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models import District, Taluka, Village, PropertyListing, DataSource

def get_or_create(session: Session, model, **kwargs):
    instance = session.query(model).filter_by(**kwargs).first()
    if not instance:
        instance = model(**kwargs)
        session.add(instance)
        session.flush()
    return instance

def seed_demo_data():
    session = SessionLocal()
    # Ensure villages table has district_id column (fallback if migration missing)
    from sqlalchemy import text
    try:
        session.execute(text('ALTER TABLE villages ADD COLUMN IF NOT EXISTS district_id INTEGER REFERENCES districts(id)'))
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Warning: could not alter villages table: {e}")
    # Geometry column addition skipped as PostGIS is not enabled in this demo environment
    # Ensure talukas table has created_at column (fallback if migration missing)
    from sqlalchemy import text
    try:
        session.execute(text('ALTER TABLE talukas ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now()'))
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Warning: could not alter talukas table: {e}")
    try:
        # Districts
        raigad = get_or_create(session, District, name="Raigad")
        palghar = get_or_create(session, District, name="Palghar")
        # Talukas & Villages
        t_alibag = get_or_create(session, Taluka, name="Alibag", district_id=raigad.id)
        t_pen = get_or_create(session, Taluka, name="Pen", district_id=raigad.id)
        t_mhasala = get_or_create(session, Taluka, name="Mhasala", district_id=raigad.id)

        t_talasari = get_or_create(session, Taluka, name="Talasari", district_id=palghar.id)
        t_vikramgad = get_or_create(session, Taluka, name="Vikramgad", district_id=palghar.id)
        t_dahanu = get_or_create(session, Taluka, name="Dahanu", district_id=palghar.id)

        v_uppal = get_or_create(session, Village, name="Uppal", taluka_id=t_alibag.id)
        v_kashipur = get_or_create(session, Village, name="Kashipur", taluka_id=t_pen.id)
        v_kadam = get_or_create(session, Village, name="Kadam", taluka_id=t_mhasala.id)

        v_dhumal = get_or_create(session, Village, name="Dhumal", taluka_id=t_talasari.id)
        v_nandur = get_or_create(session, Village, name="Nandur", taluka_id=t_vikramgad.id)
        v_murdadi = get_or_create(session, Village, name="Murdadi", taluka_id=t_dahanu.id)

        # Ensure dummy data source exists
        ds = get_or_create(session, DataSource, name="Demo Source")

        # 6 Fictional Demo Properties
        # Formula: 1 acre = 40 gunthas, total_price = area_acres * 40 * price_per_guntha
        demo_properties_data = [
            {
                "id": 1,
                "title": "R-001 (Alibag Farm)",
                "survey_number": "R-001",
                "district": raigad,
                "taluka": t_alibag,
                "village": v_uppal,
                "area_acres": 2.5,
                "price_per_guntha": 50000.0,
                "lat": 18.60,
                "lng": 73.15,
            },
            {
                "id": 2,
                "title": "R-002 (Pen Farm)",
                "survey_number": "R-002",
                "district": raigad,
                "taluka": t_pen,
                "village": v_kashipur,
                "area_acres": 1.8,
                "price_per_guntha": 52000.0,
                "lat": 18.78,
                "lng": 73.25,
            },
            {
                "id": 3,
                "title": "P-001 (Talasari Farm)",
                "survey_number": "P-001",
                "district": palghar,
                "taluka": t_talasari,
                "village": v_dhumal,
                "area_acres": 3.0,
                "price_per_guntha": 48000.0,
                "lat": 19.25,
                "lng": 73.05,
            },
            {
                "id": 4,
                "title": "P-002 (Vikramgad Farm)",
                "survey_number": "P-002",
                "district": palghar,
                "taluka": t_vikramgad,
                "village": v_nandur,
                "area_acres": 2.2,
                "price_per_guntha": 47000.0,
                "lat": 19.35,
                "lng": 73.12,
            },
            {
                "id": 5,
                "title": "R-003 (Mhasala Farm)",
                "survey_number": "R-003",
                "district": raigad,
                "taluka": t_mhasala,
                "village": v_kadam,
                "area_acres": 1.2,
                "price_per_guntha": 51000.0,
                "lat": 18.55,
                "lng": 73.33,
            },
            {
                "id": 6,
                "title": "P-003 (Dahanu Farm)",
                "survey_number": "P-003",
                "district": palghar,
                "taluka": t_dahanu,
                "village": v_murdadi,
                "area_acres": 2.7,
                "price_per_guntha": 46000.0,
                "lat": 19.40,
                "lng": 72.90,
            },
        ]

        for pdata in demo_properties_data:
            area_gunthas = pdata["area_acres"] * 40
            total_price = area_gunthas * pdata["price_per_guntha"]
            location_str = f"{pdata['lat']},{pdata['lng']}"
            prop = session.query(PropertyListing).filter_by(id=pdata["id"]).first()
            if not prop:
                prop = PropertyListing(id=pdata["id"])
                session.add(prop)
            prop.title = pdata["title"]
            prop.description = "Fictional demo property – NOT REAL"
            prop.survey_number = pdata["survey_number"]
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
        print("Demo data seeded successfully with exact financial consistency.")
    except Exception as e:
        session.rollback()
        print(f"Error seeding demo data: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    seed_demo_data()
