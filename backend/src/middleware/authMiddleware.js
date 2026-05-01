const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("name email isPremium");

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};