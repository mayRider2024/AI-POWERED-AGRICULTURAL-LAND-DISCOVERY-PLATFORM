from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class PropertyBase(BaseModel):
    title: str
    description: Optional[str] = None
    survey_number: Optional[str] = None
    latitude: float
    longitude: float
    area_acres: float
    area_gunthas: Optional[float] = None
    area_hectares: Optional[float] = None
    area_ares: Optional[float] = None
    source_area_unit: Optional[str] = "acres"
    price_per_guntha: float
    total_price: Optional[float] = None
    land_type: Optional[str] = None
    road_distance_meters: Optional[float] = None
    road_type: Optional[str] = None
    geometry_type: Optional[str] = "point"
    provenance_type: str = "demo"
    source_url: Optional[str] = None
    verified_at: Optional[datetime] = None
    verification_notes: Optional[str] = None
    verification_status: str = "unverified"
    source_type: str = "demo"

    model_config = ConfigDict(from_attributes=True)

class PropertyResponse(PropertyBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class PropertyListResponse(BaseModel):
    properties: List[PropertyResponse]

    model_config = ConfigDict(from_attributes=True)
