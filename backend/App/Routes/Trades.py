from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.trade import TradeCreate, TradeResponse
from app.services.trade_crud import create_trade, get_all_trades

router = APIRouter(
    prefix="/trades",
    tags=["Trades"]
)

@router.post("/", response_model=TradeResponse)
def add_trade(
    trade: TradeCreate,
    db: Session = Depends(get_db)
):
    return create_trade(db, trade)


@router.get("/", response_model=List[TradeResponse])
def list_trades(
    db: Session = Depends(get_db)
):
    return get_all_trades(db)
