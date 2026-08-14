from collections import Counter

from sqlalchemy.orm import Session

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
            trade
            for trade in trades
            if trade.result
            and trade.result.upper() == "WIN"
        ]
    )

    losing_trades = len(
        [
            trade
            for trade in trades
            if trade.result
            and trade.result.upper() == "LOSS"
        ]
    )

    breakeven_trades = len(
        [
            trade
            for trade in trades
            if trade.result
            and trade.result.upper() == "BE"
        ]
    )

    win_rate = (
        winning_trades / total_trades * 100
        if total_trades > 0
        else 0
    )

    profit_values = [
        trade.profit_loss
        for trade in trades
        if trade.profit_loss is not None
    ]

    total_profit = sum(profit_values)

    average_profit = (
        total_profit / len(profit_values)
        if profit_values
        else 0
    )

    gross_profit = sum(
        value for value in profit_values
        if value > 0
    )

    gross_loss = abs(
        sum(
            value for value in profit_values
            if value < 0
        )
    )

    profit_factor = (
        gross_profit / gross_loss
        if gross_loss > 0
        else 0
    )

    rr_values = []

    for trade in trades:
        if (
            trade.entry is None
            or trade.stop_loss is None
            or trade.take_profit is None
        ):
            continue

        risk = abs(trade.entry - trade.stop_loss)
        reward = abs(trade.take_profit - trade.entry)

        if risk > 0:
            rr_values.append(reward / risk)

    average_rr = (
        sum(rr_values) / len(rr_values)
        if rr_values
        else 0
    )

    def best_by_profit(field_name):
        totals = {}

        for trade in trades:
            value = getattr(trade, field_name, None)

            if not value or trade.profit_loss is None:
                continue

            totals[value] = (
                totals.get(value, 0)
                + trade.profit_loss
            )

        if not totals:
            return None

        return max(
            totals,
            key=totals.get,
        )

    best_pair = best_by_profit("pair")
    best_strategy = best_by_profit("strategy")
    best_session = best_by_profit("session")

    return {
        "total_trades": total_trades,
        "winning_trades": winning_trades,
        "losing_trades": losing_trades,
        "breakeven_trades": breakeven_trades,
        "win_rate": round(win_rate, 2),
        "total_profit": round(total_profit, 2),
        "average_profit": round(average_profit, 2),
        "profit_factor": round(profit_factor, 2),
        "average_rr": round(average_rr, 2),
        "best_pair": best_pair,
        "best_strategy": best_strategy,
        "best_session": best_session,
    }
