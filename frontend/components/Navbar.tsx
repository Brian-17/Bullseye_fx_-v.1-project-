export default function Navbar() {
  return (
    <nav
      style={{
        background: "#020617",
        color: "#ffffff",
        padding: "16px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>Bullseye FX</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <a href="#" style={{ color: "#fff" }}>Home</a>
        <a href="#" style={{ color: "#fff" }}>Courses</a>
        <a href="#" style={{ color: "#fff" }}>Signals</a>
        <a href="#" style={{ color: "#fff" }}>Contact</a>
      </div>
    </nav>
  );
}
