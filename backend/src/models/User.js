const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    },
    referralCode: String,

    // 🔒 PREMIUM FLAG
    isPremium: {
      type: Boolean,
      default: false,
    },

    // 💳 STRIPE
    stripeCustomerId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ stripeCustomerId: 1 });

module.exports = mongoose.model("User", userSchema);