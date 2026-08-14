from app.database.database import Base, engine
from app.models.trade import Trade


def init_db():
    Base.metadata.create_all(bind=engine)
