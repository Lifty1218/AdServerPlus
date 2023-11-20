const mongoose = require("mongoose");

// Define the schema for the analytics data collection
const webAnalyticsSchema = new mongoose.Schema({
  domain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Domain",
    required: true,
  },
  timestamp: { type: Date, required: true },
  page: { type: String },
  referrer: { type: String },
  os: { type: String },
  device: { type: String },
  browser: { type: String },
  location: {
    country: { type: String },
    region: { type: String },
    city: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  sessionDuration: { type: Number },
});

module.exports = mongoose.model("WebAnalytics", webAnalyticsSchema);
