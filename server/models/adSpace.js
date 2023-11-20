const mongoose = require("mongoose");

const adSpaceSchema = new mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
    required: true,
  },
  domain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Domain",
    required: true,
  },
  adSize: { type: String, required: true },
  adType: { type: String, required: true },
  cpc: { type: Number, required: true },
  cpm: { type: Number, required: true },
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ad",
  },
  scriptTag: {
    type: String,
  },
  adContainer: {
    type: String,
  },
  requestedAds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ad",
    },
  ],
  impressions: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  dateSaved: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AdSpace", adSpaceSchema);
