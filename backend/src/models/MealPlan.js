import mongoose from "mongoose";

const mealPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    goal: {
      type: String,
      enum: ["lose", "gain", "maintain"],
      required: true
    },
    calories: {
      type: Number,
      required: true
    },
    bmr: {
      type: Number,
      required: true
    },
    tdee: {
      type: Number,
      required: true
    },
    metrics: {
      weight: { type: Number, required: true },
      height: { type: Number, required: true },
      age: { type: Number, required: true },
      gender: { type: String, enum: ["male", "female"], required: true },
      activityLevel: { type: String, required: true }
    },
    meals: [
      {
        name: String,
        calories: Number,
        category: { type: String, enum: ["breakfast", "lunch", "snacks", "dinner"] },
        targetCalories: Number
      }
    ]
  },
  { timestamps: true }
);

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);

export default MealPlan;