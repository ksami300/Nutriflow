const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/envConfig");
const logger = require("./utils/logger");

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    // ✅ Eksplicitno slusanje na 0.0.0.0 da Windows klijent vidi WSL port
    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`Server running on http://0.0.0:${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();