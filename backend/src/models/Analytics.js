import mongoose from "mongoose";

const schema = new mongoose.Schema({
  user: String,
  action: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Analytics", schema);