const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// 1. 💳 KREIRANJE STRIPE CHECKOUT SESIJE (Klijent ide na plaćanje)
router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: process.env.STRIPE_PRICE_ID, // ID tvog paketa od 9.99€ sa Stripe Dashboard-a
        quantity: 1,
      }],
      customer_email: req.user.email,
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard?canceled=true`,
    });

    res.json({ success: true, url: session.url });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. 🔍 PROVERA STATUSA PRETPLATE (Frontend proverava licencu)
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, data: { isPremium: user.isPremium } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. 🛡️ STRIPE WEBHOOK (Hvata uspešnu uplatnicu i otključava Premium)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Kad legne novac na Erste/Payoneer, palimo licencu u MongoDB-u
    await User.findOneAndUpdate({ email: session.customer_email }, { isPremium: true });
    console.log(`👑 Webhook Uspeh: Pretplata aktivirana za ${session.customer_email}`);
  }

  res.json({ received: true });
});

module.exports = router;
