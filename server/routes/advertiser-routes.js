const express = require("express");
const advertiserController = require("../controllers/advertiser-controller");

const router = express.Router();

// ADVERTISER ROUTES

// Get all advertisers
router.get("/", advertiserController.GetAdvertisers);

// Get a single advertiser by ID
router.get("/single/:id", advertiserController.GetAdvertiserByID);

// Create a new advertiser
router.post("/", advertiserController.CreateAdvertiser);

// Update a advertiser by ID
router.put("/:id", advertiserController.UpdateAdvertiser);

// Update a advertiser by ID
router.patch("/:id", advertiserController.UpdateAdvertiser);

// Delete a advertiser by ID
router.delete("/:id", advertiserController.DeleteAdvertiser);

// Advertiser Authentication
router.post(
  "/auth",
  advertiserController.AuthenticateAdvertiser,
  advertiserController.Authenticated
);

router.post("/register", advertiserController.RegisterAdvertiser);

// GOOGLE AUTHENTICATION
router.get("/auth/google", advertiserController.GoogleAuthenticate);
router.get(
  "/auth/google/dashboard",
  advertiserController.GoogleAuthenticateRedirect,
  advertiserController.GoogleAuthenticated
);

// LOGOUT
router.get("/logout", advertiserController.LogoutAdvertiser);

// Upload Image file to cloudinary
router.post(
  "/upload",
  advertiserController.UploadFileMulter,
  advertiserController.AdImageUpload
);

// GET ALL ADS FOR A SINGLE ADVERTISER
router.get("/ads/:id", advertiserController.GetAds);

// Get advertisers who have initialized communication
router.get("/initialized", advertiserController.getInitializedAdvertisers);

// Get chat history for a specific advertiser
router.get("/messages/:id", advertiserController.getChatHistory);

// Upload Image file to cloudinary update information
router.post(
  "/upload/:id",
  advertiserController.UploadFileMulter,
  advertiserController.UpdateAdvertiserProfile
);

router.put(
  "/change/password",
  advertiserController.AuthenticateAdvertiser,
  advertiserController.ChangePassword
);

module.exports = router;
