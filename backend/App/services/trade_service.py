def calculate_profit(entry, take_profit):
    return take_profit - entry


def calculate_loss(entry, stop_loss):
    return entry - stop_loss
