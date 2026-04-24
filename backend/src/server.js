const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");
const jwt = require("jsonwebtoken");
const Stripe = require("stripe");

const app = express();

// =======================
// CONFIG
// =======================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// =======================
// MIDDLEWARE
// =======================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// =======================
// FAKE DATABASE (kasnije Mongo)
// =======================
let users = [
  {
    id: 1,
    email: "demo@example.com",
    password: "password123",
    isPremium: false,
    usage: 0
  }
];

// =======================
// AUTH MIDDLEWARE
// =======================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = users.find(u => u.id === decoded.id);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// =======================
// ROUTES
// =======================

// ROOT
app.get("/", (req, res) => {
  res.send("NutriFlow API 🚀");
});

// HEALTH
app.get("/health", (req, res) => {
  res.send("OK");
});

// REGISTER
app.post("/api/auth/register", (req, res) => {
  const { email, password } = req.body;

  const user = {
    id: Date.now(),
    email,
    password,
    isPremium: false,
    usage: 0
  };

  users.push(user);

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.json({ token });
});

// LOGIN
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.json({ token });
});

// =======================
// 🔥 GENERATE PLAN (WITH LIMIT)
// =======================
app.post("/api/generate-plan", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    // 🚫 FREE LIMIT
    if (!user.isPremium && user.usage >= 1) {
      return res.status(403).json({
        message: "Free limit reached. Upgrade to premium."
      });
    }

    const { goal, weight, height, activity } = req.body;

    const prompt = `
Create a personalized daily nutrition plan.

Goal: ${goal}
Weight: ${weight}
Height: ${height}
Activity: ${activity}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a nutrition expert." },
        { role: "user", content: prompt },
      ],
    });

    const plan = completion.choices[0].message.content;

    user.usage += 1;

    res.json({ plan });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating plan" });
  }
});

// =======================
// 💰 STRIPE
// =======================
app.post("/api/create-checkout-session", authMiddleware, async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "NutriFlow Premium",
          },
          unit_amount: 500,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
  });

  res.json({ url: session.url });
});

// =======================
// 🔥 SIMULACIJA PREMIUM (ZA TEST)
// =======================
app.post("/api/upgrade", authMiddleware, (req, res) => {
  req.user.isPremium = true;
  res.json({ message: "Upgraded!" });
});

// =======================
// START
// =======================
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server running on " + PORT);
});