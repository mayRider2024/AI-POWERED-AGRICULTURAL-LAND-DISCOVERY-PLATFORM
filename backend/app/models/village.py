from ..db.base import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry

class Village(Base):
    __tablename__ = "villages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    taluka_id = Column(Integer, ForeignKey("talukas.id"), nullable=False)
    # No district_id, geometry, or created_at columns in current DB schema

    # Relationships
    taluka = relationship("Taluka", back_populates="villages")
    properties = relationship("PropertyListing", back_populates="village")
