const axios = require("axios");

// Add a unique token to the test to ensure we're testing the latest implementation
const timestamp = Date.now();

// Function to test the SMS API endpoint
async function testSmsEndpoint() {
  try {
    console.log("Testing SMS API endpoint...");
    // Add timestamp to make sure we're testing the latest version
    const response = await axios.get(
      `http://localhost:3000/api/auth/test-sms?_=${timestamp}`
    );

    // Print formatted JSON response
    console.log(JSON.stringify(response.data, null, 2));

    // Check if the API call was successful
    if (response.data.success) {
      console.log("\n✅ SMS API is working correctly!");

      // Show campaign ID if available
      if (response.data.apiResponse && response.data.apiResponse.campid) {
        console.log(`Campaign ID: ${response.data.apiResponse.campid}`);
        console.log(
          `Check phone ${response.data.request.formattedPhone} for OTP: ${response.data.request.otp}`
        );
      }
    } else {
      console.log("\n❌ SMS API test failed!");
    }
  } catch (error) {
    console.error("Error testing SMS API endpoint:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the test
testSmsEndpoint();
