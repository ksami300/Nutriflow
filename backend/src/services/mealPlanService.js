const mealsDb = require("../data/meals");

// 📊 USAGLAŠENA DISTRIBUCIJA KALORIJA SA TEORIJOM DIPLOMSKOG RADA (100% TAČNO)
const MEAL_DISTRIBUTION = [
  { type: "breakfast", ratio: 0.25, label: "Breakfast" },
  { type: "lunch", ratio: 0.35, label: "Lunch" },
  { type: "snack1", ratio: 0.1, label: "Snacks" },
  { type: "dinner", ratio: 0.3, label: "Dinner" },
];

const mealTypeCategories = {
  breakfast: ["breakfast", "all"],
  lunch: ["lunch", "all"],
  snack1: ["snack", "all"],
  dinner: ["dinner", "all"],
};

const veganBlacklist = [
  "egg (whole)",
  "chicken breast",
  "salmon",
  "cottage cheese",
  "greek yogurt",
  "turkey breast",
  "tuna",
  "protein powder",
  "low-fat milk",
];

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const normalizePreferences = (preferences = {}) => ({
  dietType: preferences.dietType || "standard",
  excludedFoods: Array.isArray(preferences.excludedFoods)
    ? preferences.excludedFoods.map((item) => item.trim().toLowerCase())
    : [],
});

const filterFoods = (mealType, preferences) => {
  const allowedCategories = mealTypeCategories[mealType] || ["all"];

  return mealsDb.filter((food) => {
    const name = food.name.toLowerCase();
    if (!allowedCategories.includes(food.category)) return false;
    if (preferences.excludedFoods.includes(name)) return false;
    if (preferences.dietType === "keto" && food.carbs > 10) return false;
    if (preferences.dietType === "vegan" && veganBlacklist.includes(name)) return false;
    return true;
  });
};

const orderFoods = (foods, preferences, isPremium) => {
  if (isPremium) {
    return [...foods].sort(() => Math.random() - 0.5);
  }

  if (preferences.dietType === "high-protein") {
    return [...foods].sort((a, b) => b.protein - a.protein);
  }

  return [...foods].sort((a, b) => a.name.localeCompare(b.name));
};

const pickFoods = (mealType, preferences, isPremium) => {
  const foods = orderFoods(filterFoods(mealType, preferences), preferences, isPremium);

  if (!foods.length) {
    throw new Error("No foods available after filtering");
  }

  const selected = [];
  for (const food of foods) {
    if (selected.length >= 3) break;
    if (!selected.some((item) => item.name === food.name)) {
      selected.push(food);
    }
  }

  return selected.length ? selected : foods.slice(0, 3);
};

const scaleFood = (food, grams) => {
  const multiplier = grams / 100;
  return {
    name: food.name,
    category: food.category,
    grams,
    calories: Math.round((food.calories || 0) * multiplier),
    protein: parseFloat(((food.protein || 0) * multiplier).toFixed(1)),
    carbs: parseFloat(((food.carbs || 0) * multiplier).toFixed(1)),
    fat: parseFloat(((food.fat || 0) * multiplier).toFixed(1)),
  };
};

const calculateGrams = (targetCalories, food) => {
  if (!food?.calories) return 100;
  const grams = Math.max(50, Math.round((targetCalories / 3 / food.calories) * 100));
  return grams;
};

const generateMealPlan = ({
  calories,
  macros,
  goal,
  preferences = {},
  isPremium = false,
}) => {
  const normalizedPreferences = normalizePreferences(preferences);
  const meals = MEAL_DISTRIBUTION.map(({ type, ratio, label }) => {
    const targetCalories = Math.round(calories * ratio);
    const targetProtein = Math.round(macros.protein * ratio);
    const targetCarbs = Math.round(macros.carbs * ratio);
    const targetFat = Math.round(macros.fat * ratio);

    const foods = pickFoods(type, normalizedPreferences, isPremium).map((food) => {
      const grams = calculateGrams(targetCalories, food);
      return scaleFood(food, grams);
    });

    const totals = foods.reduce(
      (acc, food) => {
        acc.calories += food.calories;
        acc.protein += food.protein;
        acc.carbs += food.carbs;
        acc.fat += food.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return {
      type,
      name: label,
      foods,
      totals,
      target: {
        calories: targetCalories,
        protein: targetProtein,
        carbs: targetCarbs,
        fat: targetFat,
      },
    };
  });

  return { meals };
};

const cloneMealWithVariation = (meal, dayIndex) => {
  const variance = 1 + ((dayIndex - 3) * 0.05);
  const foods = meal.foods.map((food) => {
    const grams = Math.max(50, Math.round(food.grams * variance));
    return scaleFood(food, grams);
  });

  const totals = foods.reduce(
    (acc, food) => {
      acc.calories += food.calories;
      acc.protein += food.protein;
      acc.carbs += food.carbs;
      acc.fat += food.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return {
    ...meal,
    foods,
    totals,
  };
};

const createWeeklyPlanFromDaily = (dailyPlan) => ({
  weeklyPlan: WEEK_DAYS.map((day, index) => ({
    day,
    meals: dailyPlan.meals.map((meal) => cloneMealWithVariation(meal, index)),
  })),
});

const generateWeeklyPlan = (options) => {
  const dailyPlan = generateMealPlan(options);
  return createWeeklyPlanFromDaily(dailyPlan);
};

const generateGroceryList = (plan) => {
  const foodTotals = new Map();
  const days = Array.isArray(plan.weeklyPlan) && plan.weeklyPlan.length
    ? plan.weeklyPlan
    : Array.isArray(plan.meals) && plan.meals.length
    ? [{ day: "Day 1", meals: plan.meals }]
    : [];

  days.forEach((day) => {
    day.meals.forEach((meal) => {
      (meal.foods || []).forEach((food) => {
        if (!food?.name) {
          return;
        }

        const normalizedName = food.name.trim();
        if (!normalizedName) {
          return;
        }

        const current = foodTotals.get(normalizedName) || 0;
        foodTotals.set(normalizedName, current + (Number(food.grams) || 0));
      });
    });
  });

  return {
    groceries: [...foodTotals.entries()].map(([name, totalGrams]) => ({
      name,
      totalGrams,
    })),
  };
};

module.exports = { generateMealPlan, generateWeeklyPlan, generateGroceryList };
