type TradeCardProps = {
  pair: string;
  type: string;
  result: string;
};

export default function TradeCard({
  pair,
  type,
  result,
}: TradeCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h3>{pair}</h3>

      <p>Direction: {type}</p>

      <p>Result: {result}</p>
    </div>
  );
}
