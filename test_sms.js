require("dotenv").config();
const smsService = require("./services/smsService");

// Use the phone number from the working example
const testPhone = "9553220051"; // This number is from the working example
const testOTP = "123456";

async function testSMSService() {
  try {
    console.log(`Sending OTP ${testOTP} to ${testPhone}...`);
    const response = await smsService.sendSMS(testPhone, testOTP);
    console.log("SMS sent successfully!");
    console.log("Response:", JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Failed to send SMS:", error.message);
  }
}

testSMSService();
