const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const env = require("../config/envConfig");
const logger = require("../utils/logger");
const { sendEmail } = require("../utils/email");
const {
  createAccessToken,
  createRefreshToken,
  attachRefreshCookie,
  clearRefreshCookie,
} = require("../services/authService");

// 🔥 UVOZ NOVOG RETENTION SISTEMA ZA MOTIVACIJU KORISNIKA
const { sendMotivationEmail } = require("../services/motivationEmailService");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const createUserPayload = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  isPremium: user.isPremium,
});

const sendUserResponse = (user, token, res, statusCode = 200) => {
  attachRefreshCookie(res, user.refreshToken);

  return res.status(statusCode).json({
    success: true,
    data: {
      token,
      user: createUserPayload(user),
    },
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const refreshToken = createRefreshToken();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      referralCode: crypto.randomBytes(3).toString("hex"),
      isPremium: false,
      refreshToken,
    });

    // 📧 1. Standardni fabrički Welcome Mejl (Sa asinhronom izolacijom)
    try {
      await sendEmail(
        user.email,
        "Welcome to NutriFlow",
        `Hi ${user.name},\n\nWelcome to NutriFlow!\n\nEnjoy your journey 🚀`
      );
    } catch (error) {
      logger.warn("Welcome email failed:", error.message);
    }

    // 🔥 2. OKIDANJE BRUTALNE AI COACH RETENTION MOTIVACIJE ZA KORISNIKA
    sendMotivationEmail(user.email, user.name).catch((error) => {
      logger.warn("Retention motivational email failed:", error.message);
    });

    const token = createAccessToken(user);
    return sendUserResponse(user, token, res, 201);
  } catch (err) {
    logger.error("Register error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password +refreshToken");

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // 🔥 ROTATE refresh token
    user.refreshToken = createRefreshToken();
    await user.save();

    const accessToken = createAccessToken(user);
    attachRefreshCookie(res, user.refreshToken);

    return res.status(200).json({
      success: true,
      data: {
        token: accessToken,
        user: createUserPayload(user),
      },
    });

  } catch (err) {
    logger.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      const user = await User.findOne({ refreshToken }).select("+refreshToken");
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }

    clearRefreshCookie(res);

    return res.status(200).json({ success: true, data: { message: "Logged out" } });
  } catch (err) {
    logger.error("Logout error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, error: "Refresh token missing" });
    }

    const user = await User.findOne({ refreshToken }).select("+refreshToken");
    if (!user) {
      clearRefreshCookie(res);
      return res.status(401).json({ success: false, error: "Invalid refresh token" });
    }

    const newRefreshToken = createRefreshToken();
    user.refreshToken = newRefreshToken;
    await user.save();

    const token = createAccessToken(user);
    attachRefreshCookie(res, newRefreshToken);

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: createUserPayload(user),
      },
    });
  } catch (err) {
    logger.error("Refresh error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ success: true, data: { user: createUserPayload(user) } });
  } catch (err) {
    logger.error("Profile error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "If the email exists, a reset link has been sent" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = hashToken(resetToken);
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail(
      user.email,
      "Password Reset",
      `Reset your password:\n\n${resetUrl}`
    );

    return res.status(200).json({ success: true, data: { message: "If the email exists, a reset link has been sent" } });
  } catch (err) {
    logger.error("Forgot password error:", err);
    res.status(500).json({ success: false, error: "Unable to process request" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+refreshToken");

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = createRefreshToken();
    await user.save();

    const accessToken = createAccessToken(user);
    attachRefreshCookie(res, user.refreshToken);

    return res.status(200).json({
      success: true,
      data: {
        message: "Password reset successful",
        token: accessToken,
        user: createUserPayload(user),
      },
    });
  } catch (err) {
    logger.error("Reset password error:", err);
    res.status(500).json({ success: false, error: "Unable to reset password" });
  }
};
