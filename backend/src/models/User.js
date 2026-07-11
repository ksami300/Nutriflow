const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    referralCode: {
      type: String,
      trim: true,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
      select: false,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: Date,

    stripeCustomerId: {
      type: String,
      unique: true,
      sparse: true,
    },

    aiUsageCount: {
      type: Number,
      default: 0,
    },
    aiUsageDate: {
      type: Date,
      default: () => new Date(),
    },

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
      likedMeals: {
        type: [String],
        default: [],
      },
      dislikedMeals: {
        type: [String],
        default: [],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
