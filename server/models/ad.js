const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  companyName: String,
  targetCategory: String,
  targetLocation: String,
  size: String,
  type: String,
  redirectURL: String,
  imageURL: String,
  advertiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Advertiser",
  },
  adSpace: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdSpace",
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
  pricePlan: {
    type: { type: String },
    tier: { type: String },
    price: { type: Number },
    success: { type: Boolean, default: false },
  },
  dateSaved: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Ad", adSchema);
