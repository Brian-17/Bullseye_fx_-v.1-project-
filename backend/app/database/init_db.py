from app.database.database import engine
from app.database.base import Base

# import models so they are registered with Base.metadata
from app.models.trade import Trade  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.vip import VIP  # noqa: F401


def init_db():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
