// Import necessary modules
const express = require("express");
const { getAllBills } = require("../controllers/bill.controller.js");

// Create a router object
const router = express.Router();

// Define routes
router.get('/bills', getAllBills);

// Export the router
module.exports = router;