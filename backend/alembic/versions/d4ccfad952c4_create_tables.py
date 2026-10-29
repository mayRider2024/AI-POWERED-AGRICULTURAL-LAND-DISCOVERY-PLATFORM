"""create tables

Revision ID: d4ccfad952c4
Revises: e3f9fdbfe976
Create Date: 2026-10-28 08:55:34.346705

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geometry


# revision identifiers, used by Alembic.
revision: str = 'd4ccfad952c4'
down_revision: Union[str, Sequence[str], None] = 'e3f9fdbfe976'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Districts
    op.create_table(
        "districts",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String, nullable=False, unique=True),
    )
    # Talukas
    op.create_table(
        "talukas",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("district_id", sa.Integer, sa.ForeignKey("districts.id"), nullable=False),
    )
    # Villages
    op.create_table(
        "villages",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("taluka_id", sa.Integer, sa.ForeignKey("talukas.id"), nullable=False),
    )
    # Data sources
    op.create_table(
        "data_sources",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String, nullable=False),
    )
    # Property listings
    op.create_table(
        "property_listings",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("title", sa.String, nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("survey_number", sa.String, nullable=True),
        sa.Column("location", sa.String, nullable=False),
        sa.Column("area_acres", sa.Numeric(12, 2), nullable=False),
        sa.Column("area_gunthas", sa.Numeric(12, 2), nullable=False),
        sa.Column("price_per_guntha", sa.Numeric(15, 2), nullable=False),
        sa.Column("total_price", sa.Numeric(18, 2), nullable=False),
        sa.Column("land_type", sa.String, nullable=True),
        sa.Column("district_id", sa.Integer, sa.ForeignKey("districts.id"), nullable=False),
        sa.Column("taluka_id", sa.Integer, sa.ForeignKey("talukas.id"), nullable=False),
        sa.Column("village_id", sa.Integer, sa.ForeignKey("villages.id"), nullable=False),
        sa.Column("data_source_id", sa.Integer, sa.ForeignKey("data_sources.id"), nullable=False),
        sa.Column("source_type", sa.String, nullable=False, server_default="demo"),
        sa.Column("verification_status", sa.String, nullable=False, server_default="unverified"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    """Downgrade schema."""
    pass
