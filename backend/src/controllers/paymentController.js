const Stripe = require("stripe");
const paymentService = require("../services/paymentService");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckout = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await paymentService.createCheckoutSession(userId);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.json({ success: true, url: result.session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ success: false, message: "Failed to create checkout session" });
  }
};

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