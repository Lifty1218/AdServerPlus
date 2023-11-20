const Advertiser = require("../models/advertiser");
const Ad = require("../models/ad");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "adImages",
    format: async (req, file) => "jpg",
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });

//        ********** STRATEGIES ***********

// ADVERTISER LOCAL STRATEGY
passport.use("advertiser", Advertiser.createStrategy());

// PASSPORT SERIALIZE/DESERIALIZE ADVERTISER (SESSION STORE etc)
passport.serializeUser((advertiser, done) => {
  done(null, advertiser._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const advertiser = await Advertiser.findById(id);
    return done(null, advertiser);
  } catch (err) {
    return done(err);
  }
});

// ADVERTISER GOOGLE STRATEGY
passport.use(
  "google-advertiser",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/advertiser/auth/google/dashboard",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const advertiser = await Advertiser.findOne({ googleId: profile.id });
        if (!advertiser) {
          const stripeCustomer = await stripe.customers.create({
            name: profile.displayName,
            email: profile.emails[0].value,
          });

          const newAdvertiser = new Advertiser({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            imageURL: profile.photos[0].value,
            stripeId: stripeCustomer.id,
            dob: "2000-04-24",
          });
          await newAdvertiser.save();
          console.log("New Advertiser");
          return done(null, newAdvertiser);
        } else {
          console.log("Already Advertiser");
          return done(null, advertiser);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

//        ********** FUNCTIONS ***********

// GET ALL ADVERTISERS
const GetAdvertisers = async (req, res) => {
  console.log("Get all advertisers");
  try {
    const advertiser = await Advertiser.find();
    return res.status(200).send(advertiser);
  } catch (err) {
    return res.send(err);
  }
};

// GET SINGLE ADVERTISER
const GetAdvertiserByID = async (req, res) => {
  console.log("Get a single advertiser");
  try {
    const advertiser = await Advertiser.findById(req.params.id);
    return res.status(200).send(advertiser);
  } catch (err) {
    return res.send(err);
  }
};

// CREATE NEW ADVERTISER
const CreateAdvertiser = async (req, res) => {
  console.log("Create an advertiser");
  const advertiser = new Advertiser(req.body);
  try {
    await advertiser.save();
    return res.status(200).json(advertiser);
  } catch (err) {
    return res.send(err);
  }
};

// UPDATE ADVERTISER
const UpdateAdvertiser = async (req, res) => {
  console.log("Update an advertiser");

  try {
    const advertiser = await Advertiser.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).json(advertiser);
  } catch (err) {
    return res.status(400).send(err);
  }
};

// DELETE ADVERTISER
const DeleteAdvertiser = async (req, res) => {
  console.log("Delete an advertiser");

  try {
    const advertiser = await Advertiser.findByIdAndDelete(req.params.id);
    return res.status(200).json(advertiser);
  } catch (err) {
    return res.send(err);
  }
};

// AUTHENTICATE ADVERTISER ON LOGIN
const AuthenticateAdvertiser = passport.authenticate("advertiser");

// RETURN RESPONSE AFTER ADVERTISER AUTHENTICATED
const Authenticated = async (req, res) => {
  // Advertiser is already authenticated in the AuthenticateAdvertiser middleware
  console.log("Advertiser Login Successful");
  return res.status(200).json({
    _id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    imageURL: req.user.imageURL,
    stripeId: req.user.stripeId,
    dob: req.user.dob,
  });
};

// REGISTER ADVERTISER ON SIGNUP
const RegisterAdvertiser = (req, res) => {
  const { email, name, dob, password } = req.body;
  console.log("email: " + email);
  Advertiser.register(
    new Advertiser({
      email: email,
      name: name,
      dob: dob,
    }),
    password,
    (err, advertiser) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      } else {
        passport.authenticate("advertiser")(req, res, async () => {
          console.log("Signup Successful");
          const stripeCustomer = await stripe.customers.create({
            email: advertiser.email,
            name: advertiser.name,
          });

          await Advertiser.findByIdAndUpdate(
            advertiser._id,
            {
              stripeId: stripeCustomer.id,
            },
            { new: true }
          );

          return res.status(200).json({
            _id: advertiser._id,
            email: advertiser.email,
            name: advertiser.name,
            imageURL: advertiser.imageURL,
            stripeId: stripeCustomer.id,
            dob: advertiser.dob,
          });
        });
      }
    }
  );
};

// LOGOUT ADVERTISER
const LogoutAdvertiser = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    } else {
      console.log("Logged Out");
      return res
        .clearCookie("connect.sid")
        .status(200)
        .json({ message: "Logout successful" });
    }
  });
};

// GOOGLE AUTHENTICATION
const GoogleAuthenticate = passport.authenticate("google-advertiser", {
  scope: ["profile", "email"],
});
// GOOGLE AUTHENTICATION REDIRECT
const GoogleAuthenticateRedirect = passport.authenticate("google-advertiser", {
  failureRedirect: "http://localhost:5173/advertiser/login",
  // successRedirect: "http://localhost:5173/advertiser",
});

const GoogleAuthenticated = (req, res) => {
  res.redirect(
    `http://localhost:5173/advertiser/login?id=${req.user._id}&name=${req.user.name}&email=${req.user.email}&imageURL=${req.user.imageURL}&stripeId=${req.user.stripeId}&dob=${req.user.dob}&googleId=${req.user.googleId}`
  );
};

const UploadFileMulter = upload.single("adImage");

//  UPLOAD AD IMAGE TO CLOUDINARY AND CREATE AD
const AdImageUpload = async (req, res) => {
  const {
    company,
    adCategory,
    adLocation,
    adRedirectURL,
    adType,
    adSize,
    advertiserId,
  } = req.body;
  const imageUrl = req.file.path;

  const ad = new Ad({
    companyName: company,
    targetCategory: adCategory,
    targetLocation: adLocation,
    size: adSize,
    type: adType,
    redirectURL: adRedirectURL,
    imageURL: imageUrl,
    advertiser: advertiserId,
  });

  try {
    await ad.save();
    await Advertiser.findByIdAndUpdate(
      advertiserId,
      { $push: { ads: ad._id } },
      {
        new: true,
      }
    );
    return res.status(200).send({ id: ad._id });
  } catch (error) {
    console.log("error");
    console.error("Error uploading file:", error);
    return res.status(500).json({ error: "Failed to upload file." });
  }
};

// GET ADS FOR A SINGLE ADVERTISER
const GetAds = async (req, res) => {
  const advertiserId = req.params.id;

  try {
    const advertiser = await Advertiser.findById(advertiserId).populate("ads");

    const emptyAdSpaceCount = await Ad.countDocuments({
      advertiser: advertiserId,
      adSpace: { $size: 0 },
    });
    res
      .status(200)
      .send({ advertiser: advertiser, emptyAdSpaces: emptyAdSpaceCount });
  } catch (error) {
    res.status(400).send(error);
  }
};

// GET ADVERTISERS WHO HAVE INITIALIZED COMMUNICATION WITH THE ADMIN
const getInitializedAdvertisers = (req, res) => {
  console.log("Get Initialized Advertisers");
  Advertiser.find({ messages: { $exists: true, $not: { $size: 0 } } })
    .then((advertisers) => {
      const advertisersArray = advertisers.map((advertiser) => {
        return {
          _id: advertiser._id,
          name: advertiser.name,
          email: advertiser.email,
          imageURL: advertiser.imageURL,
          message: advertiser.messages[advertiser.messages.length - 1],
        };
      });
      res.json(advertisersArray);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

// GET CHAT HISTORY FOR A SPECIFIC ADVERTISER
const getChatHistory = (req, res) => {
  const advertiserId = req.params.id;

  Advertiser.findById(advertiserId)
    .then((advertiser) => {
      res.json(advertiser.messages);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

// UPDATE PUBLISHER PROFILE
const UpdateAdvertiserProfile = async (req, res) => {
  try {
    let advertiser = null;
    if (req.file) {
      advertiser = await Advertiser.findByIdAndUpdate(
        req.params.id,
        { ...req.body, imageURL: req.file.path },
        {
          new: true,
        }
      );
    } else {
      advertiser = await Advertiser.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
    }
    return res.status(200).json(advertiser);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

const ChangePassword = async (req, res) => {
  console.log("Hello");
  Advertiser.findByUsername(req.user.email).then((advertiser) => {
    advertiser.changePassword(
      req.body.password,
      req.body.newPassword,
      (err) => {
        if (err) {
          console.log(err);
          res.status(500).send(err.message);
        } else {
          res.status(200).send("Password changed successfully!");
        }
      }
    );
  });
};

exports.RegisterAdvertiser = RegisterAdvertiser;
exports.AuthenticateAdvertiser = AuthenticateAdvertiser;
exports.Authenticated = Authenticated;

exports.GoogleAuthenticate = GoogleAuthenticate;
exports.GoogleAuthenticateRedirect = GoogleAuthenticateRedirect;
exports.GoogleAuthenticated = GoogleAuthenticated;

exports.GetAdvertisers = GetAdvertisers;
exports.GetAdvertiserByID = GetAdvertiserByID;
exports.CreateAdvertiser = CreateAdvertiser;
exports.UpdateAdvertiser = UpdateAdvertiser;
exports.DeleteAdvertiser = DeleteAdvertiser;

exports.AdImageUpload = AdImageUpload;
exports.UploadFileMulter = UploadFileMulter;
exports.GetAds = GetAds;
exports.getInitializedAdvertisers = getInitializedAdvertisers;
exports.getChatHistory = getChatHistory;
exports.UpdateAdvertiserProfile = UpdateAdvertiserProfile;
exports.ChangePassword = ChangePassword;

exports.LogoutAdvertiser = LogoutAdvertiser;
