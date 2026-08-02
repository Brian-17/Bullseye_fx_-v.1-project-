export default function RiskRewardCalculator() {
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
      <h2>⚖️ Risk-to-Reward Calculator</h2>

      <div
        style={{
          display: "grid",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <input
          type="number"
          placeholder="Entry Price"
          style={{ padding: "10px" }}
        />

        <input
          type="number"
          placeholder="Stop Loss"
          style={{ padding: "10px" }}
        />

        <input
          type="number"
          placeholder="Take Profit"
          style={{ padding: "10px" }}
        />

        <button
          style={{
            padding: "12px",
            background: "#f59e0b",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Calculate
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <p><strong>Risk:</strong> 0</p>
        <p><strong>Reward:</strong> 0</p>
        <p><strong>Risk : Reward:</strong> 1 : 0</p>
      </div>
    </div>
  );
            }
