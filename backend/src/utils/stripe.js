import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
router.post("/create-checkout-session", protect, async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "NutriFlow Premium",
          },
          unit_amount: 999, // 9.99€
        },
        quantity: 1,
      },
    ],
    success_url: "http://localhost:3000/dashboard?success=true",
    cancel_url: "http://localhost:3000/dashboard",
  });

  res.json({ url: session.url });
});
req.user.isPremium = true;
await req.user.save();
const handleUpgrade = async () => {
  const res = await fetch("http://localhost:5000/api/payments/create-checkout-session", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  window.location.href = data.url;
};