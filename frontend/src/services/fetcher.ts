const API_URL = "http://localhost:5000/api";

export const fetcher = async (
  endpoint: string,
  options: RequestInit = {},
  token?: string
) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    throw new Error("API error");
  }

  return res.json();
};