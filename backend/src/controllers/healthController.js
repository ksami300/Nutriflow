exports.getHealth = (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "NutriFlow API is running",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development"
  });
};