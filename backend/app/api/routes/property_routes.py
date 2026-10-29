from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ...db.session import SessionLocal
from ... import models
from ...schemas.property import PropertyResponse, PropertyListResponse

router = APIRouter(prefix="/properties", tags=["Properties"])

# Dependency to get DB session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=PropertyListResponse)
def list_properties(
    district: str | None = Query(None),
    taluka: str | None = Query(None),
    village: str | None = Query(None),
    min_area_acres: float | None = Query(None, ge=0),
    max_area_acres: float | None = Query(None, ge=0),
    min_price_per_guntha: float | None = Query(None, ge=0),
    max_price_per_guntha: float | None = Query(None, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(models.PropertyListing)
    if district:
        query = query.join(models.District).filter(models.District.name == district)
    if taluka:
        query = query.join(models.Taluka).filter(models.Taluka.name == taluka)
    if village:
        query = query.join(models.Village).filter(models.Village.name == village)
    if min_area_acres is not None:
        query = query.filter(models.PropertyListing.area_acres >= min_area_acres)
    if max_area_acres is not None:
        query = query.filter(models.PropertyListing.area_acres <= max_area_acres)
    if min_price_per_guntha is not None:
        query = query.filter(models.PropertyListing.price_per_guntha >= min_price_per_guntha)
    if max_price_per_guntha is not None:
        query = query.filter(models.PropertyListing.price_per_guntha <= max_price_per_guntha)
    items = query.all()
    return {"properties": [PropertyResponse.model_validate(p) for p in items]}

@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(property_id: int, db: Session = Depends(get_db)):
    prop = db.query(models.PropertyListing).filter(models.PropertyListing.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return PropertyResponse.model_validate(prop)

@router.get("/nearby", response_model=PropertyListResponse)
def nearby_properties(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    radius_meters: float = Query(5000, gt=0),
    db: Session = Depends(get_db),
):
    point_wkt = f"POINT({longitude} {latitude})"
    query = db.query(models.PropertyListing)
    items = query.all()
    return {"properties": [PropertyResponse.model_validate(p) for p in items]}

