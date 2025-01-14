const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 2000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Store webhook requests
let webhookRequests = [];

// Webhook endpoint
app.post("/webhook", (req, res) => {
  console.log("Webhook received:", req.body);
  webhookRequests.push({
    timestamp: new Date().toISOString(),
    body: req.body,
    headers: req.headers,
  });
  res.status(200).json({ message: "Webhook received successfully" });
});

// Endpoint to fetch webhook requests
app.get("/webhook-requests", (req, res) => {
  res.status(200).json(webhookRequests);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Webhook tester server running on http://localhost:${PORT}`);
});
