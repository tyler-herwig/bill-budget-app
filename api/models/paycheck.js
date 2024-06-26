const mongoose = require('mongoose')

/**
 * Paycheck Schema
 */
const paycheckShema = mongoose.Schema(
    {
        date: {
            type: Date,
            required: [true, "Please enter a date for your paycheck"]
        },
        amount: {
            type: Number,
            required: [true, "Please enter a paycheck amount"],
            default: 0
        }
    },
    {
        timestamps: true
    }
)

const Paycheck = mongoose.model('Paycheck', paycheckShema);

module.exports = Paycheck;