const admin = require("firebase-admin");
const express = require("express");
require("dotenv").config();

// Firebase Admin Init
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const app = express();
app.use(express.json());

// Test endpoint
app.get("/", (req, res) => {
  res.send("✅ FCM Server for Android (Java) is running");
});

// Send notification
app.post("/sendNotification", async (req, res) => {
  try {
    const { targetToken, title, message } = req.body;

    if (!targetToken || !title || !message) {
      return res.status(400).send("❌ Missing token, title, or message");
    }

    const messageObj = {
      "data": {
        title,
        message
      },
      "to": targetToken
    }

    const response = await admin.messaging().send(messageObj);
    console.log("✅ Sent:", response);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on ${port}`));