export default function AddTradePage() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>➕ Add New Trade</h1>

      <p>Record a new trade into your journal.</p>

      <input
        type="text"
        placeholder="Trading Pair"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="text"
        placeholder="Direction (BUY/SELL)"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="number"
        placeholder="Entry Price"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="number"
        placeholder="Stop Loss"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="number"
        placeholder="Take Profit"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <textarea
        placeholder="Trade Notes"
        style={{
          width: "100%",
          height: "120px",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <button
        style={{
          padding: "12px 24px",
          background: "#f59e0b",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Save Trade
      </button>
    </div>
  );
      }
