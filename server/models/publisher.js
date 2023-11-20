const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const publisherSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  dob: String,
  domains: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Domain",
    },
  ],
  imageURL: {
    type: String,
    default:
      "https://res.cloudinary.com/dqnz3rzt5/image/upload/v1679141386/avatar_sofpb7.jpg",
  },
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
        enum: ["publisher", "admin"],
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

publisherSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("Publisher", publisherSchema);
