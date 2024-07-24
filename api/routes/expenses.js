const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expenses.controller');

// Add a one-time expense
router.post('/one-time', expensesController.addOneTimeExpense);
router.post('/recurring', expensesController.addRecurringExpense);
router.get('/', expensesController.getAllExpenses);
router.put('/one-time/:id', expensesController.updateOneTimeExpense);
router.put('/recurring/:id', expensesController.updateRecurringExpense);

module.exports = router;