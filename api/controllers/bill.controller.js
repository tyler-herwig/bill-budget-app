const Bill = require('../models/bill');

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
                    totalAmount: { $sum: "$amount" }
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
                            totalAmount: "$totalAmount"
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

exports.updateBillById = async(req, res) => {
    try {
        const {id} = req.params;
        const bill = await Bill.findByIdAndUpdate(id, req.body)

        // Cannot find bill in database
        if (!bill) {
            return res.status(404).json({message: 'Cannot find bill'})
        }

        // Get product after update for response to user
        const updatedBill = await Bill.findById(id);
        res.status(200).json(updatedBill)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
