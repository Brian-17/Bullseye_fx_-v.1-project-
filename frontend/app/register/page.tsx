export default function RegisterPage() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#0f172a",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "40px",
          borderRadius: "12px",
          width: "380px",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          style={{ width: "100%", padding: "12px", marginBottom: "12px" }}
        />

        <input
          type="email"
          placeholder="Email"
          style={{ width: "100%", padding: "12px", marginBottom: "12px" }}
        />

        <input
          type="password"
          placeholder="Password"
          style={{ width: "100%", padding: "12px", marginBottom: "12px" }}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          style={{ width: "100%", padding: "12px", marginBottom: "20px" }}
        />

        <button
          style={{
            width: "100%",
            padding: "12px",
            background: "#f59e0b",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Register
        </button>
      </div>
    </main>
  );
}
