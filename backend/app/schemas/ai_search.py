from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Dict, Any

class AISearchRequest(BaseModel):
    """User‑provided natural language query."""
    query: str = Field(..., min_length=1, max_length=500, description="Natural language land search query")

    model_config = ConfigDict(from_attributes=True)

class InterpretedFilters(BaseModel):
    district: Optional[str] = None
    taluka: Optional[str] = None
    village: Optional[str] = None
    survey_number: Optional[str] = None
    land_type: Optional[str] = None
    min_area_acres: Optional[float] = None
    max_area_acres: Optional[float] = None
    min_area_strict: Optional[bool] = False
    max_area_strict: Optional[bool] = False
    min_price_per_guntha: Optional[float] = None
    max_price_per_guntha: Optional[float] = None
    min_total_price: Optional[float] = None
    max_total_price: Optional[float] = None
    max_road_distance_meters: Optional[float] = None
    road_proximity_required: Optional[bool] = False

    model_config = ConfigDict(from_attributes=True)

class AISearchResponse(BaseModel):
    original_query: str
    interpreted_filters: InterpretedFilters
    matching_count: int
    properties: List[Dict[str, Any]]
    explanation: str
    unsupported: List[str] = []
    demo_notice: str = "Demo data – unverified"

    model_config = ConfigDict(from_attributes=True)
