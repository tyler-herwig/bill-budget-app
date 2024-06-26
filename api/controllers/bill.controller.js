const Bill = require('../models/bill'); // Adjust the path to your Bill model

exports.getAllBills = async (req, res) => {
    try {
        const results = await Bill.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$date_due" },
                        month: { $month: "$date_due" }
                    },
                    bills: {
                        $push: {
                            _id: "$_id",
                            name: "$name",
                            description: "$description",
                            amount: "$amount",
                            date_due: "$date_due",
                            date_paid: "$date_paid"
                        }
                    },
                    totalAmount: { $sum: "$amount" } // Optionally, calculate the total amount for each group
                }
            },
            {
                $addFields: {
                    "monthName": {
                        $arrayElemAt: [
                            ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                            "$_id.month"
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$_id.year",
                    months: {
                        $push: {
                            month: "$_id.month",
                            monthName: "$monthName",
                            bills: "$bills",
                            totalAmount: "$totalAmount" // Include totalAmount if needed
                        }
                    }
                }
            },
            {
                $sort: { "_id": 1 } // Sort by year
            },
            {
                $unwind: "$months"
            },
            {
                $sort: { "months.month": 1 } // Sort by month within each year
            },
            {
                $group: {
                    _id: "$_id",
                    months: { $push: "$months" }
                }
            }
        ]);

        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
