const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const cookieHeader = req.headers.cookie;

    let token = authHeader ? authHeader.split(" ")[1] : null;

    if (!token && cookieHeader) {
      token = cookieHeader
        .split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("token="))
        ?.split("=")[1] || null;
    }

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};