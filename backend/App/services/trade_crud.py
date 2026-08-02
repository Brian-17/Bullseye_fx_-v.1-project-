from sqlalchemy.orm import Session

from app.models.trade import Trade
from app.schemas.trade import TradeCreate


def create_trade(db: Session, trade: TradeCreate):
    new_trade = Trade(
        pair=trade.pair,
        direction=trade.direction,
        entry=trade.entry,
        stop_loss=trade.stop_loss,
        take_profit=trade.take_profit,
        result=trade.result
    )

    db.add(new_trade)
    db.commit()
    db.refresh(new_trade)

    return new_trade


def get_all_trades(db: Session):
    return db.query(Trade).all()


def update_trade(db: Session, trade_id: int, trade_data: TradeCreate):
    trade = db.query(Trade).filter(Trade.id == trade_id).first()

    if not trade:
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


def delete_trade(db: Session, trade_id: int):
    trade = db.query(Trade).filter(Trade.id == trade_id).first()

    if not trade:
        return None

    db.delete(trade)
    db.commit()

    return {"message": "Trade deleted successfully"}
