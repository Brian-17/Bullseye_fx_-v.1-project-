from sqlalchemy.orm import Session
from app.models.trade import Trade


def get_dashboard_stats(db: Session, user_id: int):
    trades = db.query(Trade).filter(Trade.user_id == user_id).all()

        total_trades = len(trades)

            winning_trades = len(
                    [t for t in trades if t.result and t.result.upper() == "WIN"]
                        )

                            losing_trades = len(
                                    [t for t in trades if t.result and t.result.upper() == "LOSS"]
                                        )

                                            breakeven_trades = len(
                                                    [t for t in trades if t.result and t.result.upper() in ("BE", "BREAKEVEN")]
                                                        )

                                                            win_rate = (
                                                                    round((winning_trades / total_trades) * 100, 2)
                                                                            if total_trades > 0
                                                                                    else 0
                                                                                        )

                                                                                            total_profit = sum(
                                                                                                    (t.profit_loss or 0) for t in trades
                                                                                                        )

                                                                                                            return {
                                                                                                                    "total_trades": total_trades,
                                                                                                                            "winning_trades": winning_trades,
                                                                                                                                    "losing_trades": losing_trades,
                                                                                                                                            "breakeven_trades": breakeven_trades,
                                                                                                                                                    "win_rate": win_rate,
                                                                                                                                                            "total_profit": total_profit,
                                                                                                                                                                }