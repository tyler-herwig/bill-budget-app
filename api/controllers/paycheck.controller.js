const Paycheck = require('../models/paycheck');
const Bill = require('../models/bill');

exports.getAllPaychecks = async (req, res) => {
    try {
        // Retrieve all paychecks and bills
        const paychecks = await Paycheck.find().sort({ date: 1 });
        const bills = await Bill.find().sort({ date_due: 1 });

        const results = [];

        // Loop through each paycheck
        for (let i = 0; i < paychecks.length; i++) {
            const paycheck = paychecks[i];
            const nextPaycheck = paychecks[i + 1] || { date: new Date(2100, 0, 1) }; // far future date

            // Calculate total bills amount between current paycheck and the next paycheck
            const billsBetween = bills.filter(
                bill => bill.date_due >= paycheck.date && bill.date_due < nextPaycheck.date
            );
            const totalBillsAmount = billsBetween.reduce((total, bill) => total + bill.amount, 0);

            // Subtract total bills amount from paycheck amount
            const remainingAmount = paycheck.amount - totalBillsAmount;

            results.push({
                date: paycheck.date,
                amount: paycheck.amount,
                total_bills: totalBillsAmount,
                money_remaining: remainingAmount
            });
        }

        res.json(results);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.addPaycheck = async (req, res) => {
    try {
        const paycheck = await Paycheck.create(req.body)
        res.status(200).json(paycheck)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};
