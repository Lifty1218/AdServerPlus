const Publisher = require("../models/publisher");
const AdSpace = require("../models/adSpace");
const Domain = require("../models/domain");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { adScriptURL, webAnalyticsScriptURL } = require("../localData");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

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

// PUBLISHER LOCAL STRATEGY
passport.use("publisher", Publisher.createStrategy());

// PASSPORT SERIALIZE/DESERIALIZE PUBLISHER (SESSION STORE etc)
passport.serializeUser((publisher, done) => {
  done(null, publisher._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const publisher = await Publisher.findById(id);
    return done(null, publisher);
  } catch (err) {
    return done(err);
  }
});

// PUBLISHER GOOGLE STRATEGY
passport.use(
  "google-publisher",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/publisher/auth/google/dashboard",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const publisher = await Publisher.findOne({ googleId: profile.id });
        if (!publisher) {
          const stripeAccount = await stripe.accounts.create({
            type: "express",
            country: "US",
            email: profile.emails[0].value,
            capabilities: {
              card_payments: { requested: true },
              transfers: { requested: true },
            },
          });

          console.log(stripeAccount.id);

          const newPublisher = new Publisher({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            imageURL: profile.photos[0].value,
            dob: "2000-04-24",
            stripeId: stripeAccount.id,
          });
          await newPublisher.save();
          console.log("New Publisher");
          return done(null, newPublisher);
        } else {
          console.log("Already Publisher");
          return done(null, publisher);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

//        ********** FUNCTIONS ***********

// GET ALL PUBLISHERS
const GetPublishers = async (req, res) => {
  console.log("Get all publishers");
  try {
    const publisher = await Publisher.find();
    return res.status(200).send(publisher);
  } catch (err) {
    return res.send(err);
  }
};

// GET SINGLE PUBLISHER
const GetPublisherByID = async (req, res) => {
  try {
    const publisher = await Publisher.findById(req.params.id);
    return res.status(200).send(publisher);
  } catch (err) {
    return res.send(err);
  }
};

// CREATE NEW PUBLISHER
const CreatePublisher = async (req, res) => {
  const publisher = new Publisher(req.body);
  try {
    await publisher.save();
    return res.status(200).json(publisher);
  } catch (err) {
    return res.send(err);
  }
};

// UPDATE PUBLISHER
const UpdatePublisher = async (req, res) => {
  try {
    const publisher = await Publisher.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).json(publisher);
  } catch (err) {
    return res.status(400).send(err);
  }
};

// DELETE PUBLISHER
const DeletePublisher = async (req, res) => {
  try {
    const publisher = await Publisher.findByIdAndDelete(req.params.id);
    return res.status(200).json(publisher);
  } catch (err) {
    return res.status(400).send(err);
  }
};

// AUTHENTICATE PUBLISHER ON LOGIN
const AuthenticatePublisher = passport.authenticate("publisher");

// RETURN RESPONSE AFTER PUBLISHER AUTHENTICATED
const Authenticated = (req, res) => {
  // Publisher is already authenticated in the AuthenticatePublisher middleware
  console.log("Login Successful");
  return res.status(200).json({
    _id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    dob: req.user.dob,
    imageURL: req.user.imageURL,
    stripeId: req.user.stripeId,
  });
};

// REGISTER PUBLISHER ON SIGNUP
const RegisterPublisher = (req, res) => {
  const { email, name, dob, password } = req.body;
  console.log("email: " + email);
  Publisher.register(
    new Publisher({
      email: email,
      name: name,
      dob: dob,
    }),
    password,
    (err, publisher) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      } else {
        passport.authenticate("publisher")(req, res, async () => {
          console.log("Signup Successful");

          const stripeAccount = await stripe.accounts.create({
            type: "express",
            country: "US",
            email: publisher.email,
            capabilities: {
              card_payments: { requested: true },
              transfers: { requested: true },
            },
          });

          const accountLink = await stripe.accountLinks.create({
            account: stripeAccount.id,
            refresh_url: "http://localhost:5173/publisher",
            return_url: "http://localhost:5173/publisher",
            type: "account_onboarding",
          });

          await Publisher.findByIdAndUpdate(
            publisher._id,
            {
              stripeId: stripeAccount.id,
            },
            { new: true }
          );

          return res.status(200).json({
            _id: publisher._id,
            email: publisher.email,
            name: publisher.name,
            dob: publisher.dob,
            imageURL: publisher.imageURL,
            stripeId: stripeAccount.id,
            accountLink: accountLink.url,
          });
        });
      }
    }
  );
};

// LOGOUT PUBLISHER
const LogoutPublisher = (req, res) => {
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
const GoogleAuthenticate = passport.authenticate("google-publisher", {
  scope: ["profile", "email"],
});
// GOOGLE AUTHENTICATION REDIRECT
const GoogleAuthenticateRedirect = passport.authenticate("google-publisher", {
  failureRedirect: "http://localhost:5173/publisher/login",
});

const GoogleAuthenticated = async (req, res) => {
  const account = await stripe.accounts.retrieve(req.user.stripeId);
  if (!account.details_submitted) {
    console.log("The account has not completed the onboarding process.");
    if (!req.user.stripeId) {
      console.log("No Stripe Id");
      const stripeAccount = await stripe.accounts.create({
        type: "express",
        country: "US",
        email: req.user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      await Publisher.findByIdAndUpdate(req.user.id, {
        stripeId: stripeAccount.id,
      });
      const accountLink = await stripe.accountLinks.create({
        account: stripeAccount.id,
        refresh_url: "http://localhost:5173/publisher/login",
        return_url: `http://localhost:5173/publisher/login?id=${req.user._id}&name=${req.user.name}&email=${req.user.email}&imageURL=${req.user.imageURL}&dob=${req.user.dob}&stripeId=${stripeAccount.id}&googleId=${req.user.googleId}`,
        type: "account_onboarding",
      });
      res.redirect(303, accountLink.url);
    } else {
      console.log("Found Stripe Id");
      const accountLink = await stripe.accountLinks.create({
        account: req.user.stripeId,
        refresh_url: "http://localhost:5173/publisher/login",
        return_url: `http://localhost:5173/publisher/login?id=${req.user._id}&name=${req.user.name}&email=${req.user.email}&imageURL=${req.user.imageURL}&dob=${req.user.dob}&stripeId=${req.user.stripeId}&googleId=${req.user.googleId}`,
        type: "account_onboarding",
      });
      res.redirect(303, accountLink.url);
    }
  } else {
    console.log("The account has completed the onboarding process.");
    res.redirect(
      `http://localhost:5173/publisher/login?id=${req.user._id}&name=${req.user.name}&email=${req.user.email}&imageURL=${req.user.imageURL}&dob=${req.user.dob}&stripeId=${req.user.stripeId}&googleId=${req.user.googleId}`
    );
  }
};

const AddDomain = async (req, res) => {
  const publisherId = req.params.id;

  try {
    const domain = new Domain({
      name: req.body.name,
      url: req.body.url,
      category: req.body.category,
      publisher: publisherId,
    });

    await domain.save();

    const domainId = domain._id;

    const webAnalyticsScript = `<script src="${webAnalyticsScriptURL}" data-domain-id="${domainId}"></script>`;

    await Domain.findByIdAndUpdate(domainId, {
      webAnalyticsScript: webAnalyticsScript,
    });

    const publisher = await Publisher.findByIdAndUpdate(
      publisherId,
      { $push: { domains: domainId } },
      {
        new: true,
      }
    ).populate("domains");

    return res
      .status(200)
      .send({ publisher: publisher, webAnalyticsScript: webAnalyticsScript });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const AddAdSpace = async (req, res) => {
  const { publisher, domain, adSize, adType } = req.body;
  let cpc = 0;
  let cpm = 0;
  try {
    const domainItem = await Domain.findById(domain);
    const domainScore = domainItem.score;
    if (domainScore > 90) {
      cpc = 0.34;
      cpm = 0.5;
    } else if (domainScore > 80) {
      cpc = 0.32;
      cpm = 0.47;
    } else if (domainScore > 70) {
      cpc = 0.3;
      cpm = 0.44;
    } else if (domainScore > 60) {
      cpc = 0.28;
      cpm = 0.41;
    } else if (domainScore > 50) {
      cpc = 0.26;
      cpm = 0.38;
    } else if (domainScore > 40) {
      cpc = 0.24;
      cpm = 0.35;
    } else if (domainScore > 30) {
      cpc = 0.22;
      cpm = 0.32;
    } else if (domainScore > 20) {
      cpc = 0.2;
      cpm = 0.29;
    } else if (domainScore > 10) {
      cpc = 0.18;
      cpm = 0.26;
    } else {
      cpc = 0.16;
      cpm = 0.23;
    }

    const adSpace = new AdSpace({
      publisher: publisher,
      domain: domain,
      adSize: adSize,
      adType: adType,
      cpc: cpc,
      cpm: cpm,
    });

    await adSpace.save();
    const adSpaceId = adSpace._id;

    await Domain.findByIdAndUpdate(req.params.id, {
      $push: { adSpaces: adSpaceId },
    });

    const scriptTag = `<script src="${adScriptURL}" data-ad-tag="${adSpaceId}"></script>`;
    const adContainer = `<div data-ad-placeholder="${adSpaceId}"></div>`;

    await AdSpace.findByIdAndUpdate(adSpaceId, {
      scriptTag: scriptTag,
      adContainer: adContainer,
    });
    res.status(200).send({ scriptTag: scriptTag, adContainer: adContainer });
  } catch (error) {
    res.status(400).send(error);
  }
};

const GetAddSpaces = async (req, res) => {
  const publisherId = req.params.id;

  try {
    const domains = await Domain.find({ publisher: publisherId }).populate({
      path: "adSpaces",
      populate: {
        path: "domain",
      },
    });

    const adSpaces = domains.reduce((acc, domain) => {
      acc.push(...domain.adSpaces);
      return acc;
    }, []);

    res.status(200).send(adSpaces);
  } catch (error) {
    res.status(400).send(error);
  }
};

const GetDomains = async (req, res) => {
  const publisherId = req.params.id;

  try {
    const domains = await Domain.find({ publisher: publisherId });
    res.status(200).send(domains);
  } catch (error) {
    res.status(400).send(error);
  }
};

const GetAdRequests = async (req, res) => {
  const publisherId = req.params.id;

  try {
    const adSpaces = await AdSpace.find({ publisher: publisherId })
      .populate("requestedAds")
      .populate("domain");
    res.status(200).send(adSpaces);
  } catch (error) {
    res.status(400).send(error);
  }
};

const GetStripeAccountFunds = async (req, res) => {
  const publisherId = req.params.id;

  try {
    const publisher = await Publisher.findById(publisherId);
    const balance = await stripe.balance.retrieve({
      stripeAccount: publisher.stripeId,
    });
    res.status(200).json(balance.available[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET PUBLISHERS WHO HAVE INITIALIZED COMMUNICATION WITH THE ADMIN
const getInitializedPublishers = (req, res) => {
  console.log("Get Initialized Publishers");
  Publisher.find({ messages: { $exists: true, $not: { $size: 0 } } })
    .then((publishers) => {
      const publishersArray = publishers.map((publisher) => {
        return {
          _id: publisher._id,
          name: publisher.name,
          email: publisher.email,
          imageURL: publisher.imageURL,
          message: publisher.messages[publisher.messages.length - 1],
        };
      });
      res.json(publishersArray);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

// GET CHAT HISTORY FOR A SPECIFIC PUBLISHER
const getChatHistory = (req, res) => {
  const publisherId = req.params.id;

  Publisher.findById(publisherId)
    .then((publisher) => {
      res.json(publisher.messages);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

const UploadFileMulter = upload.single("adImage");

// UPDATE PUBLISHER PROFILE
const UpdatePublisherProfile = async (req, res) => {
  try {
    let publisher = null;
    if (req.file) {
      publisher = await Publisher.findByIdAndUpdate(
        req.params.id,
        { ...req.body, imageURL: req.file.path },
        {
          new: true,
        }
      );
    } else {
      publisher = await Publisher.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
    }
    return res.status(200).json(publisher);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

const ChangePassword = async (req, res) => {
  console.log("Hello");
  Publisher.findByUsername(req.user.email).then((publisher) => {
    publisher.changePassword(req.body.password, req.body.newPassword, (err) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        res.status(200).send("Password changed successfully!");
      }
    });
  });
};

const GetPublisherStatistics = async (req, res) => {
  const publisherId = req.params.id;

  try {
    const publisher = await Publisher.findById(publisherId);

    const domainCount = await Domain.countDocuments({ publisher: publisherId });
    const adSpaceCount = await AdSpace.countDocuments({
      domain: { $in: publisher.domains },
    });

    const adSpacesWithAd = await AdSpace.countDocuments({
      domain: { $in: publisher.domains },
      ad: { $ne: null },
    });

    const requestedAdCount = await AdSpace.aggregate([
      { $match: { domain: { $in: publisher.domains } } },
      { $unwind: "$requestedAds" },
      { $count: "requestedAdCount" },
    ]);

    const result = {
      domainCount,
      adSpaceCount,
      requestedAdCount:
        requestedAdCount.length > 0 ? requestedAdCount[0].requestedAdCount : 0,
      filledAdSpaces: adSpacesWithAd,
      emptyAdSpaces: adSpaceCount - adSpacesWithAd,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.GetPublishers = GetPublishers;
exports.GetPublisherByID = GetPublisherByID;
exports.CreatePublisher = CreatePublisher;
exports.UpdatePublisher = UpdatePublisher;
exports.DeletePublisher = DeletePublisher;

exports.AddDomain = AddDomain;
exports.AddAdSpace = AddAdSpace;
exports.GetAddSpaces = GetAddSpaces;
exports.GetDomains = GetDomains;
exports.GetAdRequests = GetAdRequests;

exports.RegisterPublisher = RegisterPublisher;
exports.AuthenticatePublisher = AuthenticatePublisher;
exports.Authenticated = Authenticated;

exports.GoogleAuthenticate = GoogleAuthenticate;
exports.GoogleAuthenticateRedirect = GoogleAuthenticateRedirect;
exports.GoogleAuthenticated = GoogleAuthenticated;

exports.getInitializedPublishers = getInitializedPublishers;
exports.getChatHistory = getChatHistory;
exports.GetStripeAccountFunds = GetStripeAccountFunds;
exports.UploadFileMulter = UploadFileMulter;
exports.UpdatePublisherProfile = UpdatePublisherProfile;
exports.ChangePassword = ChangePassword;
exports.GetPublisherStatistics = GetPublisherStatistics;

exports.LogoutPublisher = LogoutPublisher;
