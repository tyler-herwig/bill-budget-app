// Import necessary modules
const express = require("express");
const { getAllBills, addBill, updateBillById } = require("../controllers/bill.controller.js");

// Create a router object
const router = express.Router();

// Define routes
router.get('/bills', getAllBills);
router.post('/bills/', addBill);
router.put('/bills/:id', updateBillById);

// Export the router
module.exports = router;