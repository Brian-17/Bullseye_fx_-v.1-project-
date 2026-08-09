"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
Create Date: ${create_date}

"""
from typing import Sequence, Union

from alembic 

def upgrade() -> None:
    ${upgrades if upgrades else "pass"}

    def downgrade() -> None:
        ${downgrades if downgrades