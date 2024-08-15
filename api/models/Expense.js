const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    amount: { type: Number, required: true },
    date_due: { type: Date, required: true },
    date_paid: Date,
    type: { type: String, enum: ['one-time', 'recurring'], required: true },
    status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
    recurring_expense_id: { type: Schema.Types.ObjectId, ref: 'RecurringExpense' }
},
{
    timestamps: true
});

module.exports = mongoose.model('Expense', ExpenseSchema);