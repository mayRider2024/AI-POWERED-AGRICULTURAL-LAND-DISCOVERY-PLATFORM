"""add_provenance_and_multi_unit_area_to_property_listings

Revision ID: 41e18565ae3f
Revises: add_created_at_to_talukas
Create Date: 2026-10-30 01:22:25.944426

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '41e18565ae3f'
down_revision: Union[str, Sequence[str], None] = 'add_created_at_to_talukas'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema: add provenance, source URL, verified date, multi-unit area, and road distance."""
    # Provenance fields
    op.add_column("property_listings", sa.Column("provenance_type", sa.String, nullable=False, server_default="demo"))
    op.add_column("property_listings", sa.Column("source_url", sa.String, nullable=True))
    op.add_column("property_listings", sa.Column("verified_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("property_listings", sa.Column("verification_notes", sa.Text, nullable=True))

    # Multi-unit area columns
    op.add_column("property_listings", sa.Column("area_hectares", sa.Numeric(12, 4), nullable=True))
    op.add_column("property_listings", sa.Column("area_ares", sa.Numeric(12, 2), nullable=True))
    op.add_column("property_listings", sa.Column("source_area_unit", sa.String, nullable=False, server_default="acres"))

    # Road proximity and geometry classification
    op.add_column("property_listings", sa.Column("road_distance_meters", sa.Numeric(10, 2), nullable=True))
    op.add_column("property_listings", sa.Column("road_type", sa.String, nullable=True))
    op.add_column("property_listings", sa.Column("geometry_type", sa.String, nullable=False, server_default="point"))
    op.add_column("property_listings", sa.Column("geometry_geojson", sa.Text, nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("property_listings", "geometry_geojson")
    op.drop_column("property_listings", "geometry_type")
    op.drop_column("property_listings", "road_type")
    op.drop_column("property_listings", "road_distance_meters")
    op.drop_column("property_listings", "source_area_unit")
    op.drop_column("property_listings", "area_ares")
    op.drop_column("property_listings", "area_hectares")
    op.drop_column("property_listings", "verification_notes")
    op.drop_column("property_listings", "verified_at")
    op.drop_column("property_listings", "source_url")
    op.drop_column("property_listings", "provenance_type")
