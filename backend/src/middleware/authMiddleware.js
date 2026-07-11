const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: missing token",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("_id name email isPremium");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: user not found",
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
    };

    next();
  } catch (err) {
    logger.error("AUTH ERROR:", err);

    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};