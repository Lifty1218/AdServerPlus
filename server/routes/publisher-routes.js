const express = require("express");
const publisherController = require("../controllers/publisher-controller");

const router = express.Router();

// PUBLISHER ROUTES

// Get all publishers
router.get("/", publisherController.GetPublishers);

// Get a single publisher by ID
router.get("/single/:id", publisherController.GetPublisherByID);

// Create a new publisher
router.post("/", publisherController.CreatePublisher);

// Update a publisher by ID
router.put("/:id", publisherController.UpdatePublisher);

// Update a publisher by ID
router.patch("/:id", publisherController.UpdatePublisher);

// Delete a publisher by ID
router.delete("/:id", publisherController.DeletePublisher);

// Publisher Authentication
router.post(
  "/auth",
  publisherController.AuthenticatePublisher,
  publisherController.Authenticated
);

router.post("/register", publisherController.RegisterPublisher);

// GOOGLE AUTHENTICATION
router.get("/auth/google", publisherController.GoogleAuthenticate);
router.get(
  "/auth/google/dashboard",
  publisherController.GoogleAuthenticateRedirect,
  publisherController.GoogleAuthenticated
);

// LOGOUT
router.get("/logout", publisherController.LogoutPublisher);

// ADD DOMAIN
router.post("/domain/:id", publisherController.AddDomain);

// ADD AN AD_SPACE
router.post("/ad_space/:id", publisherController.AddAdSpace);

// GET ALL DOMAINS OF A SINGLE PUBLISHER
router.get("/domain/:id", publisherController.GetDomains);

// GET ALL AD_SPACES OF A SINGLE PUBLISHER
router.get("/ad_space/:id", publisherController.GetAddSpaces);

// GET AD REQUESTS
router.get("/ad_requests/:id", publisherController.GetAdRequests);

// GET FUNDS AMOUNT WHICH EXIST IN PUBLISHER'S STRIPE ACCOUNT
router.get("/account_funds/:id", publisherController.GetStripeAccountFunds);

// Get publishers who have initialized communication
router.get("/initialized", publisherController.getInitializedPublishers);

// Get chat history for a specific publisher
router.get("/messages/:id", publisherController.getChatHistory);

// Get all the statistics for a publisher
router.get("/statistics/:id", publisherController.GetPublisherStatistics);


// Upload Image file to cloudinary update information
router.post(
  "/upload/:id",
  publisherController.UploadFileMulter,
  publisherController.UpdatePublisherProfile
);

router.put(
  "/change/password",
  publisherController.AuthenticatePublisher,
  publisherController.ChangePassword
);

module.exports = router;
