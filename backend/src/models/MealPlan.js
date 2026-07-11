const mongoose = require("mongoose");

const mealFoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["breakfast", "snack", "lunch", "dinner", "all"],
      default: "all",
    },
    grams: { type: Number, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
  },
  { _id: false }
);

const mealSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["breakfast", "snack1", "lunch", "snack2", "dinner"],
      required: true,
    },
    name: { type: String, required: true, trim: true },
    foods: {
      type: [mealFoodSchema],
      default: [],
    },
    totals: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
    },
    target: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
    },
  },
  { _id: false }
);

const mealPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    goal: {
      type: String,
      enum: ["lose", "gain", "maintain"],
      required: true,
    },
    calories: { type: Number, required: true },
    macros: {
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fat: { type: Number, required: true },
    },
    weeklyPlan: {
      type: [
        {
          day: { type: String, required: true, trim: true },
          meals: {
            type: [mealSchema],
            default: [],
          },
        },
      ],
      default: [],
    },
    isAIGenerated: { type: Boolean, default: false },
    preferences: {
      dietType: {
        type: String,
        enum: ["standard", "keto", "vegan", "high-protein"],
        default: "standard",
      },
      excludedFoods: {
        type: [String],
        default: [],
      },
    },
    source: {
      type: String,
      enum: ["generated", "ai", "manual"],
      default: "generated",
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },
    cacheKey: {
      type: String,
      index: true,
      sparse: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    meta: {
      generatedBy: {
        type: String,
        enum: ["ai", "deterministic"],
        default: "deterministic",
      },
      variationId: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealPlan", mealPlanSchema);
