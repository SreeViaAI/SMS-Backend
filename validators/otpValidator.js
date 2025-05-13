const Joi = require("joi");

/**
 * Validator for the send-otp endpoint
 *
 * Validates that the request contains:
 * - phone: A 10-digit phone number
 *
 * @param {Object} data - The request body to validate
 * @returns {Object} - Validation result
 */
const sendOtpValidator = (data) => {
  // Create validation schema
  const schema = Joi.object({
    // Phone must be a 10-digit number
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone number must be a 10-digit number",
        "any.required": "Phone number is required",
      }),
  });

  // Return validation result
  return schema.validate(data);
};

/**
 * Validator for the verify-otp endpoint
 *
 * Validates that the request contains:
 * - phone: A 10-digit phone number
 * - otp: A 6-digit OTP code
 *
 * @param {Object} data - The request body to validate
 * @returns {Object} - Validation result
 */
const verifyOtpValidator = (data) => {
  // Create validation schema
  const schema = Joi.object({
    // Phone must be a 10-digit number
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone number must be a 10-digit number",
        "any.required": "Phone number is required",
      }),

    // OTP must be a 6-digit number
    otp: Joi.string()
      .pattern(/^[0-9]{6}$/)
      .required()
      .messages({
        "string.pattern.base": "OTP must be a 6-digit number",
        "any.required": "OTP is required",
      }),
  });

  // Return validation result
  return schema.validate(data);
};

module.exports = {
  sendOtpValidator,
  verifyOtpValidator,
};
