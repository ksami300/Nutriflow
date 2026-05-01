const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const env = require("./config/envConfig");
const logger = require("./utils/logger");

const authRoutes = require("./routes/authRoutes");
const mealPlanRoutes = require("./routes/mealPlanRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const healthRoutes = require("./routes/healthRoutes");
const { stripeWebhook } = require("./controllers/paymentController");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(morgan("combined", { stream: logger.stream }));

const corsOptions = {
  origin: [env.FRONTEND_URL, "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(cookieParser());

app.post("/api/payments/webhook", express.raw({ type: "application/json" }), stripeWebhook);
app.use(apiLimiter);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/meal-plans", mealPlanRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/health", healthRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
