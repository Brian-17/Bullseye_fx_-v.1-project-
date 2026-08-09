from collections import Counter
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.trade import Trade


def get_dashboard_stats(db: Session, user_id: int):
    trades = (
        db.query(Trade)
        .filter(Trade.user_id == user_id)
        .all()
    )

    total_trades = len(trades)

    winning_trades = len(
        [
            trade for trade in trades
            if trade.result and trade.result.upper() == 'WIN'
        ]
    )

    losing_trades = len(
        [
            trade for trade in trades
            if trade.result and trade.result.upper() == 'LOSS'
        ]
    )

    breakeven_trades = len(
        [
            trade for trade in trades
            if trade.result and trade.result.upper() == 'BE'
        ]
    )

    win_rate = (winning_trades / total_trades * 100) if total_trades > 0 else 0

    total_profit = sum(trade.profit_loss for trade in trades if trade.profit_loss