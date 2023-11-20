const express = require("express");
const domainController = require("../controllers/domain-controller");

const router = express.Router();

// DOMAIN ROUTES

// Get all domains
router.get("/", domainController.GetDomains);

// Get a single domain by ID
router.get("/single/:id", domainController.GetDomainByID);

// Create a new domain
router.post("/", domainController.CreateDomain);

// Update a domain by ID
router.put("/:id", domainController.UpdateDomain);

// Update a domain by ID
router.patch("/:id", domainController.UpdateDomain);

// Delete a domain by ID
router.delete("/:id", domainController.DeleteDomain);

// Calculate a domain score based on their web analytics
router.get("/score/:domainId", domainController.CalculateDomainScore);

// Calculate a domain score based on their web analytics
router.get("/update_rankings", domainController.UpdateDomainRankings);

module.exports = router;
