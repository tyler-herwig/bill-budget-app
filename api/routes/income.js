const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/income.controller');

router.post('/one-time', incomeController.addOneTimeIncome);
router.post('/recurring', incomeController.addRecurringIncome);
router.get('/', incomeController.getAllIncome);
router.put('/one-time/:id', incomeController.updateOneTimeIncome);
router.put('/recurring/:id', incomeController.updateRecurringIncome);

module.exports = router;