import { fetcher } from "./fetcher";

export const getMealPlans = (token: string) => {
  return fetcher("/meal-plans", {}, token);
};

export const createMealPlan = (goal: string, token: string) => {
  return fetcher(
    "/meal-plans",
    {
      method: "POST",
      body: JSON.stringify({ goal }),
    },
    token
  );
};