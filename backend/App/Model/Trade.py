from sqlalchemy import Column, Integer, String, Float

from app.database.base import Base

class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True, index=True)

    pair = Column(String)

    direction = Column(String)

    entry = Column(Float)

    stop_loss = Column(Float)

    take_profit = Column(Float)

    result = Column(String)
