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

    // PREMIUM
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

    // STRIPE
    stripeCustomerId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

// ❌ OBRISALI SMO DUPLE INDEXE

module.exports = mongoose.model("User", userSchema);