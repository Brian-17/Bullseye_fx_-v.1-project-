from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.trade import TradeCreate, TradeResponse
from app.services.trade_crud import create_trade, get_trades

router = APIRouter(
    prefix="/trades",
    tags=["Trades"]
)


@router.post("/", response_model=TradeResponse)
def add_trade(trade: TradeCreate, db: Session = Depends(get_db)):
    return create_trade(db, trade)


@router.get("/", response_model=list[TradeResponse])
def all_trades(db: Session = Depends(get_db)):
    return get_trades(db)
