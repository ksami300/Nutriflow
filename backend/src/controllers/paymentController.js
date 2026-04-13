import Stripe from "stripe";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export const createCheckout = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription", // 🔥 SUBSCRIPTION
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "NutriFlow Premium Monthly" },
          unit_amount: 999, // $9.99
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    success_url: "http://localhost:3000/dashboard?success=true",
    cancel_url: "http://localhost:3000/dashboard",
  });

  res.json({ url: session.url });
};

// webhook (kasnije real Stripe verify)
export const upgradePremium = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { isPremium: true });
  res.json({ message: "Premium active" });
};