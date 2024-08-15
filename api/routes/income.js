const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/income.controller');
const authenticate = require('../middleware/authenticate');

/* ------------------ General Income Routes ------------------ */

/*
    Get all incomes (both one-time and recurring)
*/
router.get('/', authenticate, incomeController.getAllIncome);

/* ------------------ One-Time Income Routes ------------------ */

/*
    Create a one-time income
*/
router.post('/one-time', authenticate, incomeController.addOneTimeIncome);

/*
    Update a specific one-time income by ID
*/
router.put('/one-time/:id', authenticate, incomeController.updateOneTimeIncome);

/*
    Delete a specific one-time income by ID
*/
router.delete('/one-time/:id', authenticate, incomeController.deleteOneTimeIncome);

/* ------------------ Recurring Income Routes ------------------ */

/*
    Create a recurring income
*/
router.post('/recurring', authenticate, incomeController.addRecurringIncome);

/*
    Get all recurring incomes
*/
router.get('/recurring', authenticate, incomeController.getRecurringIncomes);

/*
    Update a specific recurring income by ID
*/
router.put('/recurring/:id', authenticate, incomeController.updateRecurringIncome);

/*
    Delete a specific recurring income by ID
*/
router.delete('/recurring/:id', authenticate, incomeController.deleteRecurringIncome);

module.exports = router;