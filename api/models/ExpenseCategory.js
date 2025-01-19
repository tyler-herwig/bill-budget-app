const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpenseCategorySchema = new Schema({
    description: String,
    order: Number
});

module.exports = mongoose.model('Expense_Categories', ExpenseCategorySchema);