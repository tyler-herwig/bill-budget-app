const Paycheck = require('../models/paycheck');

exports.getAllPaychecks = async (req, res) => {
    try {
        const paychecks = await Paycheck.find().sort({ date: 1 });
        res.status(200).json(paychecks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching paychecks', error });
    }
};
