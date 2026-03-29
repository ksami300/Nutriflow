const API_ROOT = process.env.NEXT_PUBLIC_API_URL;

if (!API_ROOT) {
  throw new Error("NEXT_PUBLIC_API_URL must be defined");
}

export const fetcher = async (
  endpoint: string,
  options: RequestInit = {},
  token?: string
) => {
  const res = await fetch(`${API_ROOT}${endpoint}`, {
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