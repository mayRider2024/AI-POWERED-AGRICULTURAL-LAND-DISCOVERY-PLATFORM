from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any

class AISearchRequest(BaseModel):
    """User‑provided natural language query."""
    query: str

    model_config = ConfigDict(from_attributes=True)

class InterpretedFilters(BaseModel):
    district: Optional[str] = None
    taluka: Optional[str] = None
    village: Optional[str] = None
    land_type: Optional[str] = None
    min_area_acres: Optional[float] = None
    max_area_acres: Optional[float] = None
    min_area_strict: Optional[bool] = False  # True for 'above X' (area > X), False for 'at least X' (area >= X)
    max_area_strict: Optional[bool] = False  # True for 'under X' (area < X), False for 'up to / at most X' (area <= X)
    min_price_per_guntha: Optional[float] = None
    max_price_per_guntha: Optional[float] = None
    min_total_price: Optional[float] = None
    max_total_price: Optional[float] = None

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
