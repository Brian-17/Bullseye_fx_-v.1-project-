export default function DashboardPage() {
  return (
    <main
      style={{
        padding: "40px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
        Dashboard
      </h1>

      <p style={{ color: "#64748b", marginBottom: "40px" }}>
        Welcome back to Bullseye FX.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Total Trades</h3>
          <h1>0</h1>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Win Rate</h3>
          <h1>0%</h1>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Account Balance</h3>
          <h1>$0.00</h1>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Active Signals</h3>
          <h1>0</h1>
        </div>
      </div>
    </main>
  );
          }
