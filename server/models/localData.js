const mongoose = require("mongoose");

const localDataSchema = new mongoose.Schema({
  categories: [{ type: String, required: true }],
  bannerImgSizes: [{ type: String, required: true }],
  sideImgSizes: [{ type: String, required: true }],
  innerImgSizes: [{ type: String, required: true }],
  adSpaceTypes: [{ type: String, required: true }],
  pricePlans: {
    basic: {
      features: [{ type: String, required: true }],
      price: { type: String, required: true },
    },
    standard: {
      features: [{ type: String, required: true }],
      price: { type: String, required: true },
    },
    premium: {
      features: [{ type: String, required: true }],
      price: { type: String, required: true },
    },
  },
  cities: [{ type: String, required: true }],
});

const LocalData = mongoose.model("LocalData", localDataSchema);

module.exports = LocalData;
