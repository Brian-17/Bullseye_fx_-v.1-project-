export default function Sidebar() {
  return (
    <aside
      style={{
        width: "260px",
        background: "#0f172a",
        color: "#ffffff",
        minHeight: "100vh",
        padding: "30px 20px",
      }}
    >
      <h2 style={{ color: "#f59e0b" }}>🎯 Bullseye FX</h2>

      <nav style={{ marginTop: "40px" }}>
        <p>🏠 Dashboard</p>
        <p>📈 Signals</p>
        <p>📖 Journal</p>
        <p>🎓 Academy</p>
        <p>📅 Calendar</p>
        <p>🤖 AI Assistant</p>
        <p>⚙ Settings</p>
      </nav>
    </aside>
  );
}
