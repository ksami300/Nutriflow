const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection.asPromise();
  }

  mongoose.set("strictQuery", false);

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

module.exports = connectDB;
