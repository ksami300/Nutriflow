const Stripe = require("stripe");
const paymentService = require("../services/paymentService");
const logger = require("../utils/logger");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// =======================
// CREATE CHECKOUT
// =======================

exports.createCheckout = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await paymentService.createCheckoutSession(userId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.message,
      });
    }

    // ✅ FIX: koristi result.url
    return res.status(200).json({
      success: true,
      data: {
        url: result.url,
      },
    });
  } catch (err) {
    logger.error("Stripe checkout error:", err);

    return res.status(500).json({
      success: false,
      error: "Failed to create checkout session",
    });
  }
};

// =======================
// SUBSCRIPTION STATUS
// =======================

exports.getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await paymentService.getSubscriptionStatus(userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    logger.error("Subscription status error:", err);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch subscription status",
    });
  }
};

// =======================
// STRIPE WEBHOOK
// =======================

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    logger.error("Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await paymentService.handleWebhook(event);
    return res.json({ received: true });
  } catch (err) {
    logger.error("Webhook processing error:", err);

    return res.status(500).json({
      success: false,
      error: "Webhook processing failed",
    });
  }
};