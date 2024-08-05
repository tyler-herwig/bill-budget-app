const Income = require('../models/Income');
const RecurringIncome = require('../models/RecurringIncome');
const Expense = require('../models/Expense');

// Utility function to generate recurring instances
const generateRecurringInstances = (recurringIncome, skipPastDates = false) => {
    const instances = [];
    const { source, description, amount, recurrence } = recurringIncome;
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
            if (frequency === 'weekly') {
                currentDate.setUTCDate(currentDate.getUTCDate() + 7);
            } else if (frequency === 'bi-weekly') {
                currentDate.setUTCDate(currentDate.getUTCDate() + 14);
            } else if (frequency === 'semi-monthly') {
                currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
                const dayOfMonth = new Date(start_date).getUTCDate();
                currentDate.setUTCDate(dayOfMonth);
                // Alternate between the 1st and 15th of the month
                if (currentDate.getUTCDate() === 1) {
                    currentDate.setUTCDate(15);
                } else {
                    currentDate.setUTCDate(1);
                }
            } else if (frequency === 'monthly') {
                currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
                const dayOfMonth = new Date(start_date).getUTCDate();
                if (currentDate.getUTCDate() < dayOfMonth) {
                    currentDate.setUTCDate(0); // Move to last day of previous month
                }
                currentDate.setUTCDate(dayOfMonth);
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
        const dateReceived = new Date(currentDate);

        instances.push({
            source,
            description,
            amount,
            date_received: dateReceived.toISOString(), // Store date as ISO string
            type: 'recurring',
            recurring_income_id: recurringIncome._id,
            createdAt: new Date().toISOString(), // Store creation date as ISO string
            updatedAt: new Date().toISOString()  // Store update date as ISO string
        });

        // Increment the date based on the frequency
        if (frequency === 'weekly') {
            currentDate.setUTCDate(currentDate.getUTCDate() + 7);
        } else if (frequency === 'bi-weekly') {
            currentDate.setUTCDate(currentDate.getUTCDate() + 14);
        } else if (frequency === 'semi-monthly') {
            currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
            const dayOfMonth = new Date(start_date).getUTCDate();
            currentDate.setUTCDate(dayOfMonth);
            // Alternate between the 1st and 15th of the month
            if (currentDate.getUTCDate() === 1) {
                currentDate.setUTCDate(15);
            } else {
                currentDate.setUTCDate(1);
            }
        } else if (frequency === 'monthly') {
            currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
            const dayOfMonth = new Date(start_date).getUTCDate();
            if (currentDate.getUTCDate() < dayOfMonth) {
                currentDate.setUTCDate(0); // Move to last day of previous month
            }
            currentDate.setUTCDate(dayOfMonth);
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

// Add a one-time income
exports.addOneTimeIncome = async (req, res) => {
    try {
        const { date_received } = req.body;

        // Ensure date_due is provided
        if (!date_received) {
            return res.status(400).json({ message: 'Received date is required for one-time income.' });
        }

        // Proceed with adding the one-time income
        const income = await Income.create({
            ...req.body,
            type: 'one-time'
        });

        res.status(200).json(income);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a recurring income
exports.addRecurringIncome = async (req, res) => {
    try {
        const { start_date } = req.body.recurrence;
        const { end_date } = req.body.recurrence;

        // Ensure start_date is provided
        if (!start_date) {
            return res.status(400).json({ message: 'Start date is required for recurring income.' });
        }

        // Ensure end_date is provided
        if (!end_date) {
            return res.status(400).json({ message: 'End date is required for recurring income.' });
        }

        // Convert start_date & end_date to a Date object
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (endDate <= startDate) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        // Proceed with adding the recurring income
        const recurringIncome = await RecurringIncome.create(req.body);

        // Generate and add new instances
        const newInstances = generateRecurringInstances(recurringIncome);
        await Income.insertMany(newInstances);

        res.status(200).json({ recurringIncome, instances: newInstances });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllIncome = async (req, res) => {
    const { start_date, end_date } = req.query;

    // Convert query parameters to JavaScript Date objects
    const start = start_date ? new Date(start_date) : new Date(0); // Default to the earliest date if not provided
    const end = end_date ? new Date(end_date) : new Date(); // Default to now if not provided

    try {
        // Retrieve all income, expenses, and recurring incomes within the date range
        const incomes = await Income.find({
            date_received: { $gte: start, $lte: end }
        }).sort({ date_received: 1 });

        const expenses = await Expense.find({
            date_due: { $gte: start, $lte: end }
        }).sort({ date_due: 1 });

        const recurringIncomes = await RecurringIncome.find();

        // Convert recurring incomes to a map for quick lookup
        const recurringIncomeMap = new Map();
        recurringIncomes.forEach(ri => {
            recurringIncomeMap.set(ri._id.toString(), ri);
        });

        const results = [];

        // Loop through each income
        for (let i = 0; i < incomes.length; i++) {
            const income = incomes[i];

            // Check if the current income source is 'salary'
            if (income.source === 'salary') {
                // Find the next income where the source is 'salary'
                let nextSalaryIncome = { date_received: new Date(2100, 0, 1) }; // far future date
                for (let j = i + 1; j < incomes.length; j++) {
                    if (incomes[j].source === 'salary') {
                        nextSalaryIncome = incomes[j];
                        break;
                    }
                }

                // Calculate total expenses amount between current salary and the next salary income
                const expensesBetween = expenses.filter(
                    expense => expense.date_due >= income.date_received && expense.date_due < nextSalaryIncome.date_received
                );
                const totalExpensesAmount = expensesBetween.reduce((total, expense) => total + expense.amount, 0);

                // Calculate additional income within the same range
                const additionalIncomeBetween = incomes.filter(
                    inc => inc.date_received > income.date_received && inc.date_received < nextSalaryIncome.date_received && inc.source !== 'salary'
                );
                const additionalIncomeAmount = additionalIncomeBetween.reduce((total, inc) => total + inc.amount, 0);

                // Collect additional income details
                const additionalIncomeDetails = additionalIncomeBetween.map(inc => ({
                    _id: inc._id,
                    source: inc.source,
                    description: inc.description,
                    date_received: inc.date_received,
                    type: inc.type,
                    recurring_income_id: inc.recurring_income_id,
                    recurrence: inc.recurring_income_id ? recurringIncomeMap.get(inc.recurring_income_id.toString()).recurrence : {},
                    amount: inc.amount
                }));

                // Look up recurrence details if recurring_income_id is set
                let recurrence = null;
                if (income.recurring_income_id) {
                    recurrence = recurringIncomeMap.get(income.recurring_income_id.toString());
                }

                // Calculate total income
                const totalIncomeAmount = income.amount + additionalIncomeAmount;

                // Subtract total expenses amount from total income
                const remainingAmount = totalIncomeAmount - totalExpensesAmount;

                results.push({
                    _id: income._id,
                    source: income.source,
                    description: income.description,
                    date_received: income.date_received,
                    type: income.type,
                    recurring_income_id: income.recurring_income_id,
                    recurrence: recurrence ? recurrence.recurrence : {},
                    amount: income.amount,
                    additional_income: additionalIncomeDetails,
                    total_income: totalIncomeAmount,
                    total_expenses: totalExpensesAmount,
                    money_remaining: remainingAmount
                });
            }
        }

        res.json(results);
    } catch (err) {
        console.error('Error fetching income:', err);
        res.status(500).send('Server Error');
    }
};

exports.updateOneTimeIncome = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Income ID is required' });
        }

        // Update the one-time income document
        const updatedOneTimeIncome = await Income.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedOneTimeIncome) {
            return res.status(404).json({ message: 'One-time income not found' });
        }

        res.status(200).json(updatedOneTimeIncome);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecurringIncomes = async (req, res) => {
    try {
        const { source } = req.query;
        const filter = {};
        if (source) {
            filter.source = source;
        }
        const recurringIncomes = await RecurringIncome.find(filter).sort({ 'recurrence.start_date': 1 });

        res.status(200).json(recurringIncomes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRecurringIncome = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Income ID is required' });
        }

        if (updatedData.recurrence.end_date <= updatedData.recurrence.start_date) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        // Update the recurring income document
        const updatedRecurringIncome = await RecurringIncome.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedRecurringIncome) {
            return res.status(404).json({ message: 'Recurring income not found' });
        }

        // Generate new instances based on updated data
        const newInstances = generateRecurringInstances(updatedRecurringIncome, true);

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Remove instances that are after today
        await Income.deleteMany({
            recurring_income_id: id,
            date_received: { $gte: startOfToday }
        });

        // Add new instances
        await Income.insertMany(newInstances);

        res.status(200).json(updatedRecurringIncome);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};