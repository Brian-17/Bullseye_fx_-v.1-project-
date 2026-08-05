from pydantic import BaseModel, ConfigDict


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

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "pair": "EURUSD",
                "direction": "BUY",
                "entry": 1.0850,
                "stop_loss": 1.0800,
                "take_profit": 1.0950,
                "exit_price": 1.0930,
                "profit_loss": 80.5,
                "lot_size": 0.5,
                "risk_percent": 2.0,
                "strategy": "ICT",
                "session": "London",
                "emotion": "Confident",
                "notes": "Entered after liquidity sweep.",
                "result": "WIN"
            }
        }
    )


class TradeResponse(TradeCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)
