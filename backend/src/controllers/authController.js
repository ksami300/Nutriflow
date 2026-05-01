const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendEmail } = require("../utils/email");

const createAccessToken = (user) =>
  jwt.sign(
    {
      id: user._id.toString(),
      isPremium: user.isPremium,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

const createRefreshToken = () => crypto.randomBytes(64).toString("hex");

const attachRefreshCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/",
  });
};

const clearCookies = (res) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    expires: new Date(0),
    path: "/",
  });
};

const sendUserResponse = (user, token, res, statusCode = 200) => {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    isPremium: user.isPremium,
  };

  attachRefreshCookie(res, user.refreshToken);

  return res.status(statusCode).json({
    token,
    user: payload,
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const referralCode = crypto.randomBytes(3).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashed,
      referralCode,
      isPremium: false,
      refreshToken: createRefreshToken(),
    });

    await sendEmail(
      user.email,
      "Welcome to NutriFlow",
      `Hi ${user.name},\n\nWelcome to NutriFlow! Your AI-powered nutrition journey starts now.\n\nBest,\nNutriFlow Team`
    );

    const token = createAccessToken(user);
    return sendUserResponse(user, token, res, 201);
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+refreshToken +password isPremium name email");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.refreshToken = createRefreshToken();
    await user.save();

    const token = createAccessToken(user);
    return sendUserResponse(user, token, res);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const user = await User.findOne({ refreshToken }).select("+refreshToken isPremium name email");
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    user.refreshToken = createRefreshToken();
    await user.save();

    const token = createAccessToken(user);
    return sendUserResponse(user, token, res);
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ message: "Unable to refresh token" });
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    }

    clearCookies(res);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Unable to logout" });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      },
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: "If the email exists, a reset link has been sent" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendEmail(
      user.email,
      "NutriFlow Password Reset",
      `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`
    );

    res.json({ message: "If the email exists, a reset link has been sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Unable to process request" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Unable to reset password" });
  }
};