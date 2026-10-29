from ..db.base import Base
from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry

class District(Base):
    __tablename__ = "districts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)



    # Relationships
    talukas = relationship("Taluka", back_populates="district", cascade="all, delete-orphan")
    properties = relationship("PropertyListing", back_populates="district", cascade="all, delete-orphan")
