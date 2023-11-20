const mongoose = require("mongoose");

const domainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: String, required: true },
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
    required: true,
  },
  webAnalyticsScript: { type: String },
  adSpaces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdSpace",
    },
  ],
  score: { type: Number, default: 0 },
  ranking: { type: Number },
  dateSaved: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Domain", domainSchema);
