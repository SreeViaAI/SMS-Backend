require("dotenv").config();
const axios = require("axios");

/**
 * Tests SMS delivery with proper phone number format
 */
async function testSmsDelivery() {
  try {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Ensure phone number has proper country code
    // India country code (91) should be included
    const phone = "91" + "9553220051"; // Add country code to ensure proper delivery

    // Create a simpler message
    const message = `Your OTP is ${otp}`;

    // Build the URL with proper parameters
    const url = `${process.env.SREEVIAAI_API_URL}?username=Sreeviaai&apikey=${
      process.env.SREEVIAAI_API_KEY
    }&senderid=${
      process.env.SREEVIAAI_SENDER_ID
    }&mobile=${phone}&message=${encodeURIComponent(message)}&templateid=${
      process.env.SREEVIAAI_TEMPLATE_ID
    }`;

    console.log("Request URL:", url);
    console.log(`Sending OTP ${otp} to ${phone}...`);

    // Make the API request
    const response = await axios.get(url);

    // Parse the response
    let responseData;
    if (typeof response.data === "string") {
      try {
        const jsonStr = response.data.replace(/'/g, '"');
        responseData = JSON.parse(jsonStr);
      } catch (e) {
        responseData = { rawResponse: response.data };
      }
    } else {
      responseData = response.data;
    }

    // Log the formatted result
    const result = {
      success: true,
      message: "SMS delivery test completed",
      timestamp: new Date().toISOString(),
      request: {
        phone,
        otp,
        message,
      },
      apiResponse: responseData,
    };

    console.log(JSON.stringify(result, null, 2));

    if (responseData.campid) {
      console.log(
        `\n✅ SMS accepted by API (Campaign ID: ${responseData.campid})`
      );
      console.log(`Check your phone ${phone} for the OTP: ${otp}`);
    }

    return result;
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }

    return {
      success: false,
      message: "SMS delivery test failed",
      error: error.message,
    };
  }
}

// Run the test
testSmsDelivery();
