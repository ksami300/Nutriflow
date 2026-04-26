const Stripe = require("stripe");
const User = require("../models/User");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  async createCheckoutSession(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, message: "User not found" };
      }

      // Create or retrieve Stripe customer
      let customer;
      if (user.stripeCustomerId) {
        customer = await stripe.customers.retrieve(user.stripeCustomerId);
      } else {
        customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: {
            userId: user._id.toString(),
          },
        });
        user.stripeCustomerId = customer.id;
        await user.save();
      }

      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: "NutriFlow Premium",
                description: "Unlimited meal plans and premium features",
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

      return { success: true, session };
    } catch (error) {
      console.error("Create checkout session error:", error);
      return { success: false, message: "Failed to create checkout session" };
    }
  }

  async handleWebhook(event) {
    try {
      switch (event.type) {
        case "checkout.session.completed":
          await this.handleCheckoutCompleted(event.data.object);
          break;

        case "invoice.payment_succeeded":
          await this.handlePaymentSucceeded(event.data.object);
          break;

        case "invoice.payment_failed":
          await this.handlePaymentFailed(event.data.object);
          break;

        case "customer.subscription.deleted":
          await this.handleSubscriptionDeleted(event.data.object);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error("Webhook handling error:", error);
      throw error;
    }
  }

  async handleCheckoutCompleted(session) {
    const userId = session.metadata.userId;
    if (!userId) return;

    const user = await User.findById(userId);
    if (user) {
      user.isPremium = true;
      await user.save();
      console.log(`User ${userId} upgraded to premium`);
    }
  }

  async handlePaymentSucceeded(invoice) {
    const customerId = invoice.customer;
    const user = await User.findOne({ stripeCustomerId: customerId });
    if (user) {
      user.isPremium = true;
      await user.save();
      console.log(`Payment succeeded for user ${user._id}`);
    }
  }

  async handlePaymentFailed(invoice) {
    const customerId = invoice.customer;
    const user = await User.findOne({ stripeCustomerId: customerId });
    if (user) {
      // Could implement grace period or downgrade logic
      console.log(`Payment failed for user ${user._id}`);
    }
  }

  async handleSubscriptionDeleted(subscription) {
    const customerId = subscription.customer;
    const user = await User.findOne({ stripeCustomerId: customerId });
    if (user) {
      user.isPremium = false;
      await user.save();
      console.log(`User ${user._id} subscription cancelled`);
    }
  }
}

module.exports = new PaymentService();