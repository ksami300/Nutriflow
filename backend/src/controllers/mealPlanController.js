import MealPlan from "../models/MealPlan.js";

// Calculate BMR using Mifflin-St Jeor formula
const calculateBMR = (weight, height, age, gender) => {
  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  return Math.round(bmr);
};

// Calculate TDEE based on activity level
const calculateTDEE = (bmr, activityLevel) => {
  const activityMultipliers = {
    sedentary: 1.2,      // Little or no exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725,       // Hard exercise 6-7 days/week
    veryActive: 1.9      // Very hard exercise/physical job
  };
  
  const multiplier = activityMultipliers[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
};

// Generate realistic meal plan
const generateMealPlan = (totalCalories, goal) => {
  let meals = {};
  
  // Distribute calories: breakfast 25%, lunch 35%, snacks 10%, dinner 30%
  const breakfastCals = Math.round(totalCalories * 0.25);
  const lunchCals = Math.round(totalCalories * 0.35);
  const snacksCals = Math.round(totalCalories * 0.1);
  const dinnerCals = Math.round(totalCalories * 0.3);
  
  const mealOptions = {
    breakfast: [
      { name: "Oatmeal with berries and honey", calories: 380 },
      { name: "Eggs scrambled with whole wheat toast", calories: 420 },
      { name: "Greek yogurt with granola and almonds", calories: 350 },
      { name: "Pancakes with banana and peanut butter", calories: 450 }
    ],
    lunch: [
      { name: "Grilled chicken breast with rice and vegetables", calories: 650 },
      { name: "Salmon with sweet potato and broccoli", calories: 720 },
      { name: "Turkey sandwich with salad", calories: 550 },
      { name: "Beef stir-fry with noodles", calories: 780 }
    ],
    snacks: [
      { name: "Protein bar", calories: 200 },
      { name: "Apple with almond butter", calories: 180 },
      { name: "Mixed nuts", calories: 160 },
      { name: "Greek yogurt", calories: 120 }
    ],
    dinner: [
      { name: "Grilled fish with potatoes and green beans", calories: 700 },
      { name: "Lean ground beef with pasta and tomato sauce", calories: 750 },
      { name: "Baked chicken with rice and roasted vegetables", calories: 680 },
      { name: "Pork chops with sweet potato", calories: 720 }
    ]
  };
  
  // Select random meal from each category
  meals.breakfast = {
    ...mealOptions.breakfast[Math.floor(Math.random() * mealOptions.breakfast.length)],
    category: "breakfast",
    targetCalories: breakfastCals
  };
  
  meals.lunch = {
    ...mealOptions.lunch[Math.floor(Math.random() * mealOptions.lunch.length)],
    category: "lunch",
    targetCalories: lunchCals
  };
  
  meals.snacks = {
    ...mealOptions.snacks[Math.floor(Math.random() * mealOptions.snacks.length)],
    category: "snacks",
    targetCalories: snacksCals
  };
  
  meals.dinner = {
    ...mealOptions.dinner[Math.floor(Math.random() * mealOptions.dinner.length)],
    category: "dinner",
    targetCalories: dinnerCals
  };
  
  return meals;
};

// CREATE PLAN
export const createMealPlan = async (req, res) => {
  try {
    const { goal, weight = 75, height = 180, age = 30, gender = "male", activityLevel = "moderate" } = req.body;

    if (!goal) {
      return res.status(400).json({ message: "Goal is required" });
    }

    // Check free plan limit (only 1 for free users)
    const count = await MealPlan.countDocuments({
      user: req.user._id,
    });

    if (!req.user.isPremium && count >= 1) {
      return res.status(403).json({
        message: "Free plan limit reached. Upgrade to premium for unlimited plans.",
        isPremium: false,
        maxPlans: 1
      });
    }

    // Calculate BMR and TDEE
    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    
    // Adjust for goal
    let targetCalories = tdee;
    if (goal === "lose") {
      targetCalories = Math.round(tdee * 0.85); // 15% deficit
    } else if (goal === "gain") {
      targetCalories = Math.round(tdee * 1.15); // 15% surplus
    }
    
    // Generate structured meal plan
    const mealBreakdown = generateMealPlan(targetCalories, goal);
    
    const plan = await MealPlan.create({
      user: req.user._id,
      goal,
      calories: targetCalories,
      bmr,
      tdee,
      metrics: { weight, height, age, gender, activityLevel },
      meals: [
        mealBreakdown.breakfast,
        mealBreakdown.lunch,
        mealBreakdown.snacks,
        mealBreakdown.dinner
      ]
    });

    res.status(201).json({
      message: "Meal plan created successfully",
      plan: {
        id: plan._id,
        goal: plan.goal,
        totalCalories: plan.calories,
        bmr: plan.bmr,
        tdee: plan.tdee,
        meals: plan.meals,
        createdAt: plan.createdAt
      }
    });
  } catch (error) {
    console.error("Create meal plan error:", error);
    res.status(500).json({ message: "Failed to create meal plan", error: error.message });
  }
};

// GET PLANS
export const getMealPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      plans,
      count: plans.length,
      isPremium: req.user.isPremium
    });
  } catch (error) {
    console.error("Get meal plans error:", error);
    res.status(500).json({ message: "Failed to fetch meal plans", error: error.message });
  }
};

// DELETE PLAN
export const deleteMealPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await MealPlan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this plan" });
    }

    await MealPlan.findByIdAndDelete(id);

    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Delete meal plan error:", error);
    res.status(500).json({ message: "Failed to delete meal plan", error: error.message });
  }
};