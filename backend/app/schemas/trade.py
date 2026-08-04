from datetime import datetime
from pydantic import BaseModel


class TradeCreate(BaseModel):
    pair: str
    direction: str

    entry: float
    stop_loss: float
    take_profit: float

    exit_price: float | None = None
    profit_loss: float | None = None

    lot_size: float | None = None
    risk_percent: float | None = None

    strategy: str | None = None
    session: str | None = None
    emotion: str | None = None

    notes: str | None = None

    result: str | None = None


class TradeResponse(TradeCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
