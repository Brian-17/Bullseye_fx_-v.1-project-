export default function Features() {
  return (
    <section
      style={{
        padding: "80px 20px",
        background: "#ffffff",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
        Why Choose Bullseye FX?
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            width: "280px",
            padding: "25px",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
          }}
        >
          <h3>📚 Premium Academy</h3>
          <p>Learn ICT and Smart Money Concepts from beginner to advanced.</p>
        </div>

        <div
          style={{
            width: "280px",
            padding: "25px",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
          }}
        >
          <h3>📈 Trading Signals</h3>
          <p>Receive high-quality trading setups with detailed analysis.</p>
        </div>

        <div
          style={{
            width: "280px",
            padding: "25px",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
          }}
        >
          <h3>🤖 AI Assistant</h3>
          <p>Use AI-powered tools to improve your market analysis and learning.</p>
        </div>
      </div>
    </section>
  );
}
