const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncomeSchema = new Schema({
        user_id: { type: String, required: true },
        source: {
            type: String,
            enum: [
                'salary', 'investment', 'freelance', 'rental', 'business', 'bonus',
                'dividend', 'interest', 'royalty', 'gift', 'pension', 'social_security',
                'alimony', 'child_support', 'grant', 'award', 'unemployment', 'cash_windfall', 'miscellaneous'
            ],
            required: true
        },
        description: String,
        amount: { type: Number, required: true },
        date_received: { type: Date, required: true },
        type: { type: String, enum: ['one-time', 'recurring'], required: true },
        recurring_income_id: { type: Schema.Types.ObjectId, ref: 'RecurringIncome' }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Income', IncomeSchema);