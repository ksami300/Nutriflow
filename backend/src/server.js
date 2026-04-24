const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();

// =======================
// CORS
// =======================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// =======================
// MIDDLEWARE
// =======================
app.use(express.json());

// =======================
// OPENAI INIT (SAFE)
// =======================
let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn("⚠️ OPENAI_API_KEY not set — AI disabled");
}

// =======================
// ROUTES
// =======================

// ROOT
app.get("/", (req, res) => {
  res.send("NutriFlow API working 🚀");
});

// HEALTHCHECK (Railway)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// TEST API
app.get("/api/test", (req, res) => {
  res.status(200).json({
    message: "API works 🚀"
  });
});

// LOGIN (demo)
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "demo@example.com" && password === "password123") {
    return res.status(200).json({
      token: "test-token-123"
    });
  }

  return res.status(401).json({
    message: "Invalid credentials"
  });
});

// =======================
// 🔥 GENERATE PLAN ROUTE
// =======================
app.post("/api/generate-plan", async (req, res) => {
  try {
    const { goal, weight, height, activity } = req.body;

    // fallback ako nema OpenAI
    if (!openai) {
      return res.status(200).json({
        plan: `
🎯 Goal: ${goal}

🥗 Breakfast:
- Oatmeal + banana + peanut butter

🍗 Lunch:
- Chicken + rice + vegetables

🥚 Dinner:
- Eggs + avocado + toast

🔥 Calories: ~2000 kcal
💧 Water: 2.5L
        `
      });
    }

    const prompt = `
Create a clean nutrition plan.

User:
Goal: ${goal}
Weight: ${weight}kg
Height: ${height}cm
Activity: ${activity}

Return:
Breakfast, Lunch, Dinner, Calories, Water
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional nutritionist." },
        { role: "user", content: prompt },
      ],
    });

    const result = completion.choices[0].message.content;

    res.status(200).json({ plan: result });

  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({
      message: "AI error"
    });
  }
});
// =======================
// 🧠 SAVE PLAN (in-memory DB)
// =======================
let plansDB = [];

app.post("/api/save-plan", (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({ message: "Plan is required" });
    }

    const newPlan = {
      id: Date.now(),
      plan,
      createdAt: new Date(),
    };

    plansDB.push(newPlan);

    res.status(200).json({
      message: "Plan saved",
      data: newPlan,
    });

  } catch (err) {
    res.status(500).json({ message: "Save failed" });
  }
});

// =======================
// 📜 GET HISTORY
// =======================
app.get("/api/plans", (req, res) => {
  res.status(200).json(plansDB);
});
// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});