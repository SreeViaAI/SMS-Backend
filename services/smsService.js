const axios = require("axios");

/**
 * Ensures the phone number has a country code
 * @param {string} phone - The phone number to format
 * @returns {string} - The formatted phone number with country code
 */
const formatPhoneNumber = (phone) => {
  // Remove any non-digit characters (like spaces, hyphens, etc.)
  const digits = phone.replace(/\D/g, "");

  // If the phone is a 10-digit number, add Indian country code (91)
  if (digits.length === 10) {
    return "91" + digits;
  }

  // Otherwise, return as is (assuming it already has country code)
  return digits;
};

/**
 * Sends an OTP via the SMS API
 * @param {string} phone - The recipient's phone number
 * @param {string} otp - The OTP to send
 * @returns {Promise<Object>} - Response from the SMS API
 */
const sendSMS = async (phone, otp) => {
  try {
    // Format the phone number to ensure it has country code
    const formattedPhone = formatPhoneNumber(phone);

    // Create a simple message with the OTP
    const message = `Your OTP is ${otp}`;

    // Build the URL with all required parameters for the SMS API
    const url = `${process.env.SREEVIAAI_API_URL}?username=Sreeviaai&apikey=${
      process.env.SREEVIAAI_API_KEY
    }&senderid=${
      process.env.SREEVIAAI_SENDER_ID
    }&mobile=${formattedPhone}&message=${encodeURIComponent(
      message
    )}&templateid=${process.env.SREEVIAAI_TEMPLATE_ID}`;

    // Send the SMS via the API
    const response = await axios.get(url);

    // Parse the response if it's a string (the API returns responses in different formats)
    let responseData;
    if (typeof response.data === "string") {
      try {
        // Convert single quotes to double quotes for valid JSON
        const jsonStr = response.data.replace(/'/g, '"');
        responseData = JSON.parse(jsonStr);
      } catch (e) {
        // If parsing fails, just return the raw response
        responseData = { rawResponse: response.data };
      }
    } else {
      responseData = response.data;
    }

    return responseData;
  } catch (error) {
    console.error("SMS API error:", error.response?.data || error.message);
    throw new Error("Failed to send SMS");
  }
};

module.exports = {
  sendSMS,
  formatPhoneNumber,
};
