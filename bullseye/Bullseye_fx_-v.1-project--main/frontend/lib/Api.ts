const API_URL = "http://localhost:8000";

function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access_token");
}

async function apiFetch(path: string) {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function getTrades() {
  return apiFetch("/trades/");
}

export async function getDashboardStats() {
  return apiFetch("/dashboard/stats");
}

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.detail || result?.message || "Registration failed"
    );
  }

  return result;
}

export async function loginUser(data: {
  username: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.detail || result?.message || "Login failed"
    );
  }

  if (result?.access_token) {
    localStorage.setItem("access_token", result.access_token);
  }

  return result;
}
