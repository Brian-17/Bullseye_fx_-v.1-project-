import TradeCard from "../../components/journal/TradeCard";

export default function TradingJournal() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>📖 Trading Journal</h1>

      <TradeCard
        pair="XAU/USD"
        type="BUY"
        result="+$250"
      />

      <TradeCard
        pair="NAS100"
        type="SELL"
        result="-$80"
      />

      <TradeCard
        pair="S&P 500"
        type="BUY"
        result="+$145"
      />
    </div>
  );
}
