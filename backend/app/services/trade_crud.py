from sqlalchemy.orm import Session

from app.models.trade import Trade
from app.schemas.trade import TradeCreate


def create_trade(db: Session, trade: TradeCreate, user_id: int):
    db_trade = Trade(
        **trade.model_dump(),
        user_id=user_id,
    )

    db.add(db_trade)
    db.commit()
    db.refresh(db_trade)

    return db_trade


def get_trades(
    db: Session,
    user_id: int,
    pair: str | None = None,
    result: str | None = None,
    strategy: str | None = None,
    session: str | None = None,
):
    query = db.query(Trade).filter(Trade.user_id == user_id)

    if pair:
        query = query.filter(Trade.pair == pair)

    if result:
        query = query.filter(Trade.result == result)

    if strategy:
        query = query.filter(Trade.strategy == strategy)

    if session:
        query = query.filter(Trade.session == session)

    return query.all()


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
    trade: TradeCreate,
    user_id: int,
):
    db_trade = get_trade(db, trade_id, user_id)

    if not db_trade:
        return None

    for key, value in trade.model_dump().items():
        setattr(db_trade, key, value)

    db.commit()
    db.refresh(db_trade)

    return db_trade


def delete_trade(
    db: Session,
    trade_id: int,
    user_id: int,
):
    db_trade = get_trade(db, trade_id, user_id)

    if not db_trade:
        return None

    db.delete(db_trade)
    db.commit()

    return db_trade
