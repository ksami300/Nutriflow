const { createLogger, format, transports } = require("winston");

const { combine, colorize, timestamp, printf, errors } = format;

const logFormat = printf(({ timestamp, level, message, stack }) => {
  return `${timestamp} [${level}] ${stack || message}`;
});

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(errors({ stack: true }), timestamp(), colorize({ all: true }), logFormat),
  transports: [new transports.Console()],
  exceptionHandlers: [new transports.Console()],
});

logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
