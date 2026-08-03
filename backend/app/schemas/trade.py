from pydantic import BaseModel


class TradeCreate(BaseModel):
    pair: str
    direction: str
    entry: float
    stop_loss: float
    take_profit: float
    result: str | None = None


class TradeResponse(TradeCreate):
    id: int

    class Config:
        from_attributes = True
