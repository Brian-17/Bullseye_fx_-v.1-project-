from App.database.database import engine
from App.database.base import Base

from App.models.trade import Trade


def init_db():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
