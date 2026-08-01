export default function Courses() {
  return (
    <section
      style={{
        padding: "80px 20px",
        background: "#f8fafc",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
        Featured Courses
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "25px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ border: "1px solid #ddd", padding: "20px", width: "300px", borderRadius: "12px" }}>
          <h3>ICT Foundations</h3>
          <p>Understand liquidity, market structure and order flow.</p>
        </div>

        <div style={{ border: "1px solid #ddd", padding: "20px", width: "300px", borderRadius: "12px" }}>
          <h3>Smart Money Concepts</h3>
          <p>Master BOS, CHoCH, FVGs, Order Blocks and Liquidity.</p>
        </div>

        <div style={{ border: "1px solid #ddd", padding: "20px", width: "300px", borderRadius: "12px" }}>
          <h3>Risk Management</h3>
          <p>Protect your capital using professional risk management.</p>
        </div>
      </div>
    </section>
  );
        }
