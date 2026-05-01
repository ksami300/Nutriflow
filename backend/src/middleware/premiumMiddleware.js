module.exports = (req, res, next) => {
  if (!req.user || !req.user.isPremium) {
    return res.status(403).json({ message: "Premium access required" });
  }

  next();
};
