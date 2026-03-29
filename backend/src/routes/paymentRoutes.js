import express from "express";
import Stripe from "stripe";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is required");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CREATE CHECKOUT SESSION
router.post("/create-checkout-session", protect, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "NutriFlow Premium 💎"
            },
            unit_amount: 999, // 9.99€
            recurring: {
              interval: "month"
            }
          },
          quantity: 1
        }
      ],
      success_url: process.env.STRIPE_SUCCESS_URL || "http://localhost:3000/success",
      cancel_url: process.env.STRIPE_CANCEL_URL || "http://localhost:3000/cancel"
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error("STRIPE ERROR:", error);
    res.status(500).json({ message: "Stripe error" });
  }
});

export default router;