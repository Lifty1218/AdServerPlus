const express = require("express");
const webAnalyticsController = require("../controllers/webAnalytics-controller");

const router = express.Router();

// WEB_ANALYTICS ROUTES

// Get all webAnalytics
router.get("/", webAnalyticsController.GetWebAnalytics);

// Get a single webAnalytics by ID
router.get("/single/:id", webAnalyticsController.GetWebAnalyticsByID);

// Create a new webAnalytics
router.post("/", webAnalyticsController.CreateWebAnalytics);

// Update a webAnalytics by ID
router.put("/:id", webAnalyticsController.UpdateWebAnalytics);

// Update a webAnalytics by ID
router.patch("/:id", webAnalyticsController.UpdateWebAnalytics);

// Delete a webAnalytics by ID
router.delete("/:id", webAnalyticsController.DeleteWebAnalytics);

// Convert the data into storable format and create a new webAnalytics
router.post(
  "/store",
  webAnalyticsController.getFormData,
  webAnalyticsController.createNewWebAnalytics
);

router.get(
  "/average_traffic/:domainId",
  webAnalyticsController.calculateAverageTrafficPerDay
);

router.get(
  "/average_traffic_by_hour/:domainId",
  webAnalyticsController.calculateAverageTrafficByHour
);

router.get(
  "/user_count/:domainId",
  webAnalyticsController.getUserTrafficFor7Days
);

router.get(
  "/users_by_country/:domainId",
  webAnalyticsController.calculateUsersByCountry
);

router.get(
  "/users_by_device/:domainId",
  webAnalyticsController.calculateUsersByDevice
);

router.get(
  "/users_by_browser/:domainId",
  webAnalyticsController.calculateUsersByBrowser
);

router.get(
  "/users_by_single_country/:country",
  webAnalyticsController.calculateUsersBySpecificCountry
);

router.get(
  "/average_session/:domainId",
  webAnalyticsController.getAverageSessionDuration
);

router.get("/location", webAnalyticsController.getLocation);

module.exports = router;
