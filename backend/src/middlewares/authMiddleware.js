import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } else {
      return res.status(401).json({ message: "Not authorized - no token" });
    }

  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.warn("WARNING: JWT_SECRET is not configured. Auth routes will fail until it is set.");
}
