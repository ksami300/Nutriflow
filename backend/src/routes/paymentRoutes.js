const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createCheckout } = require("../controllers/paymentController");

// ?? CREATE CHECKOUT SESSION
router.post("/checkout", authMiddleware, createCheckout);

module.exports = router;
