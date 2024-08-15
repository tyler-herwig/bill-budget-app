const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecurringIncomeSchema = new Schema({
        user_id: { type: String, required: true },
        source: { type: String, required: true },
        description: String,
        amount: { type: Number, required: true },
        recurrence: {
            frequency: { type: String, required: true },
            start_date: { type: Date, required: true },
            end_date: Date
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('RecurringIncome', RecurringIncomeSchema);