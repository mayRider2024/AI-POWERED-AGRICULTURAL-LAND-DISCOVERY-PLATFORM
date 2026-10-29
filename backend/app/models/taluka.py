from ..db.base import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship


class Taluka(Base):
    __tablename__ = "talukas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    district = relationship("District", back_populates="talukas")
    villages = relationship("Village", back_populates="taluka", cascade="all, delete-orphan")
    properties = relationship("PropertyListing", back_populates="taluka", cascade="all, delete-orphan")
