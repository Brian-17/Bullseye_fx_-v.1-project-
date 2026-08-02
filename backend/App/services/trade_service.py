from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.trade import TradeCreate, TradeResponse
from app.services.trade_crud import (
    update_trade,
    delete_trade,
)

router = APIRouter(
    prefix="/trade",
    tags=["Trade Actions"]
)


@router.put("/{trade_id}", response_model=TradeResponse)
def edit_trade(
    trade_id: int,
    trade: TradeCreate,
    db: Session = Depends(get_db)
):
    updated = update_trade(db, trade_id, trade)

    if updated is None:
        raise HTTPException(status_code=404, detail="Trade not found")

    return updated


@router.delete("/{trade_id}")
def remove_trade(
    trade_id: int,
    db: Session = Depends(get_db)
):
    deleted = delete_trade(db, trade_id)

    if deleted is None:
        raise HTTPException(status_code=404, detail="Trade not found")

    return deleted
