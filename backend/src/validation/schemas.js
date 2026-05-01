const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const mealPlanSchema = Joi.object({
  goal: Joi.string().valid("lose", "gain", "maintain").required(),
  weight: Joi.number().positive().required(),
  height: Joi.number().positive().required(),
  age: Joi.number().integer().positive().required(),
  gender: Joi.string().valid("male", "female").required(),
  activityLevel: Joi.string()
    .valid("sedentary", "light", "moderate", "active", "veryActive")
    .required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  mealPlanSchema,
};
