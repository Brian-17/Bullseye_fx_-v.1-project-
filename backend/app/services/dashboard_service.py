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
        (winning_trades / total_trades) * 100
<<<<<<< HEAD
        if total_trades > 0
        else 0
    )

=======
        if total_trades
        else 0
    )

    gross_profit = sum(
        t.profit_loss
        for t in trades
        if (t.profit_loss or 0) > 0
    )

    gross_loss = abs(
        sum(
            t.profit_loss
            for t in trades
            if (t.profit_loss or 0) < 0
        )
    )

    profit_factor = (
        gross_profit / gross_loss
        if gross_loss > 0
        else gross_profit
    )

    rr_values = []

    for trade in trades:

        risk = abs(
            (trade.entry or 0)
            - (trade.stop_loss or 0)
        )

        reward = abs(
            (trade.take_profit or 0)
            - (trade.entry or 0)
        )

        if risk > 0:
            rr_values.append(
                reward / risk
            )

    average_rr = (
        sum(rr_values) / len(rr_values)
        if rr_values
        else 0
    )

    best_pair = (
        Counter(
            t.pair for t in trades if t.pair
        ).most_common(1)[0][0]
        if trades
        else "N/A"
    )

    best_strategy = (
        Counter(
            t.strategy
            for t in trades
            if t.strategy
        ).most_common(1)[0][0]
        if trades
        else "N/A"
    )

    best_session = (
        Counter(
            t.session
            for t in trades
            if t.session
        ).most_common(1)[0][0]
        if trades
        else "N/A"
    )

>>>>>>> 7b1b1a8addf2d588b66c7af1863bae80647d2a48
    return {
        "total_trades": total_trades,
        "winning_trades": winning_trades,
        "losing_trades": losing_trades,
        "win_rate": round(win_rate, 2),
        "total_profit": round(total_profit, 2),
        "average_profit": round(average_profit, 2),
<<<<<<< HEAD
  }
=======
        "profit_factor": round(profit_factor, 2),
        "average_rr": round(average_rr, 2),
        "best_pair": best_pair,
        "best_strategy": best_strategy,
        "best_session": best_session,
        }
>>>>>>> 7b1b1a8addf2d588b66c7af1863bae80647d2a48
