export const getHealth = (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "NutriFlow API radi 🚀",
    timestamp: new Date(),
  });
};