export default function Navbar() {
  return (
    <nav
      style={{
        background: "#0f172a",
        color: "#ffffff",
        padding: "18px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
      }}
    >
      <h2
        style={{
          margin: 0,
          color: "#f59e0b",
          fontWeight: "bold",
        }}
      >
        🎯 Bullseye FX
      </h2>

      <div style={{ display: "flex", gap: "25px" }}>
        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Home</a>
        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Academy</a>
        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Signals</a>
        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Journal</a>
        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Contact</a>
      </div>
    </nav>
  );
          }
