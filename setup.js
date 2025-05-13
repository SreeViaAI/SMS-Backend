/**
 * OTP Authentication System Setup Script
 *
 * This script helps first-time users set up the project by:
 * 1. Creating a .env file with proper configurations
 * 2. Testing the MongoDB connection
 * 3. Checking if the SMS API credentials work
 */

const fs = require("fs");
const readline = require("readline");
const mongoose = require("mongoose");
const axios = require("axios");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to get user input
const ask = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

/**
 * Main setup function
 */
async function setup() {
  try {
    console.log("\n===============================================");
    console.log("🔐 OTP AUTHENTICATION SYSTEM SETUP 🔐");
    console.log("===============================================\n");

    console.log(
      "This script will help you set up your OTP Authentication System.\n"
    );

    // Step 1: Create .env file
    console.log("STEP 1: Creating .env file");
    console.log("--------------------------");

    let envContent = "";

    // Basic configuration
    const port = (await ask("Enter port number (default: 3000): ")) || "3000";
    envContent += `PORT=${port}\n`;

    // MongoDB configuration
    const mongoUri =
      (await ask(
        "Enter MongoDB URI (default: mongodb://localhost:27017/otp-auth): "
      )) || "mongodb://localhost:27017/otp-auth";
    envContent += `MONGODB_URI=${mongoUri}\n`;

    // SMS API configuration
    console.log("\nSMS API Configuration:");
    const apiUrl =
      (await ask(
        "Enter SMS API URL (default: https://smslogin.co/v3/api.php): "
      )) || "https://smslogin.co/v3/api.php";
    const apiKey = await ask("Enter SMS API Key: ");
    const senderId = await ask("Enter SMS Sender ID: ");
    const templateId = await ask("Enter SMS Template ID: ");

    envContent += `SREEVIAAI_API_URL=${apiUrl}\n`;
    envContent += `SREEVIAAI_API_KEY=${apiKey}\n`;
    envContent += `SREEVIAAI_SENDER_ID=${senderId}\n`;
    envContent += `SREEVIAAI_TEMPLATE_ID=${templateId}\n`;

    // Write to .env file
    fs.writeFileSync(".env", envContent);
    console.log("\n✅ .env file created successfully!\n");

    // Step 2: Test MongoDB connection
    console.log("STEP 2: Testing MongoDB connection");
    console.log("----------------------------------");

    try {
      console.log(`Connecting to MongoDB at: ${mongoUri}`);
      await mongoose.connect(mongoUri);
      console.log("✅ MongoDB connection successful!");
      await mongoose.disconnect();
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error.message);
      console.log(
        "Please check your connection string and make sure MongoDB is running."
      );
    }

    // Step 3: Test SMS API (optional)
    console.log("\nSTEP 3: Test SMS API (optional)");
    console.log("-------------------------------");

    const shouldTestSms = await ask(
      "Would you like to test the SMS API with a test message? (y/n): "
    );

    if (
      shouldTestSms.toLowerCase() === "y" ||
      shouldTestSms.toLowerCase() === "yes"
    ) {
      const testPhone = await ask(
        "Enter your phone number to receive a test SMS: "
      );

      try {
        console.log("Sending test SMS...");

        // Format the URL with the test message
        const url = `${apiUrl}?username=Sreeviaai&apikey=${apiKey}&senderid=${senderId}&mobile=${testPhone}&message=${encodeURIComponent(
          "Test message from OTP Authentication System"
        )}&templateid=${templateId}`;

        const response = await axios.get(url);
        console.log("✅ Test SMS sent successfully!");
        console.log("API Response:", response.data);
      } catch (error) {
        console.error("❌ SMS API test failed:", error.message);
        console.log("Please check your API credentials and try again.");
      }
    }

    // Setup complete
    console.log("\n===============================================");
    console.log("🎉 SETUP COMPLETED! 🎉");
    console.log("===============================================\n");

    console.log("You can now start the server with:");
    console.log("npm run dev");
    console.log("\nTo test the OTP flow:");
    console.log("node test_otp_flow.js");
  } catch (error) {
    console.error("Setup error:", error.message);
  } finally {
    rl.close();
  }
}

// Run the setup
setup();
