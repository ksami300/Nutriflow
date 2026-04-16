const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

// 🔐 Helper (automatski token)
const authHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// ================= AUTH =================

export const registerUser = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");

  return data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");

  // 🔥 AUTOMATSKO ČUVANJE TOKENA
  localStorage.setItem("token", data.token);

  return data;
};

export const getProfile = async () => {
  const res = await fetch(`${API_URL}/api/auth/profile`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch profile");

  return res.json();
};

// ================= MEAL PLANS =================

export const getMealPlans = async () => {
  const res = await fetch(`${API_URL}/api/meal-plans`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch meal plans");

  return res.json();
};

export const createMealPlan = async (body: any) => {
  const res = await fetch(`${API_URL}/api/meal-plans`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create meal plan");

  return data;
};

export const deleteMealPlan = async (id: string) => {
  const res = await fetch(`${API_URL}/api/meal-plans/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete");

  return res.json();
};

// ================= PAYMENTS =================

export const createCheckoutSession = async () => {
  const res = await fetch(`${API_URL}/api/payments/create-checkout-session`, {
    method: "POST",
    headers: authHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Stripe failed");

  return data;
};