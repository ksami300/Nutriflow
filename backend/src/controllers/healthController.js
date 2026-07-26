const mongoose = require("mongoose");

// 🌐 KRUNSKI KONTROLER ZDRAVLJA SA ŽIVOM PROVEROM MONGODB PRSTENA
exports.getHealth = (req, res) => {
  // Proveravamo trenutni status Mongoose konekcije (1 znači povezane i stabilno!)
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

  return res.status(200).json({
    success: true,
    status: "OK",
    message: "NutriFlow API is running successfully in production-ready mode",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development",
    database: dbStatus // 🔥 Uživo prikaz stanja baze za diplomsku komisiju!
  });
};
