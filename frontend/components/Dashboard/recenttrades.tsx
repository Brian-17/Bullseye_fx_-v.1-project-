export default function RecentTrades() {
  const trades = [
    {
      pair: "XAU/USD",
      type: "BUY",
      entry: "3362.50",
      result: "+$250",
    },
    {
      pair: "NAS100",
      type: "SELL",
      entry: "24980",
      result: "-$80",
    },
    {
      pair: "S&P 500",
      type: "BUY",
      entry: "6480",
      result: "+$150",
    },
  ];

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "25px",
        borderRadius: "12px",
        marginTop: "30px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h2>📈 Recent Trades</h2>

      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th align="left">Pair</th>
            <th align="left">Type</th>
            <th align="left">Entry</th>
            <th align="left">Result</th>
          </tr>
        </thead>

        <tbody>
          {trades.map((trade, index) => (
            <tr key={index}>
              <td style={{ padding: "12px 0" }}>{trade.pair}</td>
              <td>{trade.type}</td>
              <td>{trade.entry}</td>
              <td>{trade.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
