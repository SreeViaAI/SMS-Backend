const mongoose = require("mongoose");

/**
 * MongoDB schema for storing OTP codes
 *
 * This schema stores:
 * - phone: The user's phone number (last 10 digits only)
 * - otp: The 6-digit OTP code
 * - createdAt: Timestamp with automatic expiry after 5 minutes
 */
const otpSchema = new mongoose.Schema({
  // Phone number (stored without country code)
  phone: {
    type: String,
    required: true,
    trim: true,
  },

  // The 6-digit OTP code
  otp: {
    type: String,
    required: true,
  },

  // Automatic expiry - MongoDB will automatically delete documents after 5 minutes
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 5 minutes in seconds
  },
});

// Create an index on phone and otp for faster lookups
otpSchema.index({ phone: 1, otp: 1 });

// Export the model
module.exports = mongoose.model("OTP", otpSchema);
