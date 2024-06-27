// Import necessary modules
const express = require("express");
const { getAllPaychecks, addPaycheck } = require("../controllers/paycheck.controller.js");

// Create a router object
const router = express.Router();

// Define routes
router.get('/paychecks', getAllPaychecks);
router.post('/paychecks', addPaycheck);

// Export the router
module.exports = router;