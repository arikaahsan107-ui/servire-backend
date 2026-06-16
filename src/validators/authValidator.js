const Joi = require("joi");

// Pakistan phone regex
const pkPhoneRegex = /^(?:\+92|92|0)?3[0-9]{9}$/;

// ---------------- REGISTER ----------------
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  phone: Joi.string().pattern(pkPhoneRegex).allow("", null),

  city: Joi.string().allow("", null),   // ✅ FIX ADDED

  role: Joi.string()
    .valid("user", "admin", "worker")
    .default("user"),

  skill: Joi.string().allow("", null),

  experience: Joi.number().allow(null),

  bio: Joi.string().allow("", null)
});

// ---------------- LOGIN ----------------
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// ---------------- RESET PASSWORD ----------------
const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required()
});

// ---------------- PHONE VALIDATOR (optional use) ----------------
const pkPhoneValidator = Joi.string()
  .pattern(pkPhoneRegex)
  .messages({
    "string.pattern.base":
      "Please provide valid Pakistan phone number (e.g. +923001234567 or 03001234567)"
  });

module.exports = {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  pkPhoneValidator
};