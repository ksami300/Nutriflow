const Stripe = require("stripe");
const User = require("../models/User");
const paymentService = require("../services/paymentService");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 💳 CREATE CHECKOUT
exports.createCheckout = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await paymentService.createCheckoutSession(userId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.json({
      success: true,
      url: result.session.url,
    });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
    });
  }
};

// 💳 WEBHOOK
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await paymentService.handleWebhook(event);
    res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

// 🔥 WEBHOOK (AUTOMATIC PREMIUM)
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 💰 SUCCESS PAYMENT
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;

    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      stripeCustomerId: session.customer,
    });

    console.log("✅ USER UPGRADED TO PREMIUM:", userId);
  }

  // 🔴 SUBSCRIPTION CANCELED
  if (event.type === "customer.subscription.deleted") {
    // Optional: handle cancellation
    console.log("Subscription canceled:", event.data.object);
  }

  res.json({ received: true });
};