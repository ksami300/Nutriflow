const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User");

// 💳 KREIRANJE STRIPE BILLING PORTAL SESIJE (Upravljanje pretplatom na Erste/George nivou)
exports.createBillingPortalSession = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Korisnik nije pronađen u sistemu." });
    }

    // Provera da li korisnik uopšte ima registrovan Stripe Customer ID u Frankfurtu
    if (!user.stripeCustomerId) {
      return res.status(400).json({ 
        success: false, 
        message: "Nema aktivne platne istorije. Prvo aktivirajte Premium nalog preko Stripe Checkout-a." 
      });
    }

    // Pokrećemo zvanični Stripe Customer Portal za sigurno otkazivanje i promenu kartica
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard/settings`,
    });

    return res.status(200).json({
      success: true,
      url: session.url,
      message: "Stripe Billing Portal uspešno konfigurisan i otvoren."
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Kritična greška Stripe podsistema: " + err.message
    });
  }
};
