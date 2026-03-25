import MealPlan from "../models/MealPlan.js";
import User from "../models/User.js";

// 📌 CREATE PLAN
export const createMealPlan = async (req, res) => {
  try {
    const { goal } = req.body;

    // 🔍 koliko planova ima korisnik
    const count = await MealPlan.countDocuments({
      user: req.user._id,
    });

    // 🔒 LIMIT ZA FREE USERA
    if (!req.user.isPremium && count >= 3) {
      return res.status(403).json({
        message: "Free limit reached. Upgrade to premium.",
      });
    }

    // 🧠 LOGIKA (možeš kasnije da unaprediš)
    let calories = 2000;

    if (goal === "lose") calories = 1800;
    if (goal === "gain") calories = 2500;

    const meals = [
      { name: "Ovsena kaša", calories: 400 },
      { name: "Piletina + pirinač", calories: 700 },
      { name: "Jaja + povrće", calories: 500 },
    ];

    const plan = await MealPlan.create({
      user: req.user._id,
      goal,
      calories,
      meals,
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 GET PLANS
export const getMealPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};