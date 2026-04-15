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
    stripeCustomerId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);