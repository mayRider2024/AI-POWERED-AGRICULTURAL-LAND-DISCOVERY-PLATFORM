import sys
import json
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models import District, Taluka, Village, PropertyListing, DataSource
from app.models.property_listing import GUNTHAS_PER_ACRE

def get_or_create(session: Session, model, **kwargs):
    instance = session.query(model).filter_by(**kwargs).first()
    if not instance:
        instance = model(**kwargs)
        session.add(instance)
        session.flush()
    return instance

def seed_200_properties():
    # Load frontend properties generated
    with open("../generate_200_properties.py") as f:
        # Import directly
        import sys
        sys.path.append("..")
        from generate_200_properties import generate_properties

    data = generate_properties()
    session = SessionLocal()

    try:
        ds = get_or_create(session, DataSource, name="LandLens 200 Demo Dataset")
        raigad = get_or_create(session, District, name="Raigad")
        palghar = get_or_create(session, District, name="Palghar")

        inserted = 0
        updated = 0

        for p in data:
            dist = raigad if p["district"] == "Raigad" else palghar
            taluka = get_or_create(session, Taluka, name=p["taluka"], district_id=dist.id)
            village = get_or_create(session, Village, name=p["village"], taluka_id=taluka.id)

            survey = p["surveyNumber"]
            prop = session.query(PropertyListing).filter_by(survey_number=survey).first()
            if not prop:
                prop = PropertyListing(survey_number=survey)
                session.add(prop)
                inserted += 1
            else:
                updated += 1

            area_acres = float(p["areaAcres"])
            price_per_guntha = float(p["pricePerGuntha"])
            area_gunthas = area_acres * GUNTHAS_PER_ACRE
            total_price = area_gunthas * price_per_guntha
            area_hectares = round(area_acres * 0.404686, 4)
            area_ares = round(area_hectares * 100, 2)
            lng, lat = p["coordinates"]

            prop.title = f"{survey} ({p['taluka']} Farm)"
            prop.description = f"Synthetic demonstration parcel in {p['village']}, {p['taluka']} – NOT REAL"
            prop.location = f"{lat},{lng}"
            prop.area_acres = area_acres
            prop.area_gunthas = area_gunthas
            prop.area_hectares = area_hectares
            prop.area_ares = area_ares
            prop.source_area_unit = "acres"
            prop.price_per_guntha = price_per_guntha
            prop.total_price = total_price
            prop.land_type = "agricultural"
            prop.road_distance_meters = float(p.get("roadDistanceMeters", 100))
            prop.road_type = p.get("roadType", "Tar Road")
            prop.geometry_type = "point"
            prop.provenance_type = "demo"
            prop.source_type = "demo"
            prop.verification_status = "unverified"
            prop.verification_notes = "Fictional demonstration parcel. Never represented as an authentic Maharashtra government cadastral record."
            prop.source_url = "https://bhulekh.mahabhumi.gov.in/"
            prop.district_id = dist.id
            prop.taluka_id = taluka.id
            prop.village_id = village.id
            prop.data_source_id = ds.id

        session.commit()
        print(f"Database seeding complete: {inserted} inserted, {updated} updated (Total {len(data)} properties).")
    except Exception as e:
        session.rollback()
        print(f"Error seeding: {e}", file=sys.stderr)
        raise
    finally:
        session.close()

if __name__ == "__main__":
    seed_200_properties()

