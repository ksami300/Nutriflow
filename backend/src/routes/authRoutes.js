import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", registerUser);

// LOGIN
router.post("/login", loginUser);

// PROTECTED PROFILE
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Zaštićena ruta radi 🔐",
    user: req.user
  });
});

export default router;