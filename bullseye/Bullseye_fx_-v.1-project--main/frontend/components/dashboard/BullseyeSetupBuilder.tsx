export default function BullseyeSetupBuilder() {
  const checklist = [
    "Daily Bias",
    "Weekly Bias",
    "Market Structure (BOS)",
    "Change of Character (CHoCH)",
    "Liquidity Sweep",
    "Order Block",
    "Fair Value Gap (FVG)",
    "SMT Divergence",
    "Kill Zone",
    "High Impact News Checked",
    "Risk : Reward ≥ 1 : 3",
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
      <h2>🎯 Bullseye Setup Builder</h2>

      <p>
        Complete every confirmation before taking a trade.
      </p>

      <div style={{ marginTop: "20px" }}>
        {checklist.map((item, index) => (
          <div key={index} style={{ marginBottom: "12px" }}>
            <label>
              <input type="checkbox" /> {item}
            </label>
          </div>
        ))}
      </div>

      <button
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          background: "#f59e0b",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Calculate Bullseye Score
      </button>
    </div>
  );
                }
