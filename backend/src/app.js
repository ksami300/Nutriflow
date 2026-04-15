const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// 🔐 CORS CONFIGURATION
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ❗ WEBHOOK MORA PRE JSON PARSERA (raw body)
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const { stripeWebhook } = require("./controllers/paymentController");
  stripeWebhook(req, res);
});

// ❗ NORMAL JSON ZA API
app.use("/api", express.json());

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/meal-plans", require("./routes/mealPlanRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/health", require("./routes/healthRoutes"));

app.get("/", (req, res) => {
  res.send("API WORKING 🚀");
});

// 🔥 GLOBAL ERROR HANDLER (mora biti na kraju)
app.use(errorHandler);

module.exports = app;