const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");

// 🛡️ UVOZ AUTH MIDDLEWARE KAPPIJE ZA PROVERU JWT SESIJE
const authMiddleware = require("../middlewares/authMiddleware");

// 🔐 ZAŠTIĆENA RUTA: Otvaranje Erste/George Stripe portala (Samo za ulogovane premium članove)
router.post("/portal-session", authMiddleware, billingController.createBillingPortalSession);

module.exports = router;
