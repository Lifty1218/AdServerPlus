require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cloudinary = require("cloudinary").v2;
const requestIp = require("request-ip");

const adminRoutes = require("./routes/admin-routes");
const publisherRoutes = require("./routes/publisher-routes");
const advertiserRoutes = require("./routes/advertiser-routes");
const adSpaceRoutes = require("./routes/adSpace-routes");
const adRoutes = require("./routes/ad-routes");
const domainRoutes = require("./routes/domain-routes");
const webAnalyticsRoutes = require("./routes/webAnalytics-routes");
const paymentRoutes = require("./routes/payment-routes");

const Advertiser = require("./models/advertiser");
const Publisher = require("./models/publisher");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// MONGO DB SETUP
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  });

// Set up Cloudinary credentials and storage
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(requestIp.mw());

// SESSIONS
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      collectionName: "sessions",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

io.on("connection", (socket) => {
  // When a new advertiser/publisher joins the chat
  socket.on("join", (userId) => {
    // Join a room with userId as the room name
    console.log(userId, " created a chat room with admin");
    socket.join(userId);
  });

  // When a new message is received from an advertiser
  socket.on("message", (data) => {
    const { advertiserId, publisherId, message, sender } = data;

    // Save the message to the database
    console.log("Store chat history");
    if (advertiserId) {
      Advertiser.findByIdAndUpdate(
        advertiserId,
        {
          $push: {
            messages: {
              text: message,
              timestamp: Date.now(),
              sender: sender,
            },
          },
        },
        { new: true }
      ).catch((error) => {
        console.error(error);
      });

      socket.to(advertiserId).emit("message", {
        text: message,
        timestamp: Date.now(),
        sender: sender,
      });
    } else if (publisherId) {
      Publisher.findByIdAndUpdate(
        publisherId,
        {
          $push: {
            messages: {
              text: message,
              timestamp: Date.now(),
              sender: sender,
            },
          },
        },
        { new: true }
      ).catch((error) => {
        console.error(error);
      });

      socket.to(publisherId).emit("message", {
        text: message,
        timestamp: Date.now(),
        sender: sender,
      });
    }
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("Socket Disconnected");
  });
});

// ROUTES
app.get("/", (req, res) => {
  return res.status(200).send({ message: "Home Page" });
});

app.use("/admin", adminRoutes);
app.use("/publisher", publisherRoutes);
app.use("/advertiser", advertiserRoutes);
app.use("/ad_space", adSpaceRoutes);
app.use("/ad", adRoutes);
app.use("/domain", domainRoutes);
app.use("/web_analytics", webAnalyticsRoutes);
app.use("/payment", paymentRoutes);

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is started on port ${port}`);
});
