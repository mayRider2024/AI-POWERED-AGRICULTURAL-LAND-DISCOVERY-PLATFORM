from ..db.base import Base
from sqlalchemy import Column, Integer, String, Text, DateTime, func
from sqlalchemy.orm import relationship

class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False, unique=True)

    # Relationship – a source can feed many property listings
    properties = relationship("PropertyListing", back_populates="data_source")
