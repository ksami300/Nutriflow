const MealPlan = require("../models/MealPlan");
const User = require("../models/User");

// 🧠 CALCULATION FUNCTIONS
const calculateBMR = (weight, height, age, gender) => {
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

const activityMultiplier = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9
};

const calculateCalories = (bmr, activityLevel, goal) => {
  let tdee = bmr * (activityMultiplier[activityLevel] || 1.2);

  if (goal === "lose") return Math.round(tdee * 0.85);
  if (goal === "gain") return Math.round(tdee * 1.15);
  return Math.round(tdee);
};

// 🍽️ SIMPLE MEAL DB
const mealsDB = [
  { name: "Eggs & Toast", calories: 400, category: "breakfast" },
  { name: "Oatmeal + Banana", calories: 350, category: "breakfast" },
  { name: "Chicken Rice Bowl", calories: 700, category: "lunch" },
  { name: "Beef + Potatoes", calories: 800, category: "lunch" },
  { name: "Protein Shake", calories: 250, category: "snack" },
  { name: "Greek Yogurt", calories: 200, category: "snack" },
  { name: "Salmon + Veggies", calories: 600, category: "dinner" },
  { name: "Pasta + Chicken", calories: 700, category: "dinner" }
];

// 🎯 GENERATE PLAN
exports.generatePlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { goal, weight, height, age, gender, activityLevel } = req.body;

    const user = await User.findById(userId);

    // 🔒 FREE LIMIT
    if (!user.isPremium) {
      const count = await MealPlan.countDocuments({ user: userId });

      if (count >= 1) {
        return res.status(403).json({
          message: "Free limit reached. Upgrade to Premium."
        });
      }
    }

    // 🧠 CALCULATIONS
    const bmr = calculateBMR(weight, height, age, gender);
    const calories = calculateCalories(bmr, activityLevel, goal);
    const tdee = Math.round(bmr * (activityMultiplier[activityLevel] || 1.2));

    // 🍽️ BUILD MEALS
    const selectedMeals = [
      mealsDB[0],
      mealsDB[2],
      mealsDB[4],
      mealsDB[6]
    ];

    // 💾 SAVE
    const plan = await MealPlan.create({
      user: userId,
      goal,
      calories,
      bmr: Math.round(bmr),
      tdee,
      meals: selectedMeals
    });

    res.status(201).json(plan);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📦 GET PLANS
exports.getPlans = async (req, res) => {
  try {
    const userId = req.user.id;

    const plans = await MealPlan.find({ user: userId }).sort({ createdAt: -1 });
    const user = await User.findById(userId);

    res.json({
      plans,
      isPremium: user.isPremium
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching plans" });
  }
};

// ❌ DELETE
exports.deletePlan = async (req, res) => {
  try {
    await MealPlan.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};