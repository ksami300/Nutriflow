const router = require("express").Router();
const validateRequest = require("../middleware/validateRequest");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validation/schemas");
const {
  register,
  login,
  profile,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");

router.post("/register", authLimiter, validateRequest(registerSchema), register);
router.post("/login", authLimiter, validateRequest(loginSchema), login);
router.post("/refresh-token", refreshToken);
router.post("/logout", authMiddleware, logout);
router.get("/profile", authMiddleware, profile);
router.post("/forgot-password", authLimiter, validateRequest(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", authLimiter, validateRequest(resetPasswordSchema), resetPassword);

module.exports = router;
