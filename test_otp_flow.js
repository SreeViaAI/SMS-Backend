const axios = require("axios");

/**
 * This script tests sending an OTP to a phone number
 *
 * It will:
 * 1. Send an OTP to the phone number
 * 2. Show the response from the server
 * 3. Provide instructions for verifying the OTP
 */
async function testOtpFlow() {
  try {
    console.log("========= OTP SENDING TEST =========");

    // Get phone number from command line or use default
    const phone = process.argv[2] || "9553220051";
    console.log(`Phone number: ${phone}`);

    // Step 1: Send OTP to the phone
    console.log("\nSending OTP...");
    const response = await axios.post(
      "http://localhost:3000/api/auth/send-otp",
      { phone },
      { headers: { "Content-Type": "application/json" } }
    );

    // Step 2: Show response
    console.log("\nServer response:");
    console.log(JSON.stringify(response.data, null, 2));

    // Step 3: Success message and next steps
    if (response.data.success) {
      console.log("\n✅ OTP sent successfully!");
      console.log(`   Check your phone (${phone}) for the OTP message`);
      console.log(`   OTP expires in ${response.data.data.expiresIn} seconds`);

      // Show verification instructions
      console.log("\n========= VERIFICATION INSTRUCTIONS =========");
      console.log("Once you receive the OTP, run:");
      console.log("node test_verify_otp.js");
    } else {
      console.log("\n❌ OTP sending failed!");
    }
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.response?.data) {
      console.error("Server error:", error.response.data);
    }
  }
}

// Run the test
testOtpFlow();
