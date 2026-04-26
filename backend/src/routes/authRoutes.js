const router = require("express").Router();
const { body } = require("express-validator");
const { register, login, profile, forgotPassword, resetPassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  login
);

router.get("/profile", authMiddleware, profile);

router.post(
  "/forgot-password",
  [
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  ],
  forgotPassword
);

router.post(
  "/reset-password",
  [
    body("token").exists().withMessage("Reset token is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  resetPassword
);

module.exports = router;