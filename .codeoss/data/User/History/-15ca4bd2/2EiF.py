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

                                                                                                                                        # Add the rest of your dashboard stats here
                                                                                                                                            return {
                                                                                                                                                    "total_trades": total_trades,
                                                                                                                                                            "winning_trades": winning_trades,
                                                                                                                                                                    "losing_trades": losing_trades,
                                                                                                                                                                        }