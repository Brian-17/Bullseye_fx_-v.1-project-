export default function Signals() {
  return (
    <section
      style={{
        padding: "80px 20px",
        background: "#0f172a",
        color: "#ffffff",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
        Live Trading Signals
      </h2>

      <p style={{ color: "#cbd5e1", marginBottom: "40px" }}>
        Professional ICT & Smart Money Concept trade ideas.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "25px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "12px",
            width: "280px",
          }}
        >
          <h3>XAU/USD</h3>
          <p>Bias: Buy</p>
          <p>Entry: 3350.00</p>
          <p>Target: 3375.00</p>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "12px",
            width: "280px",
          }}
        >
          <h3>NAS100</h3>
          <p>Bias: Sell</p>
          <p>Entry: 24800</p>
          <p>Target: 24650</p>
        </div>
      </div>
    </section>
  );
}
