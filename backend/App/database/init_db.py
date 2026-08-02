from app.database.database import engine
from app.database.base import Base

from app.models.trade import Trade

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
