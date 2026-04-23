const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();

// ✅ CORS (jedan, čist)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// ✅ Middleware
app.use(express.json());

// =======================
// OPENAI
// =======================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =======================
// ROUTES
// =======================

// ROOT
app.get("/", (req, res) => {
  res.send("NutriFlow API working 🚀");
});

// HEALTHCHECK (Railway koristi ovo)
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
// 🔥 AI GENERATE PLAN
// =======================
app.post("/api/generate-plan", async (req, res) => {
  try {
    const { goal, weight, height, activity } = req.body;

    const prompt = `
Create a personalized daily nutrition plan.

User:
- Goal: ${goal}
- Weight: ${weight}kg
- Height: ${height}cm
- Activity level: ${activity}

Return:
- Breakfast
- Lunch
- Dinner
- Calories
- Water intake

Keep it clean and structured.
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
// START SERVER
// =======================
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});