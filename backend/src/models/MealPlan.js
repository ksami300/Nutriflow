import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  name: String,
  calories: Number,
});

const mealPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    goal: String,
    calories: Number,
    bmr: Number,
    tdee: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    meals: [mealSchema],
  },
  { timestamps: true }
);

export default mongoose.model("MealPlan", mealPlanSchema);