from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.trade import TradeCreate, TradeResponse
from app.services.trade_crud import (
    create_trade,
    get_trades,
    update_trade,
    delete_trade,
)

router = APIRouter(
    prefix="/trades",
    tags=["Trades"],
)


@router.post("/", response_model=TradeResponse)
def add_trade(trade: TradeCreate, db: Session = Depends(get_db)):
    return create_trade(db, trade)


@router.get("/", response_model=list[TradeResponse])
def all_trades(db: Session = Depends(get_db)):
    return get_trades(db)


@router.put("/{trade_id}", response_model=TradeResponse)
def edit_trade(
    trade_id: int,
    trade: TradeCreate,
    db: Session = Depends(get_db),
):
    updated_trade = update_trade(db, trade_id, trade)

    if updated_trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")

    return updated_trade


@router.delete("/{trade_id}")
def remove_trade(
    trade_id: int,
    db: Session = Depends(get_db),
):
    deleted_trade = delete_trade(db, trade_id)

    if deleted_trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")

    return deleted_trade
