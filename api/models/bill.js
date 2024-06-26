const mongoose = require('mongoose')

/**
 * Bill Schema
 */
const billSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a bill name"]
        },
        description: {
            type: String,
            required: false
        },
        amount: {
            type: Number,
            required: [true, "Please enter a bill amount"],
            default: 0
        },
        date_due: {
            type: Date,
            required: [true, "Please enter a due date for the bill"]
        },
        date_paid: {
            type: Date,
            required: false
        }
    },
    {
        timestamps: true
    }
)

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;