"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin() {
    try {
      const res = await fetch(`https://${window.location.hostname.replace(/^3000-/, "8000-")}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      router.push("/");
    } catch (err) {
      setError("Login failed");
    }
  }

  return (
    <main style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0f172a" }}>
      <div style={{ background: "#ffffff", padding: "40px", borderRadius: "12px", width: "350px" }}>
        <h1 style={{ textAlign: "center" }}>Login</h1>
        {error && <p style={{color: "red", textAlign: "center"}}>{error}</p>}
        
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", padding: "12px", marginTop: "20px" }} />

        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", padding: "12px", marginTop: "15px" }} />

        <button onClick={handleLogin}
          style={{ width: "100%", marginTop: "20px", padding: "12px", background: "#f59e0b", border: "none", cursor: "pointer", fontWeight: "bold" }}>
          Login
        </button>
      </div>
    </main>
  );
}
