const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
// ❌ xss-clean uklonjen (deprecated)
const hpp = require("hpp");
const sanitizeHtml = require("sanitize-html"); // ✅ NOVO

const env = require("./config/envConfig");
const logger = require("./utils/logger");

const authRoutes = require("./routes/authRoutes");
const mealPlanRoutes = require("./routes/mealPlanRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const healthRoutes = require("./routes/healthRoutes");
const publicMealPlanRoutes = require("./routes/publicMealPlanRoutes");

const { stripeWebhook } = require("./controllers/paymentController");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();

// =======================
// SECURITY
// =======================

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: false, // ✅ da ne blokira frontend
  })
);

// =======================
// LOGGING
// =======================

app.use(morgan("combined", { stream: logger.stream }));

// =======================
// CORS
// =======================

const allowedOrigins = [
  env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
  })
);

// =======================
// COOKIES
// =======================

app.use(cookieParser());

// =======================
// STRIPE WEBHOOK (RAW)
// =======================

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// =======================
// BODY PARSING
// =======================

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// =======================
// SANITIZATION (REPLACED xss-clean)
// =======================

app.use(mongoSanitize());

const sanitizeObject = (value) => {
  if (typeof value === "string") {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeObject);
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce((acc, [key, item]) => {
      acc[key] = sanitizeObject(item);
      return acc;
    }, {});
  }

  return value;
};

app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  next();
});

app.use(hpp());

// =======================
// RATE LIMIT
// =======================

app.use(apiLimiter);

// =======================
// ROUTES
// =======================

app.use("/api/auth", authRoutes);
app.use("/api/meal-plans", mealPlanRoutes);
app.use("/api/public", publicMealPlanRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/health", healthRoutes);

// =======================
// ERROR HANDLING
// =======================

app.use(notFound);
app.use(errorHandler);

module.exports = app;