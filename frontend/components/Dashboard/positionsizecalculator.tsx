export default function PositionSizeCalculator() {
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
      <h2>📏 Position Size Calculator</h2>

      <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
        <input
          type="number"
          placeholder="Account Balance ($)"
          style={{ padding: "10px" }}
        />

        <input
          type="number"
          placeholder="Risk Percentage (%)"
          style={{ padding: "10px" }}
        />

        <input
          type="number"
          placeholder="Stop Loss (Pips/Points)"
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
          Calculate Position Size
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <p><strong>Risk Amount:</strong> $0.00</p>
        <p><strong>Recommended Lot Size:</strong> 0.00</p>
      </div>
    </div>
  );
        }
