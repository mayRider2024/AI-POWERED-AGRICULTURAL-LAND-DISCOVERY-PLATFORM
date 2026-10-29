'''add state column to districts'''

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_state_to_districts'
down_revision = 'd4ccfad952c4'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('districts', sa.Column('state', sa.String(), nullable=True))

def downgrade():
    op.drop_column('districts', 'state')
