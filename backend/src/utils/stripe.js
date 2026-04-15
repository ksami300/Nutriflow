const Stripe = require("stripe");

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is required in stripe utility");
}

const stripe = new Stripe(stripeSecretKey);

module.exports = stripe;
