const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const Stripe = require("stripe");

dotenv.config();

const app = express();

// =======================
// CONFIG
// =======================
app.use(cors());
app.use(express.json());

const users = {};

// OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// =======================
// ROUTES
// =======================

app.get("/", (req, res) => {
  res.send("NutriFlow API working 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API works 🚀" });
});

// =======================
// GENERATE PLAN (LIMIT)
// =======================
app.post("/api/generate-plan", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || "guest";

    if (!users[userId]) {
      users[userId] = { count: 0, isPremium: false };
    }

    if (!users[userId].isPremium && users[userId].count >= 3) {
      return res.status(403).json({
        message: "Free limit reached. Upgrade to premium.",
      });
    }

    users[userId].count++;

    const { goal, weight, height, activity } = req.body;

    // FALLBACK ako nema OpenAI
    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        plan: `
Breakfast: Oatmeal + banana  
Lunch: Chicken + rice  
Dinner: Eggs + salad  
Calories: 2200  
Water: 2.5L
        `,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional nutritionist." },
        {
          role: "user",
          content: `
Create a daily nutrition plan.

Goal: ${goal}
Weight: ${weight}
Height: ${height}
Activity: ${activity}
          `,
        },
      ],
    });

    const result = completion.choices[0].message.content;

    res.json({ plan: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI error" });
  }
});

// =======================
// STRIPE CHECKOUT
// =======================
app.post("/api/create-checkout-session", async (req, res) => {
  try {
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
            unit_amount: 500, // 5€
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Stripe error" });
  }
});

// =======================
// UPGRADE (manual test)
// =======================
app.post("/api/upgrade", (req, res) => {
  const userId = req.headers["x-user-id"] || "guest";

  if (!users[userId]) {
    users[userId] = { count: 0, isPremium: false };
  }

  users[userId].isPremium = true;

  res.json({ message: "Upgraded 🚀" });
});

// =======================
// START
// =======================
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});