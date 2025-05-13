require("dotenv").config();
const axios = require("axios");

/**
 * Tests the SMS API and returns a formatted JSON response
 */
async function testSmsApi() {
  try {
    // Test parameters
    const phone = "9553220051";
    const otp = "123456";

    // Build the URL exactly as in the working example
    const url = `${process.env.SREEVIAAI_API_URL}?username=Sreeviaai&apikey=${
      process.env.SREEVIAAI_API_KEY
    }&senderid=${
      process.env.SREEVIAAI_SENDER_ID
    }&mobile=${phone}&message=${encodeURIComponent(
      `Your OTP is ${otp}. Valid for 5 minutes.`
    )}&templateid=${process.env.SREEVIAAI_TEMPLATE_ID}`;

    // Make the API request
    console.log("Making API request to:", url);
    const response = await axios.get(url);

    // Parse the response data - handling both string and object formats
    let responseData;
    if (typeof response.data === "string") {
      // Try to parse the string response as JSON
      try {
        // Remove single quotes and replace with double quotes for valid JSON
        const jsonStr = response.data.replace(/'/g, '"');
        responseData = JSON.parse(jsonStr);
      } catch (e) {
        responseData = { rawResponse: response.data };
      }
    } else {
      responseData = response.data;
    }

    // Create a well-formatted result
    const result = {
      success: true,
      message: "SMS API test completed successfully",
      timestamp: new Date().toISOString(),
      request: {
        phone,
        otp,
        message: `Your OTP is ${otp}. Valid for 5 minutes.`,
      },
      apiResponse: responseData,
    };

    // Print the result as formatted JSON
    console.log(JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    // Create an error result
    const errorResult = {
      success: false,
      message: "SMS API test failed",
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        response: error.response?.data || null,
      },
    };

    // Print the error result as formatted JSON
    console.log(JSON.stringify(errorResult, null, 2));
    return errorResult;
  }
}

// Run the test
testSmsApi();
