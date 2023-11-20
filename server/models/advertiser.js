const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const advertiserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  dob: String,
  imageURL: {
    type: String,
    default:
      "https://res.cloudinary.com/dqnz3rzt5/image/upload/v1679141386/avatar_sofpb7.jpg",
  },
  ads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ad",
    },
  ],
  googleId: String,
  messages: [
    {
      text: { type: String },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      sender: {
        type: String,
        enum: ["advertiser", "admin"],
        required: true,
      },
    },
  ],
  stripeId: { type: String },
  dateSaved: {
    type: Date,
    default: Date.now,
  },
});

advertiserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("Advertiser", advertiserSchema);
