from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_trades: int
    winning_trades: int
    losing_trades: int
    win_rate: float
    total_profit: float
    average_profit: float

    # New Analytics
    profit_factor: float
    average_rr: float
    best_pair: str
    best_strategy: str
    best_session: str
