const { generateMealPlan, generateWeeklyPlan, generateGroceryList } = require("../services/mealPlanService");
const { generateAIPlan } = require("../services/aiService");
const { calculateCalories } = require("../utils/calorieCalculator");
const { calculateMacros } = require("../utils/macroCalculator");
const MealPlan = require("../models/MealPlan");
const User = require("../models/User");
const logger = require("../utils/logger");

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const normalizePreferences = (preferences = {}) => ({
  dietType: preferences.dietType || "standard",
  excludedFoods: Array.isArray(preferences.excludedFoods)
    ? preferences.excludedFoods
    : [],
});

const isCacheExpired = (plan) => {
  if (!plan?.createdAt) {
    return true;
  }

  return Date.now() - new Date(plan.createdAt).getTime() > CACHE_TTL_MS;
};

const buildCacheKey = (userId, goal, preferences) => {
  const dietType = preferences.dietType || "standard";
  const excludedFoods = Array.isArray(preferences.excludedFoods)
    ? [...preferences.excludedFoods].map((item) => item.trim().toLowerCase()).sort()
    : [];

  return `${userId}:${goal}:${dietType}:${JSON.stringify(excludedFoods)}`;
};

const buildPlanRequest = (body) => {
  const { goal, weight, height, age, gender, activityLevel, preferences } = body;
  const normalizedPreferences = normalizePreferences(preferences);
  const calories = calculateCalories({ goal, weight, height, age, gender, activityLevel });
  const macros = calculateMacros(calories, weight, goal);

  return {
    calories,
    macros,
    goal,
    preferences: normalizedPreferences,
  };
};

const normalizeDate = (date) => {
  if (!date) return null;
  const value = new Date(date);
  return value.toISOString().slice(0, 10);
};

const checkAndResetAIUsage = async (userId) => {
  const user = await User.findById(userId).select("aiUsageCount aiUsageDate isPremium");
  if (!user) {
    return { aiUsageCount: 0, user: null };
  }

  const today = normalizeDate(new Date());
  const lastUsageDate = normalizeDate(user.aiUsageDate);
  let aiUsageCount = user.aiUsageCount || 0;

  if (lastUsageDate !== today) {
    aiUsageCount = 0;
    await User.findByIdAndUpdate(userId, {
      aiUsageCount: 0,
      aiUsageDate: new Date(),
    });
  }

  return { aiUsageCount, user };
};

const incrementAIUsage = async (userId, currentCount) => {
  await User.findByIdAndUpdate(userId, {
    aiUsageCount: currentCount + 1,
    aiUsageDate: new Date(),
  });
};

const getPlanDays = (plan) => {
  if (Array.isArray(plan.weeklyPlan) && plan.weeklyPlan.length) {
    return plan.weeklyPlan;
  }

  if (Array.isArray(plan.meals) && plan.meals.length) {
    return [{ day: "Legacy", meals: plan.meals }];
  }

  return [];
};

const extractHistory = (plans) => {
  const mealNames = new Set();
  const foodsUsed = new Set();

  plans.forEach((plan) => {
    getPlanDays(plan).forEach((day) => {
      (day.meals || []).forEach((meal) => {
        if (meal?.name) {
          mealNames.add(meal.name);
        }
        (meal?.foods || []).forEach((food) => {
          if (food?.name) {
            foodsUsed.add(food.name);
          }
        });
      });
    });
  });

  return { mealNames: [...mealNames], foodsUsed: [...foodsUsed] };
};

const buildAIContext = (plans, user) => {
  const foodCount = new Map();
  const recentMeals = [];

  plans.forEach((plan) => {
    getPlanDays(plan).forEach((day) => {
      (day.meals || []).forEach((meal) => {
        if (meal?.name) {
          recentMeals.push(meal.name);
        }
        (meal?.foods || []).forEach((food) => {
          if (!food?.name) {
            return;
          }
          const normalizedFood = food.name.trim();
          if (!normalizedFood) {
            return;
          }

          foodCount.set(
            normalizedFood,
            (foodCount.get(normalizedFood) || 0) + 1
          );
        });
      });
    });
  });

  const frequentFoods = [...foodCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([name]) => name);

  const likedFoods = Array.isArray(user.preferences?.likedMeals)
    ? [...new Set(user.preferences.likedMeals.filter(Boolean))]
    : [];

  const dislikedFoods = Array.isArray(user.preferences?.dislikedMeals)
    ? [...new Set(user.preferences.dislikedMeals.filter(Boolean))]
    : [];

  return {
    likedFoods,
    dislikedFoods,
    frequentFoods,
    recentMeals: recentMeals.slice(0, 20),
  };
};

const normalizeAIMealPlan = (plan) => {
  if (!plan || !Array.isArray(plan.days)) {
    throw new Error("AI plan is malformed");
  }

  return {
    weeklyPlan: plan.days.map((day) => ({
      day: day.day,
      meals: Array.isArray(day.meals)
        ? day.meals.map((meal) => ({
            type: meal.type,
            name: meal.name,
            foods: Array.isArray(meal.foods)
              ? meal.foods.map((food) => ({
                  category: food.category || "all",
                  name: food.name,
                  grams: Number(food.grams) || 0,
                  calories: Number(food.calories) || 0,
                  protein: Number(food.protein) || 0,
                  carbs: Number(food.carbs) || 0,
                  fat: Number(food.fat) || 0,
                }))
              : [],
            totals: {
              calories: Number(meal.totals?.calories) || 0,
              protein: Number(meal.totals?.protein) || 0,
              carbs: Number(meal.totals?.carbs) || 0,
              fat: Number(meal.totals?.fat) || 0,
            },
            target: {
              calories: Number(meal.target?.calories) || 0,
              protein: Number(meal.target?.protein) || 0,
              carbs: Number(meal.target?.carbs) || 0,
              fat: Number(meal.target?.fat) || 0,
            },
          }))
        : [],
    })),
  };
};

exports.createMealPlan = async (req, res) => {
  try {
    const user = req.user;
    const planRequest = buildPlanRequest(req.body);

    // Fetch last 10 plans for long-term personalization
    const historyPlans = await MealPlan.find({ user: user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    const history = extractHistory(historyPlans);
    const aiContext = buildAIContext(historyPlans, user);

    let plan;
    let isAIGenerated = false;
    let source = "generated";
    let generatedBy = "deterministic";
    let variationId = "";

    if (user.isPremium) {
      const cacheKey = buildCacheKey(user.id, planRequest.goal, planRequest.preferences);
      const cachedPlan = await MealPlan.findOne({ user: user.id, cacheKey, source: "ai" });

      if (cachedPlan && !isCacheExpired(cachedPlan)) {
        return res.status(200).json({ success: true, data: cachedPlan });
      }

      const { aiUsageCount, user: currentUser } = await checkAndResetAIUsage(user.id);
      const maxCalls = currentUser.isPremium ? 50 : 2;

      if (aiUsageCount >= maxCalls) {
        return res.status(429).json({
          success: false,
          error: "AI generation limit reached for today",
        });
      }

      try {
        plan = await generateAIPlan(planRequest, { ...history, ...aiContext });
        plan = normalizeAIMealPlan(plan);
        isAIGenerated = true;
        source = "ai";
        generatedBy = "ai";
        variationId = `ai-${Date.now()}`;
      } catch (aiError) {
        logger.warn("AI plan failed, falling back to deterministic plan", aiError.message);
        plan = generateWeeklyPlan({ ...planRequest, isPremium: false });
      }

      if (isAIGenerated) {
        await incrementAIUsage(user.id, aiUsageCount);
      }

      const saved = await MealPlan.create({
        user: user.id,
        goal: planRequest.goal,
        calories: planRequest.calories,
        macros: planRequest.macros,
        weeklyPlan: plan.weeklyPlan,
        isAIGenerated,
        preferences: planRequest.preferences,
        source,
        cacheKey: isAIGenerated ? cacheKey : undefined,
        meta: {
          generatedBy,
          variationId,
        },
      });

      return res.status(201).json({ success: true, data: saved });
    } else {
      plan = generateWeeklyPlan({ ...planRequest, isPremium: false });
    }

    const saved = await MealPlan.create({
      user: user.id,
      goal: planRequest.goal,
      calories: planRequest.calories,
      macros: planRequest.macros,
      weeklyPlan: plan.weeklyPlan,
      isAIGenerated,
      preferences: planRequest.preferences,
      source,
      meta: {
        generatedBy,
        variationId,
      },
    });

    // Update user preferences (optional for future)
    await User.findByIdAndUpdate(user.id, {
      $set: {
        "preferences.dietType": planRequest.preferences.dietType,
        "preferences.excludedFoods": planRequest.preferences.excludedFoods,
      },
    });

    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    logger.error("Meal plan generation failed:", err);
    return res.status(500).json({
      success: false,
      error: "Meal plan generation failed",
    });
  }
};

exports.getMealPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: plans });
  } catch (err) {
    logger.error("Get meal plans failed:", err);
    return res.status(500).json({ success: false, error: "Unable to load meal plans" });
  }
};

exports.getGroceryList = async (req, res) => {
  try {
    const plan = await MealPlan.findOne({ _id: req.params.id, user: req.user.id });

    if (!plan) {
      return res.status(404).json({ success: false, error: "Meal plan not found" });
    }

    const groceries = generateGroceryList(plan);
    return res.status(200).json({ success: true, data: groceries });
  } catch (err) {
    logger.error("Get grocery list failed:", err);
    return res.status(500).json({ success: false, error: "Unable to generate grocery list" });
  }
};

exports.shareMealPlan = async (req, res) => {
  try {
    const plan = await MealPlan.findOne({ _id: req.params.id, user: req.user.id });

    if (!plan) {
      return res.status(404).json({ success: false, error: "Meal plan not found" });
    }

    plan.isPublic = true;
    await plan.save();

    const publicUrl = `${req.protocol}://${req.get("host")}/api/public/meal-plans/${plan._id}`;
    return res.status(200).json({ success: true, data: { publicUrl } });
  } catch (err) {
    logger.error("Share meal plan failed:", err);
    return res.status(500).json({ success: false, error: "Unable to share meal plan" });
  }
};

exports.getPublicMealPlan = async (req, res) => {
  try {
    const plan = await MealPlan.findOne({ _id: req.params.id, isPublic: true });

    if (!plan) {
      return res.status(404).json({ success: false, error: "Public meal plan not found" });
    }

    return res.status(200).json({ success: true, data: plan });
  } catch (err) {
    logger.error("Get public meal plan failed:", err);
    return res.status(500).json({ success: false, error: "Unable to load public meal plan" });
  }
};

exports.deleteMealPlan = async (req, res) => {
  try {
    const plan = await MealPlan.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!plan) {
      return res.status(404).json({ success: false, error: "Meal plan not found" });
    }

    return res.status(200).json({ success: true, data: { id: req.params.id } });
  } catch (err) {
    logger.error("Delete meal plan failed:", err);
    return res.status(500).json({ success: false, error: "Unable to delete meal plan" });
  }
};