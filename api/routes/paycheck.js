// Import necessary modules
const express = require("express");
const { getAllPaychecks } = require("../controllers/paycheck.controller.js");

// Create a router object
const router = express.Router();

// Define routes
router.get('/paychecks', getAllPaychecks);

// Export the router
module.exports = router;