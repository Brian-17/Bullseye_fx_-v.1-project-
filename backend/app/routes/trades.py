from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.trade import TradeCreate, TradeResponse
from app.services.trade_crud import (
    create_trade,
    get_trades,
    update_trade,
    delete_trade,
)
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/trades",
    tags=["Trades"],
)


@router.post("/", response_model=TradeResponse)
def add_trade(
    trade: TradeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_trade(db, trade, current_user.id)


@router.get("/", response_model=list[TradeResponse])
def all_trades(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_trades(db, current_user.id)


@router.put("/{trade_id}", response_model=TradeResponse)
def edit_trade(
    trade_id: int,
    trade: TradeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated_trade = update_trade(
        db,
        trade_id,
        trade,
        current_user.id,
    )

    if updated_trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")

    return updated_trade


@router.delete("/{trade_id}")
def remove_trade(
    trade_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted_trade = delete_trade(
        db,
        trade_id,
        current_user.id,
    )

    if deleted_trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")

    return deleted_trade
