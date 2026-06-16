const Joi = require("joi");

const reviewSchema = Joi.object({
  workerId: Joi.number().integer().positive().required().messages({
    "any.required": "Worker ID is required"
  }),
  userName: Joi.string().min(2).max(50).required().messages({
    "string.min": "User Name must be at least 2 characters",
    "any.required": "User Name is required"
  }),
  rating: Joi.number().min(1).max(5).required().messages({
    "number.min": "Rating must be at least 1 star",
    "number.max": "Rating cannot exceed 5 stars",
    "any.required": "Rating score is required"
  }),
  text: Joi.string().min(5).max(1000).required().messages({
    "string.min": "Review text must be at least 5 characters long",
    "string.max": "Review text cannot exceed 1000 characters",
    "any.required": "Review text is required"
  })
});

module.exports = {
  reviewSchema
};
