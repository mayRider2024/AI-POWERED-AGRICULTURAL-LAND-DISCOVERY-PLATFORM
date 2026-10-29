from ..db.base import Base
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    Numeric,
    func,
    CheckConstraint,
)
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry

# Conversion constant: 1 acre = 40 gunthas
GUNTHAS_PER_ACRE = 40

class PropertyListing(Base):
    __tablename__ = "property_listings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    survey_number = Column(String, nullable=True)

    # Geographic point for the property
    location = Column(String, nullable=False)

    # Multi-unit area fields
    area_acres = Column(Numeric(12, 2), nullable=False)
    area_gunthas = Column(Numeric(12, 2), nullable=False)
    area_hectares = Column(Numeric(12, 4), nullable=True)
    area_ares = Column(Numeric(12, 2), nullable=True)
    source_area_unit = Column(String, nullable=False, default="acres")

    # Price per guntha and total price (Decimal)
    price_per_guntha = Column(Numeric(15, 2), nullable=False)
    total_price = Column(Numeric(18, 2), nullable=False)

    land_type = Column(String, nullable=True)  # e.g., "agricultural", "forest"

    # Road proximity and parcel geometry
    road_distance_meters = Column(Numeric(10, 2), nullable=True)
    road_type = Column(String, nullable=True)
    geometry_type = Column(String, nullable=False, default="point")
    geometry_geojson = Column(Text, nullable=True)

    # Administrative foreign keys – must reference existing rows
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    taluka_id = Column(Integer, ForeignKey("talukas.id"), nullable=False)
    village_id = Column(Integer, ForeignKey("villages.id"), nullable=False)
    data_source_id = Column(Integer, ForeignKey("data_sources.id"), nullable=False)

    # Provenance and verification tracking
    provenance_type = Column(String, nullable=False, default="demo")  # demo, seller_submitted, broker_submitted, user_712_imported, government_verified
    source_url = Column(String, nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    verification_notes = Column(Text, nullable=True)
    source_type = Column(String, nullable=False, default="demo")
    verification_status = Column(String, nullable=False, default="unverified")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    district = relationship("District", back_populates="properties")
    taluka = relationship("Taluka", back_populates="properties")
    village = relationship("Village", back_populates="properties")
    data_source = relationship("DataSource", back_populates="properties")

    @property
    def latitude(self) -> float:
        if self.location and "," in str(self.location):
            try:
                return float(str(self.location).split(",")[0].strip())
            except (ValueError, TypeError):
                pass
        return 0.0

    @property
    def longitude(self) -> float:
        if self.location and "," in str(self.location):
            try:
                return float(str(self.location).split(",")[1].strip())
            except (ValueError, TypeError):
                pass
        return 0.0

    __table_args__ = (
        CheckConstraint("area_acres >= 0", name="ck_area_acres_nonnegative"),
        CheckConstraint("area_gunthas >= 0", name="ck_area_gunthas_nonnegative"),
        CheckConstraint("price_per_guntha >= 0", name="ck_price_per_guntha_nonnegative"),
        CheckConstraint("total_price >= 0", name="ck_total_price_nonnegative"),
    )

    @staticmethod
    def calculate_derived(area_acres: float, price_per_guntha: float):
        """Helper to compute guntha area and total price.
        Returns (area_gunthas, total_price).
        """
        area_gunthas = area_acres * GUNTHAS_PER_ACRE
        total_price = area_gunthas * price_per_guntha
        return area_gunthas, total_price
