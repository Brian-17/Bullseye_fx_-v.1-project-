from fastapi import APIRouter
from app.schemas.trade import TradeCreate

router = APIRouter(
    prefix="/trades",
    tags=["Trades"]
)

@router.get("/")
def get_trades():
    return {
        "trades": []
    }

@router.post("/")
def create_trade(trade: TradeCreate):
    return {
        "message": "Trade saved successfully",
        "trade": trade
    }
