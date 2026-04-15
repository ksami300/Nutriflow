const MealPlan = require("../models/MealPlan");

exports.generatePlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { goal, weight, height, age, gender, activityLevel } = req.body;

    // Validation
    if (!goal || !weight || !height || !age || !gender || !activityLevel) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔒 FREE LIMIT
    const count = await MealPlan.countDocuments({ user: userId });

    if (!req.user.isPremium && count >= 3) {
      return res.status(403).json({
        message: "Free limit reached. Upgrade to premium.",
      });
    }

    // 🧠 BASIC CALCULATION
    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const activityMap = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const tdee = bmr * activityMap[activityLevel];

    let calories = tdee;
    if (goal === "lose") calories -= 500;
    if (goal === "gain") calories += 500;

    // 🍗 MACROS (SAMO PREMIUM)
    let protein = null;
    let carbs = null;
    let fats = null;

    if (req.user.isPremium) {
      protein = Math.round(weight * 2);
      fats = Math.round((calories * 0.25) / 9);
      carbs = Math.round((calories - protein * 4 - fats * 9) / 4);
    }

    const meals = [
      { name: "Chicken + Rice", calories: Math.round(calories * 0.3) },
      { name: "Eggs + Avocado", calories: Math.round(calories * 0.25) },
      { name: "Salmon + Potato", calories: Math.round(calories * 0.3) },
      { name: "Protein Shake", calories: Math.round(calories * 0.15) },
    ];

    const plan = await MealPlan.create({
      user: userId,
      goal,
      calories: Math.round(calories),
      bmr,
      tdee,
      protein,
      carbs,
      fats,
      meals,
    });

    res.json({ plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating plan" });
  }
};

exports.getPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      plans,
      isPremium: req.user.isPremium,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching plans" });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const plan = await MealPlan.findById(id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (plan.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await MealPlan.findByIdAndDelete(id);

    res.json({ message: "Plan deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting plan" });
  }
};