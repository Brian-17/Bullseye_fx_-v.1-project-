export default function Topbar() {
  return (
    <header
      style={{
        height: "70px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <p style={{ margin: 0, color: "#64748b" }}>
          Welcome back to Bullseye FX
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <span>🔔</span>
        <span>👤 Brian</span>
      </div>
    </header>
  );
}
