const mongoose = require("mongoose");

// 🌐 FORMALIZOVANI STANDARDIZOVANI HEALTH RESPONSE SA UPTIME MONITORINGOM
exports.getHealth = (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  
  // Računamo uptime u sekundama i formatiramo ga za izveštaj diplomskog rada
  const uptimeSeconds = process.uptime();

  return res.status(200).json({
    success: true,
    status: "OK",
    message: "NutriFlow API is running successfully in production-ready mode",
    database: dbStatus,
    uptime: `${Math.floor(uptimeSeconds)}s`, // ⏳ Uživo praćenje rada Express motora!
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development"
  });
};
