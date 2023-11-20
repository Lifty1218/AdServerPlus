const express = require("express");
const adminController = require("../controllers/admin-controller");

const router = express.Router();

// ADMIN AUTHENTICATION
router.post("/auth", adminController.AuthenticateAdmin);

module.exports = router;