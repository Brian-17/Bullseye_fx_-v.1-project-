export interface Trade {
  pair: string;
  direction: string;
  entry: number;
  stop_loss: number;
  take_profit: number;
  result: string;
}
