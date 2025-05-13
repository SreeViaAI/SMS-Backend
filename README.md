# OTP Authentication System

A simple, secure system for sending and verifying OTP (One-Time Password) codes via SMS.

## What This System Does

1. **Sends OTP Codes**: Generates a random 6-digit code and sends it to a phone number
2. **Verifies OTP Codes**: Checks if the OTP entered by user is correct
3. **Handles Security**: Automatically expires OTPs after 5 minutes

## Project Structure

```
├── models/               # Database models
│   └── OTP.js            # MongoDB OTP storage model
├── routes/               # API routes
│   └── otpRoutes.js      # OTP sending and verification endpoints
├── services/             # Business logic
│   ├── otpService.js     # OTP generation and verification
│   └── smsService.js     # SMS sending functionality
├── validators/           # Input validation
│   └── otpValidator.js   # Validates phone numbers and OTPs
├── index.js              # Main application file
└── test scripts          # For testing the system
```

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (running locally or connection string)
- SMS API credentials (for Sreeviaai SMS service)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory with these variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/otp-auth
SREEVIAAI_API_URL=https://smslogin.co/v3/api.php
SREEVIAAI_API_KEY=your_api_key_here
SREEVIAAI_SENDER_ID=your_sender_id_here
SREEVIAAI_TEMPLATE_ID=your_template_id_here
```

### Step 3: Start the Server

```bash
npm run dev
```

## How To Use The OTP System

### 1. Sending an OTP

To send an OTP code to a phone number:

```
POST /api/auth/send-otp

Body:
{
  "phone": "9553220051"  // 10-digit phone number
}
```

Response:

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "phone": "9553220051",
    "expiresIn": 300
  }
}
```

### 2. Verifying an OTP

To verify the OTP entered by the user:

```
POST /api/auth/verify-otp

Body:
{
  "phone": "9553220051",  // Same phone number
  "otp": "123456"         // The 6-digit OTP
}
```

Response if successful:

```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "phone": "9553220051"
  }
}
```

## Testing the System

We've included easy-to-use test scripts:

### Test Sending OTP

```bash
node test_otp_flow.js
```

You can also specify a phone number:

```bash
node test_otp_flow.js 9553220051
```

### Test Verifying OTP

```bash
node test_verify_otp.js
```

This will ask for your phone number and the OTP you received.

## How It Works

1. When a user requests an OTP:

   - A random 6-digit code is generated
   - The code is saved in MongoDB with a 5-minute expiry
   - The code is sent via SMS to the user's phone

2. When a user submits an OTP for verification:
   - The system checks if the OTP exists in the database
   - If found and not expired, verification succeeds
   - The OTP is deleted after verification to prevent reuse

## Common Issues

- **OTP not received**: Check phone number format and SMS API credentials
- **Verification fails**: OTP might be expired (after 5 minutes) or typed incorrectly
- **MongoDB connection error**: Ensure MongoDB is running and connection string is correct
