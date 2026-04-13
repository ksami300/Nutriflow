import express from "express";
import { createCheckout, upgradePremium } from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/checkout", protect, createCheckout);
router.post("/upgrade", protect, upgradePremium);

export default router;