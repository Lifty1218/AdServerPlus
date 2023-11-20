const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  advertiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Advertiser",
  },
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
  },
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ad",
  },
  adSpace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdSpace",
  },
  product: { type: String, required: true },
  amount: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
