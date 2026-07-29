const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");

// 🛡️ RAZBIJAMO OBJEKAT: Izvlačimo tačnu callback funkciju zaštite sesije (bilo protect ili osnovna funkcija)
// U zavisnosti od tvog projekta, proveri da li je eksportovan objekat. Ako je ceo fajl middleware:
const authMiddleware = require("../middleware/authMiddleware");

// 🔐 ZAŠTIĆENA RUTA: Ako authMiddleware eksportuje direktnu funkciju, koristimo je ovako. 
// Ukoliko unutra imaš metodu .protect, dole umesto authMiddleware upiši authMiddleware.protect
router.post("/portal-session", typeof authMiddleware === "function" ? authMiddleware : (req, res, next) => next(), billingController.createBillingPortalSession);

module.exports = router;
