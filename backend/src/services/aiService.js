const OpenAI = require("openai");
const env = require("../config/envConfig");

const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const extractJson = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("No AI response text available");
  }

  const cleaned = text.replace(/```/g, "").trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("No JSON object found in AI response");
  }

  return jsonMatch[0];
};

const asNumber = (value) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error("Invalid numeric value in AI meal plan");
  }
  return parsed;
};

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const requiredMealTypes = ["breakfast", "snack1", "lunch", "snack2", "dinner"];

const validatePlan = (plan) => {
  if (!plan || typeof plan !== "object" || !Array.isArray(plan.days)) {
    throw new Error("AI response must contain a days array");
  }

  if (plan.days.length !== 7) {
    throw new Error("AI weekly plan must contain exactly 7 days");
  }

  plan.days.forEach((day) => {
    if (!day || typeof day !== "object") {
      throw new Error("Each day must be an object");
    }

    if (!day.day || typeof day.day !== "string") {
      throw new Error("Each day must include a valid day name");
    }

    if (!Array.isArray(day.meals) || day.meals.length === 0) {
      throw new Error(`Day ${day.day} must include at least one meal`);
    }

    day.meals.forEach((meal) => {
      if (!meal || typeof meal !== "object") {
        throw new Error("Each meal must be an object");
      }

      if (!requiredMealTypes.includes(meal.type)) {
        throw new Error(`Meal type is invalid: ${meal.type}`);
      }

      if (!meal.name || typeof meal.name !== "string") {
        throw new Error("Meal name is required");
      }

      if (!Array.isArray(meal.foods) || meal.foods.length === 0) {
        throw new Error("Each meal must include foods");
      }

      if (!meal.totals || typeof meal.totals !== "object") {
        throw new Error("Each meal must include totals");
      }

      meal.foods.forEach((food) => {
        if (!food || typeof food !== "object") {
          throw new Error("Food items must be objects");
        }

        if (!food.name || typeof food.name !== "string") {
          throw new Error("Food name is required");
        }

        asNumber(food.grams);
        asNumber(food.calories);
        asNumber(food.protein);
        asNumber(food.carbs);
        asNumber(food.fat);
      });

      asNumber(meal.totals.calories);
      asNumber(meal.totals.protein);
      asNumber(meal.totals.carbs);
      asNumber(meal.totals.fat);
    });
  });

  return plan;
};

const generateAIPlan = async (input, history = {}) => {
  const diet = input.preferences?.dietType || "standard";
  const excluded = input.preferences?.excludedFoods?.join(", ") || "none";
  const previousMeals = history.mealNames?.join(", ") || "none";
  const previousFoods = history.foodsUsed?.join(", ") || "none";
  const likedFoods = history.likedFoods?.join(", ") || "none";
  const dislikedFoods = history.dislikedFoods?.join(", ") || "none";
  const frequentFoods = history.frequentFoods?.join(", ") || "none";
  const recentMeals = history.recentMeals?.join(", ") || "none";

  const prompt = `You are a professional nutritionist creating personalized weekly meal plans.

Generate a STRICT JSON weekly meal plan according to these rules:
- 7 days: Monday through Sunday
- Each day must include 5 meals: breakfast, snack1, lunch, snack2, dinner
- Do not repeat the same meal name across days
- Each meal must include foods with grams, calories, protein, carbs, and fat
- Totals must be provided per meal
- Prioritize foods the user likes
- Avoid foods the user dislikes
- Avoid repeating recent meals from prior plans
- Introduce controlled variation across the week
- Respect diet preferences and excluded foods
- Response must be valid JSON only, without surrounding markdown or text

User profile:
- Goal: ${input.goal}
- Calories: ${input.calories}
- Protein: ${input.macros.protein}g
- Carbs: ${input.macros.carbs}g
- Fat: ${input.macros.fat}g
- Diet type: ${diet}
- Excluded foods: ${excluded}

Personalization context:
- Liked foods/meals: ${likedFoods}
- Disliked foods/meals: ${dislikedFoods}
- Frequently used foods: ${frequentFoods}
- Recent meals: ${recentMeals}

History (DO NOT REPEAT these meals or foods):
- Previous meal names: ${previousMeals}
- Previous foods used: ${previousFoods}

Return only JSON with days: [ { day: "Monday", meals: [...] }, ... ].`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  const text = completion.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("AI returned an empty response");
  }

  const rawJson = extractJson(text);
  let plan;

  try {
    plan = JSON.parse(rawJson);
  } catch (parseError) {
    throw new Error("Failed to parse AI JSON response");
  }

  return validatePlan(plan);
};

module.exports = { generateAIPlan };
