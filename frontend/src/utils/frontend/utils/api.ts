export const API = process.env.NEXT_PUBLIC_API_URL;

export const fetchAPI = async (url: string, options: any = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "API error");
  }

  return res.json();
};