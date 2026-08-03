from sqlalchemy.orm import Session

from app.models.trade import Trade
from app.schemas.trade import TradeCreate


def create_trade(db: Session, trade: TradeCreate, user_id: int):
    db_trade = Trade(
        pair=trade.pair,
        direction=trade.direction,
        entry=trade.entry,
        stop_loss=trade.stop_loss,
        take_profit=trade.take_profit,
        result=trade.result,
        user_id=user_id,
    )

    db.add(db_trade)
    db.commit()
    db.refresh(db_trade)

    return db_trade


def get_trades(db: Session, user_id: int):
    return db.query(Trade).filter(Trade.user_id == user_id).all()


def get_trade(db: Session, trade_id: int, user_id: int):
    return (
        db.query(Trade)
        .filter(
            Trade.id == trade_id,
            Trade.user_id == user_id,
        )
        .first()
    )


def update_trade(
    db: Session,
    trade_id: int,
    trade_data: TradeCreate,
    user_id: int,
):
    trade = (
        db.query(Trade)
        .filter(
            Trade.id == trade_id,
            Trade.user_id == user_id,
        )
        .first()
    )

    if trade is None:
        return None

    trade.pair = trade_data.pair
    trade.direction = trade_data.direction
    trade.entry = trade_data.entry
    trade.stop_loss = trade_data.stop_loss
    trade.take_profit = trade_data.take_profit
    trade.result = trade_data.result

    db.commit()
    db.refresh(trade)

    return trade


def delete_trade(
    db: Session,
    trade_id: int,
    user_id: int,
):
    trade = (
        db.query(Trade)
        .filter(
            Trade.id == trade_id,
            Trade.user_id == user_id,
        )
        .first()
    )

    if trade is None:
        return None

    db.delete(trade)
    db.commit()

    return {"message": "Trade deleted successfully"}
