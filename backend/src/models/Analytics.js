const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  user: String,
  action: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Analytics", analyticsSchema);