const axios = require("axios");
const readline = require("readline");

/**
 * Gets input from the user via the command line
 *
 * @param {string} question - The prompt to show the user
 * @returns {Promise<string>} - The user's input
 */
function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

/**
 * This script tests OTP verification
 *
 * It will:
 * 1. Ask for the phone number
 * 2. Ask for the OTP received on the phone
 * 3. Send the verification request to the server
 * 4. Show the result of the verification
 */
async function testVerifyOTP() {
  try {
    console.log("========= OTP VERIFICATION TEST =========");

    // Step 1: Get the phone number from the user
    const phone = await askQuestion("Enter your phone number: ");

    // Step 2: Get the OTP from the user
    const otp = await askQuestion("Enter the OTP received on your phone: ");

    console.log("\nVerifying OTP...");

    // Step 3: Send verification request to the server
    const response = await axios.post(
      "http://localhost:3000/api/auth/verify-otp",
      { phone, otp },
      { headers: { "Content-Type": "application/json" } }
    );

    // Step 4: Show verification result
    console.log("\nServer response:");
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      console.log("\n✅ OTP verified successfully!");
      console.log("   User is now authenticated");
    } else {
      console.log("\n❌ OTP verification failed!");
    }
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.response?.data) {
      console.error("Server error:", error.response.data);
    }
  }
}

// Run the verification test
testVerifyOTP();
