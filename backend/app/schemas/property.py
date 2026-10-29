from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class PropertyBase(BaseModel):
    title: str
    description: Optional[str] = None
    survey_number: Optional[str] = None
    latitude: float
    longitude: float
    area_acres: float
    price_per_guntha: float
    land_type: Optional[str] = None
    verification_status: str
    source_type: str

    model_config = ConfigDict(from_attributes=True)

class PropertyResponse(PropertyBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class PropertyListResponse(BaseModel):
    properties: List[PropertyResponse]

    model_config = ConfigDict(from_attributes=True)
