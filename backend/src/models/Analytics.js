import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  action: String,
}, { timestamps: true });

export default mongoose.model("Analytics", analyticsSchema);