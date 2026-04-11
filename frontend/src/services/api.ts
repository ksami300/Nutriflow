const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

// AUTH
export const registerUser = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registration failed");
  }

  return res.json();
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  return res.json();
};

export const getProfile = async (token: string) => {
  const res = await fetch(`${API_URL}/api/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch profile");

  return res.json();
};

// MEAL PLANS
export const getMealPlans = async (token: string) => {
  const res = await fetch(`${API_URL}/api/meal-plans`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch meal plans");

  return res.json();
};

export const createMealPlan = async (
  goal: string,
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: string,
  token: string
) => {
  const res = await fetch(`${API_URL}/api/meal-plans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ goal, weight, height, age, gender, activityLevel }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create meal plan");
  }

  return res.json();
};

export const deleteMealPlan = async (id: string, token: string) => {
  const res = await fetch(`${API_URL}/api/meal-plans/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete meal plan");

  return res.json();
};

// PAYMENTS
export const upgradePremium = async (token: string) => {
  const res = await fetch(`${API_URL}/api/payments/upgrade-premium`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to upgrade");

  return res.json();
};

export const createCheckoutSession = async (token: string) => {
  const res = await fetch(`${API_URL}/api/payments/create-checkout-session`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to create checkout session");

  return res.json();
};