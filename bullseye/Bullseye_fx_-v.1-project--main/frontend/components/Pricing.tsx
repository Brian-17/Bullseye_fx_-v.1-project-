export default function Pricing() {
  return (
    <section
      style={{
        padding: "80px 20px",
        background: "#f8fafc",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
        Membership Plans
      </h2>

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
            width: "300px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "30px",
          }}
        >
          <h3>Starter</h3>
          <h1>$19/month</h1>
          <p>✓ Beginner Courses</p>
          <p>✓ Community Access</p>
        </div>

        <div
          style={{
            width: "300px",
            border: "2px solid #f59e0b",
            borderRadius: "12px",
            padding: "30px",
          }}
        >
          <h3>Pro</h3>
          <h1>$49/month</h1>
          <p>✓ All Courses</p>
          <p>✓ Premium Signals</p>
          <p>✓ Trading Journal</p>
          <p>✓ AI Assistant</p>
        </div>
      </div>
    </section>
  );
            }
