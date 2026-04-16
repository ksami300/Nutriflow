const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const mealPlanRoutes = require("./routes/mealPlanRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const healthRoutes = require("./routes/healthRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// ✅ CORS (koristi FRONTEND_URL iz .env)
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

// ❗ STRIPE WEBHOOK MORA PRE express.json()
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const { stripeWebhook } = require("./controllers/paymentController");
    stripeWebhook(req, res);
  }
);

// ✅ TEK POSLE ide JSON parser
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/meal-plans", mealPlanRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/health", healthRoutes);

// ================= ERRORS =================
app.use(notFound);
app.use(errorHandler);

module.exports = app;