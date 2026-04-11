import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";

const app = express();

// 🔐 SECURITY
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// 📊 LOGGER
app.use(morgan("dev"));

// 🌍 CORS
app.use(cors());

// 📦 BODY
app.use(express.json());

// 🚀 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/meal-plans", mealPlanRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/health", healthRoutes);

// ❤️ HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "NutriFlow API is running" });
});

// GLOBAL ERROR HANDLER
app.use(errorHandler);

export default app;