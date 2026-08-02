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
