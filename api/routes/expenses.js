const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expenses.controller');
const authenticate = require('../middleware/authenticate');

/* ------------------ General Expense Routes ------------------ */

/*
    Get all expenses (both one-time and recurring)
*/
router.get('/', authenticate, expensesController.getAllExpenses);

/* ------------------ One-Time Expense Routes ------------------ */

/*
    Create a one-time expense
*/
router.post('/one-time', authenticate, expensesController.addOneTimeExpense);

/*
    Update a specific one-time expense by ID
*/
router.put('/one-time/:id', authenticate, expensesController.updateOneTimeExpense);

/*
    Delete a specific one-time expense by ID
*/
router.delete('/one-time/:id', authenticate, expensesController.deleteOneTimeExpense);

/* ------------------ Recurring Expense Routes ------------------ */

/*
    Create a recurring expense
*/
router.post('/recurring', authenticate, expensesController.addRecurringExpense);

/*
    Update a specific recurring expense by ID
*/
router.put('/recurring/:id', authenticate, expensesController.updateRecurringExpense);

/*
    Delete a specific recurring expense by ID
*/
router.delete('/recurring/:id', authenticate, expensesController.deleteRecurringExpense);

module.exports = router;