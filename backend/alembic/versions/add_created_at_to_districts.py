"""Add created_at column to districts

Revision ID: add_created_at_to_districts
Revises: add_state_to_districts
Create Date: 2026-10-28 10:08:00.000000
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_created_at_to_districts'
down_revision = 'add_state_to_districts'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('districts', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()'), nullable=False))

def downgrade():
    op.drop_column('districts', 'created_at')
