const API_URL = "http://localhost:8000";

export async function getTrades() {
  const response = await fetch(`${API_URL}/trades`);

  return response.json();
}

export async function createTrade(data: any) {
  const response = await fetch(`${API_URL}/trades`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
