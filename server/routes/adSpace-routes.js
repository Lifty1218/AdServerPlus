const express = require("express");
const adSpaceController = require("../controllers/adSpace-controller");

const router = express.Router();

// AD_SPACES ROUTES

// Get all adSpaces
router.get("/", adSpaceController.GetAdSpaces);

// Get a single adSpace by ID
router.get("/single/:id", adSpaceController.GetAdSpaceByID);

// Create a new adSpace
router.post("/", adSpaceController.CreateAdSpace);

// Update a adSpace by ID
router.put("/:id", adSpaceController.UpdateAdSpace);

// Update a adSpace by ID
router.patch("/:id", adSpaceController.UpdateAdSpace);

// Delete a adSpace by ID
router.delete("/:id", adSpaceController.DeleteAdSpace);

// Remove an ad_request
router.patch("/requested_ad/:id", adSpaceController.RemoveAdRequest);

// Increment an impression
router.get("/track_impression/:id", adSpaceController.TrackImpression);

// Increment a click
router.get("/track_click/:id", adSpaceController.TrackClick);

module.exports = router;
