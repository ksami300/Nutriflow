const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const getMealPlans = async (token: string) => {
  const res = await fetch(`${API_URL}/api/meal-plans`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch meal plans");

  return res.json();
};

export const createMealPlan = async (goal: string, token: string) => {
  const res = await fetch(`${API_URL}/api/meal-plans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ goal }),
  });

  if (!res.ok) throw new Error("Failed to create meal plan");

  return res.json();
};