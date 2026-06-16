const Joi = require("joi");

const bookingSchema = Joi.object({
  workerId: Joi.number().integer().positive().required().messages({
    "number.base": "Worker ID must be a number",
    "any.required": "Worker ID is required"
  }),
  date: Joi.string().required().custom((value, helpers) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(value);
    
    if (isNaN(bookingDate.getTime())) {
      return helpers.message({ custom: "Please enter a valid date format (YYYY-MM-DD)" });
    }
    
    if (bookingDate < today) {
      return helpers.message({ custom: "Booking date cannot be in the past" });
    }
    return value;
  }).messages({
    "any.required": "Booking date is required"
  }),
  time: Joi.string().required().messages({
    "any.required": "Booking time slot is required"
  }),
  address: Joi.string().min(10).required().messages({
    "string.min": "Please provide a complete address (minimum 10 characters)",
    "any.required": "Address is required"
  }),
  notes: Joi.string().allow("").optional(),
  emerg: Joi.boolean().default(false)
});

module.exports = {
  bookingSchema
};
