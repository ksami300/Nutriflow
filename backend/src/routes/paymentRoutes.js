const express = require("express");
const router = express.Router();

const {
  createCheckout,
  getSubscriptionStatus,
} = require("../controllers/paymentController");
const auth = require("../middleware/authMiddleware");

router.post("/create-checkout", auth, createCheckout);
router.post("/checkout", auth, createCheckout);
router.get("/status", auth, getSubscriptionStatus);

module.exports = router;