from pydantic import BaseModel
from typing import Optional


class TradeCreate(BaseModel):
    pair: str
    direction: str
    entry: float
    stop_loss: float
    take_profit: float
    result: Optional[str] = "Pending"


class TradeResponse(TradeCreate):
    id: int

    class Config:
        orm_mode = True
