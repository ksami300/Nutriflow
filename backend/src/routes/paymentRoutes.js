import express from "express";
import Stripe from "stripe";
import User from "../models/User.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const getStripeClient = () => {
  if (!stripe) {
    throw new Error("STRIPE_SECRET_KEY is required");
  }
  return stripe;
}

// CREATE CHECKOUT SESSION
router.post("/create-checkout-session", protect, async (req, res) => {
  try {
    const stripeClient = getStripeClient();
    
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "NutriFlow Premium"
            },
            unit_amount: 999, // 9.99€
            recurring: {
              interval: "month"
            }
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard?payment=cancelled`,
      client_reference_id: req.user._id.toString()
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ message: "Failed to create checkout session", error: error.message });
  }
});

// UPGRADE TO PREMIUM (Direct backend upgrade - for testing)
router.post("/upgrade-premium", protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { isPremium: true }, { new: true });
    
    res.json({
      message: "Premium upgrade successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    console.error("Upgrade error:", error);
    res.status(500).json({ message: "Failed to upgrade to premium", error: error.message });
  }
});

export default router;