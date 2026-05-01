const dotenv = require("dotenv");
const Joi = require("joi");

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
  PORT: Joi.number().default(5000),
  MONGO_URI: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  FRONTEND_URL: Joi.string().uri().required(),
  STRIPE_SECRET_KEY: Joi.string().required(),
  STRIPE_PRICE_ID: Joi.string().required(),
  STRIPE_WEBHOOK_SECRET: Joi.string().required(),
  EMAIL_USER: Joi.string().email().required(),
  EMAIL_PASS: Joi.string().required(),
}).unknown();

const { error, value: env } = envSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: true,
});

if (error) {
  console.error("ENV validation error:", error.details.map((detail) => detail.message).join(", "));
  process.exit(1);
}

module.exports = env;
