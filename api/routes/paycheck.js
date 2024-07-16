// Import necessary modules
const express = require("express");
const { getAllPaychecks, addPaycheck, updatePaycheck } = require("../controllers/paycheck.controller.js");

// Create a router object
const router = express.Router();

// Define routes
router.get('/paychecks', getAllPaychecks);
router.post('/paychecks', addPaycheck);
router.put('/paychecks/:id', updatePaycheck);

// Export the router
module.exports = router;