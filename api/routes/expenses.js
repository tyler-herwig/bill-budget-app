const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expenses.controller');

/* ------------------ General Expense Routes ------------------ */

/*
    Get all expenses (both one-time and recurring)
*/
router.get('/', expensesController.getAllExpenses);

/* ------------------ One-Time Expense Routes ------------------ */

/*
    Create a one-time expense
*/
router.post('/one-time', expensesController.addOneTimeExpense);

/*
    Update a specific one-time expense by ID
*/
router.put('/one-time/:id', expensesController.updateOneTimeExpense);

/*
    Delete a specific one-time expense by ID
*/
router.delete('/one-time/:id', expensesController.deleteOneTimeExpense);

/* ------------------ Recurring Expense Routes ------------------ */

/*
    Create a recurring expense
*/
router.post('/recurring', expensesController.addRecurringExpense);

/*
    Update a specific recurring expense by ID
*/
router.put('/recurring/:id', expensesController.updateRecurringExpense);

/*
    Delete a specific recurring expense by ID
*/
router.delete('/recurring/:id', expensesController.deleteRecurringExpense);

module.exports = router;