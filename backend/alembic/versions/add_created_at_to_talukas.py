"""Add created_at column to talukas

Revision ID: add_created_at_to_talukas
Revises: add_created_at_to_districts
Create Date: 2026-10-30 01:05:00.000000
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_created_at_to_talukas'
down_revision = 'add_created_at_to_districts'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('talukas', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()'), nullable=False))

def downgrade():
    op.drop_column('talukas', 'created_at')
