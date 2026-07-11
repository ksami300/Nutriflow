const Stripe = require("stripe");
const User = require("../models/User");
const logger = require("../utils/logger");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  async createCheckoutSession(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      let customerId = user.stripeCustomerId;

      // =======================
      // CUSTOMER
      // =======================
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: {
            userId: user._id.toString(),
          },
        });

        customerId = customer.id;
        user.stripeCustomerId = customerId;
        await user.save();
      }

      // =======================
      // SESSION
      // =======================
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        payment_method_types: ["card"],

        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: "NutriFlow Premium",
              },
              unit_amount: 999,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],

        success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
        cancel_url: `${process.env.FRONTEND_URL}/dashboard?canceled=true`,

        metadata: {
          userId: user._id.toString(),
        },
      });

      return {
        success: true,
        url: session.url, // 🔥 KLJUČNO za frontend
      };
    } catch (error) {
      logger.error("Stripe session error:", error);
      return {
        success: false,
        message: "Checkout session failed",
      };
    }
  }

  // =======================
  // STATUS
  // =======================

  async getSubscriptionStatus(userId) {
    const user = await User.findById(userId);

    return {
      success: true,
      isPremium: Boolean(user?.isPremium),
    };
  }

  // =======================
  // WEBHOOK
  // =======================

  async handleWebhook(event) {
    switch (event.type) {
      case "checkout.session.completed":
        await this.activatePremium(event.data.object);
        break;

      case "customer.subscription.deleted":
        await this.deactivatePremium(event.data.object);
        break;
    }
  }

  async activatePremium(session) {
    const userId = session.metadata.userId;

    const user = await User.findById(userId);
    if (!user) return;

    user.isPremium = true;
    await user.save();

    logger.info(`Premium activated: ${userId}`);
  }

  async deactivatePremium(subscription) {
    const customerId = subscription.customer;

    const user = await User.findOne({ stripeCustomerId: customerId });
    if (!user) return;

    user.isPremium = false;
    await user.save();

    logger.info(`Premium removed: ${user._id}`);
  }
}

module.exports = new PaymentService();