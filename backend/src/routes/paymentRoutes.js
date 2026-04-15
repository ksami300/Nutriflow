const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createCheckout,
  stripeWebhook,
} = require("../controllers/paymentController");

// 💳 CREATE CHECKOUT SESSION
router.post("/checkout", authMiddleware, createCheckout);

// 🔥 STRIPE WEBHOOK
router.post("/webhook", stripeWebhook);

module.exports = router;