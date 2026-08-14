const API_URL =
  typeof window !== "undefined"
    ? `https://${window.location.hostname.replace(/^3000-/, "8000-")}`
    : "http://127.0.0.1:8000";

function getToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem('access_token');
}

async function apiFetch(path: string) {
  const token = getToken();
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function getTrades() {
  return apiFetch('/trades/');
}

export async function getDashboardStats() {
  return apiFetch('/dashboard/stats');
}
