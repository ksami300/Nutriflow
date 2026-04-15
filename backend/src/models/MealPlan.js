const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  name: String,
  calories: Number,
});

const mealPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    goal: String,
    calories: Number,
    bmr: Number,
    tdee: Number,

    // 🔥 PREMIUM MACROS
    protein: Number,
    carbs: Number,
    fats: Number,

    meals: [mealSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealPlan", mealPlanSchema);