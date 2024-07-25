import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { IncomeContext } from './IncomeContext';

export const ExpensesContext = createContext();

export const ExpensesProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [loadingExpenses, setLoadingExpenses] = useState(true);
    const { refreshIncome } = useContext(IncomeContext);

    const API_URL = process.env.REACT_APP_API_URL;

    const refreshExpenses = useCallback(async () => {
        setLoadingExpenses(true);
        try {
            const response = await fetch(`${API_URL}/expenses`);
            const data = await response.json();
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoadingExpenses(false);
        }
    }, [API_URL]);

    const addExpense = useCallback(async (expense) => {
        try {
            delete expense._id;
            const response = await fetch(`${API_URL}/expenses/one-time`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expense),
            });
            if (response.ok) {
                await refreshExpenses(); // Refresh data after successful addition
                await refreshIncome(); // Refresh income after adding bill
            } else {
                console.error('Failed to add expense:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    }, [API_URL, refreshExpenses, refreshIncome]);

    const addRecurringExpense = useCallback(async (expense) => {
        try {
            delete expense._id;
            const response = await fetch(`${API_URL}/expenses/recurring`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expense),
            });
            if (response.ok) {
                await refreshExpenses(); // Refresh data after successful addition
                await refreshIncome(); // Refresh paychecks after adding bill
            } else {
                console.error('Failed to add expense:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    }, [API_URL, refreshExpenses, refreshIncome]);

    const updateExpense = useCallback(async (expense) => {
        try {
            const response = await fetch(`${API_URL}/expenses/one-time/${expense._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expense)
            });
            if (response.ok) {
                await refreshExpenses();
                await refreshIncome();
                return await response.json();
            } else {
                throw new Error('Failed to update expense');
            }
        } catch (error) {
            console.error('Error updating expense:', error);
            throw error;
        }
    }, [API_URL, refreshExpenses, refreshIncome]);

    const updateRecurringExpense = useCallback(async (expense) => {
        delete expense._id;
        try {
            const response = await fetch(`${API_URL}/expenses/recurring/${expense.recurring_expense_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expense)
            });
            if (response.ok) {
                await refreshExpenses();
                await refreshIncome();
                return await response.json();
            } else {
                throw new Error('Failed to update expense');
            }
        } catch (error) {
            console.error('Error updating expense:', error);
            throw error;
        }
    }, [API_URL, refreshExpenses, refreshIncome]);

    useEffect(() => {
        refreshExpenses();
    }, [refreshExpenses]);

    return (
        <ExpensesContext.Provider value={{ expenses, loadingExpenses, refreshExpenses, addExpense, addRecurringExpense, updateExpense, updateRecurringExpense }}>
            {children}
        </ExpensesContext.Provider>
    );
};