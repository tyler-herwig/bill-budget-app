const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/income.controller');

/* ------------------ General Income Routes ------------------ */

/*
    Get all incomes (both one-time and recurring)
*/
router.get('/', incomeController.getAllIncome);

/* ------------------ One-Time Income Routes ------------------ */

/*
    Create a one-time income
*/
router.post('/one-time', incomeController.addOneTimeIncome);

/*
    Update a specific one-time income by ID
*/
router.put('/one-time/:id', incomeController.updateOneTimeIncome);

/*
    Delete a specific one-time income by ID
*/
router.delete('/one-time/:id', incomeController.deleteOneTimeIncome);

/* ------------------ Recurring Income Routes ------------------ */

/*
    Create a recurring income
*/
router.post('/recurring', incomeController.addRecurringIncome);

/*
    Get all recurring incomes
*/
router.get('/recurring', incomeController.getRecurringIncomes);

/*
    Update a specific recurring income by ID
*/
router.put('/recurring/:id', incomeController.updateRecurringIncome);

/*
    Delete a specific recurring income by ID
*/
router.delete('/recurring/:id', incomeController.deleteRecurringIncome);

module.exports = router;