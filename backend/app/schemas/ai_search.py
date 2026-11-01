from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Dict, Any, Literal

class ChatHistoryMessage(BaseModel):
    role: Literal["user", "assistant"] = Field(..., description="Message role")
    content: str = Field(..., max_length=2000, description="Message text content")

    model_config = ConfigDict(from_attributes=True)

class AISearchRequest(BaseModel):
    """User‑provided natural language query with optional previous conversation context."""
    query: str = Field(..., min_length=1, max_length=500, description="Natural language land search query")
    conversation_id: Optional[str] = Field(None, description="Optional UUID of active conversation")
    history: Optional[List[ChatHistoryMessage]] = Field(default_factory=list, description="Prior conversation messages for context")

    model_config = ConfigDict(from_attributes=True)

class InterpretedFilters(BaseModel):
    district: Optional[str] = None
    taluka: Optional[str] = None
    village: Optional[str] = None
    survey_number: Optional[str] = None
    land_type: Optional[str] = None
    exact_area_acres: Optional[float] = Field(None, description="Exact acreage when specified without bounding keywords (e.g. '10 acres', '10-acre', '10 acre', 'exactly 10 acres')")
    min_area_acres: Optional[float] = Field(None, description="Minimum acreage ONLY when explicit minimum keywords are used (e.g. 'at least', 'minimum', '10 acres or more', 'no less than')")
    max_area_acres: Optional[float] = Field(None, description="Maximum acreage when explicit maximum keywords are used (e.g. 'under', 'maximum', 'at most', 'less than', 'up to')")
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
    unmet_constraints: List[str] = []
    unsupported: List[str] = []
    demo_notice: str = "Demo data – unverified. Fictional parcels are never represented as official government records."

    model_config = ConfigDict(from_attributes=True)
