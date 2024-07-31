const Expense = require('../models/Expense');
const RecurringExpense = require('../models/RecurringExpense');

// Utility function to generate recurring instances
const generateRecurringInstances = (recurringExpense, skipPastDates = false) => {
    const instances = [];
    const { name, description, amount, recurrence } = recurringExpense;
    const { frequency, start_date, end_date } = recurrence;

    // Convert start_date and end_date to Date objects in UTC
    let currentDate = new Date(start_date);
    currentDate.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 UTC
    const finalDate = end_date ? new Date(end_date) : null;

    if (finalDate) {
        finalDate.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 UTC
    }

    // Handle the case where the start_date is later than the end_date
    if (finalDate && currentDate > finalDate) {
        throw new Error('Start date cannot be after the end date.');
    }

    if (skipPastDates) {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 UTC

        // Skip past dates based on the frequency
        while (currentDate < today) {
            if (frequency === 'monthly') {
                currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
            } else if (frequency === 'weekly') {
                currentDate.setUTCDate(currentDate.getUTCDate() + 7);
            } else if (frequency === 'daily') {
                currentDate.setUTCDate(currentDate.getUTCDate() + 1);
            } else if (frequency === 'yearly') {
                currentDate.setUTCFullYear(currentDate.getUTCFullYear() + 1);
            } else {
                throw new Error('Invalid frequency type');
            }

            // Avoid skipping beyond the end date
            if (finalDate && currentDate > finalDate) {
                return instances; // No instances to generate
            }
        }
    }

    // Generate recurring instances
    while (!finalDate || currentDate <= finalDate) {
        // Create a copy of the date to avoid modifying the original date
        const dueDate = new Date(currentDate);

        instances.push({
            name,
            description,
            amount,
            type: 'recurring',
            date_due: dueDate.toISOString(), // Store date as ISO string
            status: 'unpaid',
            recurring_expense_id: recurringExpense._id,
            createdAt: new Date().toISOString(), // Store creation date as ISO string
            updatedAt: new Date().toISOString()  // Store update date as ISO string
        });

        // Increment the date based on the frequency
        if (frequency === 'monthly') {
            currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
            const dayOfMonth = new Date(start_date).getUTCDate();
            if (currentDate.getUTCDate() < dayOfMonth) {
                currentDate.setUTCDate(0); // Move to last day of previous month
            }
            currentDate.setUTCDate(dayOfMonth);
        } else if (frequency === 'weekly') {
            currentDate.setUTCDate(currentDate.getUTCDate() + 7);
        } else if (frequency === 'daily') {
            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        } else if (frequency === 'yearly') {
            currentDate.setUTCFullYear(currentDate.getUTCFullYear() + 1);
        } else {
            throw new Error('Invalid frequency type');
        }

        // Avoid creating instances beyond the end date
        if (finalDate && currentDate > finalDate) {
            break;
        }

        // Limit the number of generated instances to avoid excessive memory use
        if (instances.length > 1000) {
            throw new Error('Too many instances generated. Consider adjusting the date range or frequency.');
        }
    }

    return instances;
};

// Add a one-time expense
exports.addOneTimeExpense = async (req, res) => {
    try {
        const { date_due } = req.body;

        // Ensure date_due is provided
        if (!date_due) {
            return res.status(400).json({ message: 'Due date is required for one-time expenses' });
        }

        // Convert date_due to a Date object
        const dueDate = new Date(date_due);
        const today = new Date();

        // Ensure date_due is today or in the future
        if (dueDate < today.setHours(0, 0, 0, 0)) {
            return res.status(400).json({ message: 'Due date must be today or in the future' });
        }

        // Proceed with adding the one-time expense
        const expense = await Expense.create({
            ...req.body,
            type: 'one-time'
        });

        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a recurring expense
exports.addRecurringExpense = async (req, res) => {
    try {
        const { start_date } = req.body.recurrence;
        const { end_date } = req.body.recurrence;

        // Ensure start_date is provided
        if (!start_date) {
            return res.status(400).json({ message: 'Start date is required for recurring expenses' });
        }

        // Ensure end_date is provided
        if (!end_date) {
            return res.status(400).json({ message: 'End date is required for recurring expenses' });
        }

        // Convert start_date & end_date to a Date object
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (endDate <= startDate) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        // Proceed with adding the recurring expense
        const recurringExpense = await RecurringExpense.create(req.body);

        // Generate and add new instances
        const newInstances = generateRecurringInstances(recurringExpense);
        await Expense.insertMany(newInstances);

        res.status(200).json({ recurringExpense, instances: newInstances });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all expenses grouped by year and month
exports.getAllExpenses = async (req, res) => {
    const { start_date, end_date } = req.query;

    // Convert query parameters to JavaScript Date objects
    const start = start_date ? new Date(start_date) : new Date(0); // Default to the earliest date if not provided
    const end = end_date ? new Date(end_date) : new Date(); // Default to now if not provided

    try {
        const expenses = await Expense.aggregate([
            {
                $match: {
                    date_due: {
                        $gte: start,
                        $lte: end
                    }
                }
            },
            {
                $lookup: {
                    from: 'recurringexpenses',
                    localField: 'recurring_expense_id',
                    foreignField: '_id',
                    as: 'recurrenceInfo'
                }
            },
            {
                $unwind: {
                    path: '$recurrenceInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    year: { $year: '$date_due' },
                    month: { $month: '$date_due' },
                    dateDueKey: {
                        $dateToString: { format: "%Y-%m-%d", date: '$date_due' }
                    }
                }
            },
            {
                $group: {
                    _id: { year: '$year', month: '$month' },
                    expenses: {
                        $push: {
                            _id: '$_id',
                            name: '$name',
                            description: '$description',
                            amount: '$amount',
                            date_due: '$date_due',
                            date_paid: '$date_paid',
                            type: '$type',
                            status: '$status',
                            recurring_expense_id: '$recurring_expense_id',
                            recurrence: {
                                $cond: [
                                    { $eq: ['$recurring_expense_id', null] },
                                    '$$REMOVE',
                                    {
                                        frequency: '$recurrenceInfo.recurrence.frequency',
                                        start_date: '$recurrenceInfo.recurrence.start_date',
                                        end_date: '$recurrenceInfo.recurrence.end_date'
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    fullMonthName: {
                        $arrayElemAt: [
                            [
                                '',
                                'January',
                                'February',
                                'March',
                                'April',
                                'May',
                                'June',
                                'July',
                                'August',
                                'September',
                                'October',
                                'November',
                                'December'
                            ],
                            '$_id.month'
                        ]
                    },
                    expenses: 1
                }
            },
            {
                $addFields: {
                    expenses: {
                        $map: {
                            input: { $filter: { input: '$expenses', as: 'expense', cond: { $ne: ['$$expense.date_due', null] } } },
                            as: 'expense',
                            in: {
                                _id: '$$expense._id',
                                name: '$$expense.name',
                                description: '$$expense.description',
                                amount: '$$expense.amount',
                                date_due: '$$expense.date_due',
                                date_paid: '$$expense.date_paid',
                                type: '$$expense.type',
                                status: '$$expense.status',
                                recurring_expense_id: '$$expense.recurring_expense_id',
                                recurrence: '$$expense.recurrence'
                            }
                        }
                    }
                }
            },
            {
                $unwind: '$expenses'
            },
            {
                $sort: { 'expenses.date_due': 1 } // Sort by date_due within each group
            },
            {
                $group: {
                    _id: { year: '$year', month: '$month' },
                    expenses: { $push: '$expenses' },
                    totalAmount: { $sum: '$expenses.amount' }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    fullMonthName: {
                        $arrayElemAt: [
                            [
                                '',
                                'January',
                                'February',
                                'March',
                                'April',
                                'May',
                                'June',
                                'July',
                                'August',
                                'September',
                                'October',
                                'November',
                                'December'
                            ],
                            '$_id.month'
                        ]
                    },
                    expenses: 1,
                    totalAmount: 1
                }
            },
            {
                $sort: { year: 1, month: 1 } // Final sort by year and month
            }
        ]);

        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOneTimeExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Expense ID is required' });
        }

        // Check if date_due is being updated
        if (updatedData.date_due) {
            const dueDate = new Date(updatedData.date_due);
            const today = new Date();

            // Ensure date_due is today or in the future
            if (dueDate < today.setHours(0, 0, 0, 0)) {
                return res.status(400).json({ message: 'Due date must be today or in the future' });
            }
        }

        // Update the one-time expense document
        const updatedOneTimeExpense = await Expense.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedOneTimeExpense) {
            return res.status(404).json({ message: 'One-time expense not found' });
        }

        res.status(200).json(updatedOneTimeExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRecurringExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Expense ID is required' });
        }

        if (updatedData.recurrence.end_date <= updatedData.recurrence.start_date) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        // Update the recurring expense document
        const updatedRecurringExpense = await RecurringExpense.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedRecurringExpense) {
            return res.status(404).json({ message: 'Recurring expense not found' });
        }

        // Generate new instances based on updated data
        const newInstances = generateRecurringInstances(updatedRecurringExpense, true);

        // Remove instances that are after today
        await Expense.deleteMany({
            recurring_expense_id: id,
            date_due: { $gte: new Date() }
        });

        // Add new instances
        await Expense.insertMany(newInstances);

        res.status(200).json(updatedRecurringExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
