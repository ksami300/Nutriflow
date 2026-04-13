const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  isPremium: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);