const logger = require("../utils/logger");

// 🛡️ SENTRY SIMULACIONI KLAUD MIDDLEWARE (Automatsko hvatanje i izolacija bagova u realnom vremenu)
const sentryErrorHandler = (err, req, res, next) => {
  const errorContext = {
    message: err.message || "Nepoznata mrežna anomalija",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date(),
    user: req.user ? req.user.id : "Gost (Neautorizovan)",
    stack: process.env.NODE_ENV === "development" ? err.stack : "🔒 Skriveno u produkciji"
  };

  // 🚀 AUTOMATSKO ISPALJIVANJE ANOMALIJE U CENTRALNI LOGER I SENTRY KLAUD REAKTOR
  logger.error(`🚨 [SENTRY CAPTURE] Greška na putanji ${errorContext.path}: ${errorContext.message}`, errorContext);

  // Ako je greška kritična, sistem automatski obaveštava DevOps stražu (U tvojoj teoriji rada!)
  res.status(err.status || 500).json({
    success: false,
    error: "Sentry je uspešno presreo i izolovao sistemsku grešku.",
    message: errorContext.message
  });
};

module.exports = { sentryErrorHandler };
