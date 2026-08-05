from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.trade import (
    TradeCreate,
    TradeResponse,
)
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
    return create_trade(
        db=db,
        trade=trade,
        user_id=current_user.id,
    )


@router.get("/", response_model=list[TradeResponse])
def all_trades(
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


@router.put("/{trade_id}", response_model=TradeResponse)
def edit_trade(
    trade_id: int,
    trade: TradeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated_trade = update_trade(
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

    return updated_trade


@router.delete("/{trade_id}")
def remove_trade(
    trade_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted_trade = delete_trade(
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
