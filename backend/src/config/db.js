const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection.asPromise();
  }

  mongoose.set("strictQuery", false);

  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    throw error;
  }
};

module.exports = connectDB;
