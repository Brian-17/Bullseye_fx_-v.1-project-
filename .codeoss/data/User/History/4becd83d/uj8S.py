from sqlalchemy.orm import Session

from app.models.trade import Trade
from app.schemas.trade import TradeCreate


def create_trade(db: Session, trade: TradeCreate, user_id: int):
    db_trade = Trade(
<<<<<<< HEAD
        pair=trade.pair,
        direction=trade.direction,
        entry=trade.entry,
        stop_loss=trade.stop_loss,
        take_profit=trade.take_profit,
        exit_price=trade.exit_price,
        profit_loss=trade.profit_loss,
        lot_size=trade.lot_size,
        risk_percent=trade.risk_percent,
        strategy=trade.strategy,
        session=trade.session,
        emotion=trade.emotion,
        notes=trade.notes,
        result=trade.result,
=======
        **trade.model_dump(),
>>>>>>> 7b1b1a8addf2d588b66c7af1863bae80647d2a48
        user_id=user_id,
    )

    db.add(db_trade)
    db.commit()
    db.refresh(db_trade)

    return db_trade


<<<<<<< HEAD
def get_trades(db: Session, user_id: int):
    return db.query(Trade).filter(Trade.user_id == user_id).all()
=======
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
>>>>>>> 7b1b1a8addf2d588b66c7af1863bae80647d2a48


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
<<<<<<< HEAD
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
    trade.exit_price = trade_data.exit_price
    trade.profit_loss = trade_data.profit_loss
    trade.lot_size = trade_data.lot_size
    trade.risk_percent = trade_data.risk_percent
    trade.strategy = trade_data.strategy
    trade.session = trade_data.session
    trade.emotion = trade_data.emotion
    trade.notes = trade_data.notes
    trade.result = trade_data.result

    db.commit()
    db.refresh(trade)

    return trade
=======
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
>>>>>>> 7b1b1a8addf2d588b66c7af1863bae80647d2a48


def delete_trade(
    db: Session,
    trade_id: int,
    user_id: int,
):
<<<<<<< HEAD
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
=======
    db_trade = get_trade(db, trade_id,