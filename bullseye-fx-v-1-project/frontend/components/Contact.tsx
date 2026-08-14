export default function Contact() {
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
        Contact Bullseye FX
      </h2>

      <p style={{ marginBottom: "30px", color: "#cbd5e1" }}>
        Have questions? We'd love to hear from you.
      </p>

      <p>Email: support@bullseyefx.com</p>
      <p>Phone: +254 XXX XXX XXX</p>

      <button
        style={{
          marginTop: "25px",
          background: "#f59e0b",
          color: "#000",
          border: "none",
          padding: "15px 35px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Contact Us
      </button>
    </section>
  );
}
