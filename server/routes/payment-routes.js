const express = require("express");
const paymentController = require("../controllers/payment-controller");

const router = express.Router();

// DOMAIN ROUTES

// Get all payments
router.get("/", paymentController.GetPayments);

// Get a single payment by ID
router.get("/single/:id", paymentController.GetPaymentByID);

// Create a new payment
router.post("/", paymentController.CreatePayment);

// Update a payment by ID
router.put("/:id", paymentController.UpdatePayment);

// Update a payment by ID
router.patch("/:id", paymentController.UpdatePayment);

// Delete a payment by ID
router.delete("/:id", paymentController.DeletePayment);

// Perform Checkout for an advertiser
router.post("/checkout", paymentController.Checkout);

// Get all payments for a specific Advertiser
router.get("/advertiser/:id", paymentController.GetAdvertiserPayments);

// Get all payments for a specific Publisher
router.get("/publisher/:id", paymentController.GetPublisherPayments);

// TRANSFER MONEY INTRO PUBLISHER'S STRIPE ACCOUNT
router.post(
  "/publisher/transfer",
  paymentController.TransferStripeFundsToPublisher
);

// Get all advertiser payments
router.get("/advertisers/all", paymentController.GetAllAdvertiserPayments);

// Get all publisher payments
router.get("/publishers/all", paymentController.GetAllPublisherPayments);

// // Get all payments for a specific Publisher
// router.get("/single/:id", paymentController.GetPaymentByID);
module.exports = router;
