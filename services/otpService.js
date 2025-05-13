const OTP = require("../models/OTP");
const smsService = require("./smsService");

/**
 * Generate a random 6-digit OTP
 * @returns {string} - A 6-digit OTP
 */
const generateOTP = () => {
  // Generate a random number between 100000 and 999999
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate and save an OTP for a phone number, then send it via SMS
 * @param {string} phone - The phone number
 * @returns {Promise<string>} - The generated OTP
 */
const createOTP = async (phone) => {
  try {
    // Step 1: Generate a new 6-digit OTP
    const otp = generateOTP();

    // Step 2: Format the phone number for database storage (last 10 digits only)
    // This allows users to enter phone with or without country code
    const formattedPhoneForStorage = phone.replace(/\D/g, "").slice(-10);

    // Step 3: Remove any existing OTPs for this phone number
    await OTP.deleteMany({ phone: formattedPhoneForStorage });

    // Step 4: Create and save the new OTP record in MongoDB
    const otpRecord = new OTP({
      phone: formattedPhoneForStorage,
      otp,
    });
    await otpRecord.save();

    // Step 5: Format the phone number for SMS sending (with country code)
    const formattedPhoneForSMS = smsService.formatPhoneNumber(phone);

    // Step 6: Send the OTP via SMS
    await smsService.sendSMS(formattedPhoneForSMS, otp);

    // Return the generated OTP
    return otp;
  } catch (error) {
    console.error("Error creating OTP:", error);
    throw error;
  }
};

/**
 * Verify an OTP for a phone number
 * @param {string} phone - The phone number
 * @param {string} otp - The OTP to verify
 * @returns {Promise<boolean>} - Whether the OTP is valid
 */
const verifyOTP = async (phone, otp) => {
  try {
    // Step 1: Format the phone number to match how it was stored (last 10 digits)
    const formattedPhoneForLookup = phone.replace(/\D/g, "").slice(-10);

    // Step 2: Look for a matching OTP record in the database
    const otpRecord = await OTP.findOne({
      phone: formattedPhoneForLookup,
      otp,
    });

    // Step 3: If no matching record is found, or it has expired, return false
    if (!otpRecord) {
      return false;
    }

    // Step 4: Delete the OTP after verification to prevent reuse
    await OTP.deleteOne({ _id: otpRecord._id });

    // Step 5: Return true indicating successful verification
    return true;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

module.exports = {
  createOTP,
  verifyOTP,
};
