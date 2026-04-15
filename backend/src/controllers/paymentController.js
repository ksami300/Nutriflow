const Stripe = require("stripe");
const User = require("../models/User");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 💳 CREATE CHECKOUT
exports.createCheckout = async (req, res) => {
  try {
    const userId = req.user.id;

    // Учитај корисника да добијеш email
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "NutriFlow Premium",
            },
            unit_amount: 999, // 9.99€
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard`,
      metadata: {
        userId: user._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ message: "Stripe error" });
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