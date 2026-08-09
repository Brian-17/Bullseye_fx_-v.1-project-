<<<<<<< HEAD
from sqlalchemy.orm import Session
from sqlalchemy import func
=======
from collections import Counter

from sqlalchemy.orm import Session
>>>>>>> 7b1b1a8addf2d588b66c7af1863bae80647d2a48

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
<<<<<<< HEAD
            trade for trade in trades
            if trade.result and trade.result.upper() == "WIN"
=======
            t for t in trades
            if t.result and t.result.upper() == "WIN"
>>>>>>> 7b1b1a8addf2d588b66c7af1863bae80647d2a48
        ]
    )

    losing_trades = len(
        [
<<<<<<< HEAD
            trade for trade in trades
            if trade.result and trade.result.upper() == "LOSS"
=======
            t for t in trades
            if t.result and t.result.upper() == "LOSS"
>>>>>>> 7b1b1a8addf2d588b66c7af1863bae80647d2a48
        ]
    )

    total_profit = sum(
<<<<<<< HEAD
        trade.profit_loss or 0
        for trade in trades
=======
        t.profit_loss or 0
        for t in trades
>>>>>>> 7b1b1a8addf2d588b66c7af1863bae80647d2a48
    )

    average_profit = (
        total_profit / total_trades
<<<<<<< HEAD
        if total_trades > 0
=======
        if total_trades
>>>>>>> 7b1b1a8addf2d588b66c7af1863bae80647d2a48
        else 0
    )

    win_rate = (
        (win