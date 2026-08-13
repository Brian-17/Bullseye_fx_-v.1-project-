export default function MarketOverview() {
  const markets = [
    { name: "🥇 XAU/USD", price: "3362.45", trend: "🟢 Bullish" },
    { name: "🇺🇸 NAS100", price: "24980.30", trend: "🟢 Bullish" },
    { name: "🇺🇸 US30", price: "45210.15", trend: "🔴 Bearish" },
    { name: "🇺🇸 S&P 500", price: "6482.10", trend: "🟢 Bullish" },
    { name: "💶 EUR/USD", price: "1.1742", trend: "🟢 Bullish" },
    { name: "💷 GBP/USD", price: "1.3568", trend: "🟢 Bullish" },
    { name: "💴 USD/JPY", price: "149.82", trend: "🔴 Bearish" },
    { name: "₿ BTC/USD", price: "118,500", trend: "🟢 Bullish" },
    { name: "Ξ ETH/USD", price: "4,250", trend: "🟢 Bullish" },
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
      <h2>📊 Market Overview</h2>

      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th align="left">Market</th>
            <th align="left">Price</th>
            <th align="left">Trend</th>
          </tr>
        </thead>

        <tbody>
          {markets.map((market) => (
            <tr key={market.name}>
              <td style={{ padding: "10px 0" }}>{market.name}</td>
              <td>{market.price}</td>
              <td>{market.trend}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
      }
