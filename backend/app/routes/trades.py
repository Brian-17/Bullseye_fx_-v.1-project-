<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException
=======
from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)
>>>>>>> 7b1b1a8addf2d588b66c7af1863bae80647d2a48
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.user import User
<<<<<<< HEAD
from app.schemas.trade import TradeCreate, TradeResponse
=======
from app.schemas.trade import (
    TradeCreate,
    TradeResponse,
)
>>>>>>> 7b1b1a8addf2d588b66c7af1863bae80647d2a48
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
<<<<<<< HEAD
    return create_trade(db, trade, current_user.id)
=======
    return create_trade(
        db=db,
        trade=trade,
        user_id=current_user.id,
    )
>>>>>>> 7b1b1a8addf2d588b66c7af1863bae80647d2a48


@router.get("/", response_model=list[TradeResponse])
def all_trades(
<<<<<<< HEAD
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_trades(db, current_user.id)
=======
    pair: Optional[str] = Query(None),
    result: Optional[str] = Query(None),
    strategy: Optional[str] = Query(None),
    session: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_trades(
        db=db,
        user_id=current_user.id,
        pair=pair,
        result=result,
        strategy=strategy,
        session=session,
        search=search,
        skip=skip,
        limit=limit,
    )
>>>>>>> 7b1b1a8addf2d588b66c7af1863bae80647d2a48


@router.put("/{trade_id}", response_model=TradeResponse)
def edit_trade(
    trade_id: int,
    trade: TradeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated_trade = update_trade(
<<<<<<< HEAD
        db,
        trade_id,
        trade,
        current_user.id,
    )

    if updated_trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")
=======
        db=db,
        trade_id=trade_id,
        trade=trade,
        user_id=current_user.id,
    )

    if updated_trade is None:
        raise HTTPException(
            status_code=404,
            detail="Trade not found",
        )
>>>>>>> 7b1b1a8addf2d588b66c7af1863bae80647d2a48

    return updated_trade


@router.delete("/{trade_id}")
def remove_trade(
    trade_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted_trade = delete_trade(
<<<<<<< HEAD
        db,
        trade_id,
        current_user.id,
    )

    if deleted_trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")

    return deleted_trade
=======
        db=db,
        trade_id=trade_id,
        user_id=current_user.id,
    )

    if deleted_trade is None:
        raise HTTPException(
            status_code=404,
            detail="Trade not found",
        )

    return {
        "message": "Trade deleted successfully"
    }
>>>>>>> 7b1b1a8addf2d588b66c7af1863bae80647d2a48
