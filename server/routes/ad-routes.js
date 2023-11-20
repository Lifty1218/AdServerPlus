const express = require("express");
const adController = require("../controllers/ad-controller");

const router = express.Router();

// AD ROUTES

// Get all ads
router.get("/", adController.GetAds);

// Get a single ad by ID
router.get("/single/:id", adController.GetAdByID);

// Create a new ad
router.post("/", adController.CreateAd);

// Update a ad by ID
router.put("/:id", adController.UpdateAd);

// Update a ad by ID
router.patch("/:id", adController.UpdateAd);

// Delete a ad by ID
router.delete("/:id", adController.DeleteAd);

// Increment an impression
router.get("/track_impression/:id", adController.TrackImpression);

// Increment a click
router.get("/track_click/:id", adController.TrackClick);

// search for an ad space based on ad preferences
router.get("/find_ad_space/:id", adController.FindSuitableAdSpaces);

// Add an Ad to the adSpace
router.post("/ad_space/:id", adController.AddAdSpace);

module.exports = router;
