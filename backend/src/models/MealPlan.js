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
    meals: [
      {
        name: String,
        calories: Number
      }
    ]
  },
  { timestamps: true }
);

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);

export default MealPlan;