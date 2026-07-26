const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const sanitizeHtml = require("sanitize-html");

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

// 🔥 UVOZ SENTRY ERROR TRACKING PODSISTEMA
const { sentryErrorHandler } = require("./middleware/sentryMiddleware");

const app = express();

app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("combined", { stream: logger.stream }));

// ✅ Otvorene mrežne kapije za lokalni saobraćaj i spajanje Windows/WSL-a
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// ✅ STRIPE WEBHOOK PRIMA SIROVE BAJTOVE PRE JSON PARSERA
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize());

const sanitizeObject = (value) => {
  if (typeof value === "string") return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
  if (Array.isArray(value)) return value.map(sanitizeObject);
  if (value && typeof value === "object") {
    return Object.entries(value).reduce((acc, [key, item]) => { acc[key] = sanitizeObject(item); return acc; }, {});
  }
  return value;
};

app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") req.body = sanitizeObject(req.body);
  next();
});
app.use(hpp());
app.use(apiLimiter);

// ======================================================================
// 🌐 KRUNSKA BAZNA RUTA (Potvrda rada servera za diplomsku komisiju)
// ======================================================================
app.get("/", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "NutriFlow Backend API is running successfully in production-ready mode",
    version: "1.0.0",
    status: "healthy"
  });
});

// =======================
// API ROUTES MAPIRANJE
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/meal-plans", mealPlanRoutes);
app.use("/api/public", publicMealPlanRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/health", healthRoutes);

app.use(notFound);

// 🛡️ SENTRY PRESRETAČ GREŠAKA (Mora biti postavljen tačno ovde pre finalnog handlera!)
app.use(sentryErrorHandler);

app.use(errorHandler);

module.exports = app;
