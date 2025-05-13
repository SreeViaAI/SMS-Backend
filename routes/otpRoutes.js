const express = require("express");
const router = express.Router();
const otpService = require("../services/otpService");
const smsService = require("../services/smsService");
const {
  sendOtpValidator,
  verifyOtpValidator,
} = require("../validators/otpValidator");
const OTP = require("../models/OTP");

/**
 * @route POST /api/auth/send-otp
 * @desc Generate and send OTP to a phone number
 */
router.post("/send-otp", async (req, res) => {
  try {
    // Step 1: Validate the input using Joi validator
    const { error, value } = sendOtpValidator(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Step 2: Generate and send OTP using the service
    await otpService.createOTP(value.phone);

    // Step 3: Return success response (we don't include the OTP for security)
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      data: {
        phone: value.phone,
        expiresIn: 300, // 5 minutes in seconds
      },
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});

/**
 * @route POST /api/auth/verify-otp
 * @desc Verify OTP for a phone number
 */
router.post("/verify-otp", async (req, res) => {
  try {
    // Step 1: Validate the input using Joi validator
    const { error, value } = verifyOtpValidator(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Step 2: Verify the OTP using the service
    const isValid = await otpService.verifyOTP(value.phone, value.otp);

    // Step 3: If OTP is not valid, return error
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Step 4: Return success response
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: {
        phone: value.phone,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
});

/**
 * @route GET /api/auth/test-sms
 * @desc Test endpoint to check if SMS sending works properly
 */
router.get("/test-sms", async (req, res) => {
  try {
    // Step 1: Get phone number from query parameter or use default
    const rawPhone = req.query.phone || "9553220051";

    // Step 2: Format phone numbers for both storage and SMS sending
    const phone = smsService.formatPhoneNumber(rawPhone);
    const formattedPhoneForStorage = rawPhone.replace(/\D/g, "").slice(-10);

    // Step 3: Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Step 4: Store the OTP in MongoDB
    await OTP.deleteMany({ phone: formattedPhoneForStorage });
    const otpRecord = new OTP({
      phone: formattedPhoneForStorage,
      otp,
    });
    await otpRecord.save();

    // Step 5: Send SMS with the same OTP
    const response = await smsService.sendSMS(phone, otp);

    // Step 6: Return a detailed response for testing
    return res.status(200).json({
      success: true,
      message: "SMS API test completed successfully",
      timestamp: new Date().toISOString(),
      request: {
        originalPhone: rawPhone,
        formattedPhoneForStorage: formattedPhoneForStorage,
        formattedPhone: phone,
        otp,
        message: `Your OTP is ${otp}`,
      },
      mongoDBRecord: {
        phone: formattedPhoneForStorage,
        otp,
      },
      apiResponse: response,
    });
  } catch (error) {
    console.error("SMS API test error:", error);
    return res.status(500).json({
      success: false,
      message: "SMS API test failed",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

module.exports = router;
