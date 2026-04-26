const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Stripe = require("stripe");
const OpenAI = require("openai");

// Load environment variables
dotenv.config();

const app = express();

// Configuration
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Environment variable validation
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// CORS Configuration
const corsOptions = {
  origin: FRONTEND_URL === "*" ? "*" : [FRONTEND_URL, "http://localhost:3000"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Initialize OpenAI (with null safety)
const openaiClient = OPENAI_API_KEY
  ? new OpenAI({ apiKey: OPENAI_API_KEY })
  : null;

// Initialize Stripe (with null safety)
const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-08-16" })
  : null;

// In-memory user tracking (production: use database)
const users = {};

// Helper: Get or create user
const getOrCreateUser = (userId) => {
  if (!users[userId]) {
    users[userId] = {
      id: userId,
      count: 0,
      isPremium: false,
      createdAt: new Date().toISOString(),
    };
  }
  return users[userId];
};

// Helper: Generate demo plan (fallback when OpenAI unavailable)
const generateDemoPlan = (goal, weight, height, activity) => {
  return `PERSONALIZED NUTRITION PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Goal: ${goal}
Weight: ${weight} kg
Height: ${height} cm
Activity Level: ${activity}

BREAKFAST (7:00 AM)
• Oatmeal (50g) with berries and almonds
• 1 banana
• Greek yogurt (150g)
• Green tea

LUNCH (12:30 PM)
• Grilled chicken breast (150g)
• Brown rice (100g)
• Mixed vegetables (200g)
• Olive oil dressing

SNACK (3:00 PM)
• Apple
• Almonds (30g)
• Water

DINNER (7:00 PM)
• Salmon (150g)
• Sweet potato (150g)
• Broccoli (200g)
• Lemon juice

HYDRATION
• Drink 2-3 liters of water daily
• Limit caffeine
• No sugary drinks

SUMMARY
• Estimated daily calories: 2,200
• Protein: 150g
• Carbs: 250g
• Fat: 70g

This is a fallback plan. For personalized recommendations, ensure OPENAI_API_KEY is configured.`;
};

// Routes

// Health check (for Railway)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "NutriFlow API 🚀",
    version: "1.0.0",
    endpoints: [
      "GET /health",
      "POST /api/generate-plan",
      "POST /api/create-checkout-session",
      "POST /api/upgrade",
      "GET /api/user-status",
    ],
  });
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "API works 🚀", timestamp: new Date().toISOString() });
});

// GET user status
app.get("/api/user-status", (req, res) => {
  const userId = req.headers["x-user-id"] || "guest";
  const user = getOrCreateUser(userId);

  res.json({
    userId,
    ...user,
  });
});

// POST: Generate AI-based nutrition plan
app.post("/api/generate-plan", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || `guest_${Date.now()}`;
    const { goal, weight, height, activity } = req.body;

    // Validate input
    if (!goal || !weight || !height || !activity) {
      return res.status(400).json({
        error: "Missing required fields: goal, weight, height, activity",
      });
    }

    // Get or create user
    const user = getOrCreateUser(userId);

    // Check free tier limit (3 plans per user)
    if (!user.isPremium && user.count >= 3) {
      return res.status(403).json({
        error: "Free limit reached (3 plans). Upgrade to premium for unlimited access.",
        isPremium: user.isPremium,
        used: user.count,
      });
    }

    // Increment usage counter
    user.count++;

    // If OpenAI not available, return demo plan
    if (!openaiClient) {
      const demoplan = generateDemoPlan(goal, weight, height, activity);
      return res.json({ plan: demoplan, isDemo: true });
    }

    // Call OpenAI API
    try {
      const completion = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a professional certified nutritionist specializing in personalized meal planning. Create detailed, practical, and safe nutrition plans based on user goals.",
          },
          {
            role: "user",
            content: `Create a detailed daily nutrition plan with the following specifications:
- Goal: ${goal}
- Current Weight: ${weight} kg
- Height: ${height} cm
- Activity Level: ${activity}

Please include:
1. Breakfast, lunch, dinner, and 2 snacks with specific portions
2. Estimated daily calories and macronutrients
3. Hydration recommendations
4. Tips for success
5. Foods to avoid`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const plan = completion.choices[0]?.message?.content || generateDemoPlan(goal, weight, height, activity);

      res.json({
        plan,
        isDemo: false,
        userCount: user.count,
        isPremium: user.isPremium,
      });
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError.message);
      // Fallback to demo plan if API fails
      const demoplan = generateDemoPlan(goal, weight, height, activity);
      res.json({
        plan: demoplan,
        isDemo: true,
        warning: "Using demo plan due to API error",
      });
    }
  } catch (error) {
    console.error("Generate plan error:", error);
    res.status(500).json({
      error: "Failed to generate plan",
      message: error.message,
    });
  }
});

// POST: Create Stripe checkout session
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    // Validate Stripe is configured
    if (!stripe) {
      return res.status(503).json({
        error: "Payment service unavailable",
        message: "Stripe is not configured. Contact support.",
      });
    }

    // Validate frontend URL is set
    if (!FRONTEND_URL || FRONTEND_URL === "*") {
      return res.status(500).json({
        error: "Configuration error",
        message: "FRONTEND_URL is not properly configured.",
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      client_reference_id: req.headers["x-user-id"] || "guest",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "NutriFlow Premium - Monthly",
              description: "Unlimited AI nutrition plans + personalized coaching",
            },
            unit_amount: 999, // €9.99
          },
          quantity: 1,
        },
      ],
      success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/cancel`,
      customer_email: req.body?.email || undefined,
    });

    if (!session.url) {
      throw new Error("Stripe session URL not generated");
    }

    res.status(200).json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({
      error: "Payment session creation failed",
      message: error.message,
    });
  }
});

// POST: Manually upgrade user (for testing)
app.post("/api/upgrade", (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || "guest";
    const user = getOrCreateUser(userId);

    user.isPremium = true;
    user.upgradedAt = new Date().toISOString();

    res.json({
      message: "User upgraded to premium 🎉",
      user,
    });
  } catch (error) {
    console.error("Upgrade error:", error);
    res.status(500).json({
      error: "Upgrade failed",
      message: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`✅ NutriFlow API Server`);
  console.log(`📍 Listening on http://${HOST}:${PORT}`);
  console.log(`🌍 Frontend URL: ${FRONTEND_URL}`);
  console.log(`🤖 OpenAI: ${OPENAI_API_KEY ? "✓ Configured" : "✗ Not configured"}`);
  console.log(`💳 Stripe: ${STRIPE_SECRET_KEY ? "✓ Configured" : "✗ Not configured"}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  process.exit(0);
});