from sqlalchemy import Column, Integer, String, Float

from app.database.base import Base

class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True, index=True)

    pair = Column(String(20), nullable=False)

    direction = Column(String(10), nullable=False)

    entry = Column(Float, nullable=False)

    stop_loss = Column(Float, nullable=False)

    take_profit = Column(Float, nullable=False)

    result = Column(String(20), default="Pending")
