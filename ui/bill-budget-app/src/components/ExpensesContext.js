import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { IncomeContext } from './IncomeContext';
import { DateRangeContext } from './DateRangeContext';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';

export const ExpensesContext = createContext();

export const ExpensesProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [loadingExpenses, setLoadingExpenses] = useState(true);
    const [notification, setNotification] = useState(null); // Add notification state

    const { dateRange } = useContext(DateRangeContext);
    const { refreshIncome } = useContext(IncomeContext);
    const API_URL = process.env.REACT_APP_API_URL;

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    const handleClose = () => {
        setNotification(null);
    };

    /* ------------------ General Expenses ------------------ */

    const refreshExpenses = useCallback(async () => {
        if (!dateRange.startDate || !dateRange.endDate) return;

        setLoadingExpenses(true);
        try {
            const queryParams = new URLSearchParams({
                start_date: dateRange.startDate.toISOString(),
                end_date: dateRange.endDate.toISOString()
            }).toString();
            const response = await fetch(`${API_URL}/expenses?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch expenses');
            }
            const data = await response.json();
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            showNotification(error.message || 'Failed to fetch expenses data', 'error');
        } finally {
            setLoadingExpenses(false);
        }
    }, [API_URL, dateRange]);

    /* ------------------ One-Time Expenses ------------------ */

    const addExpense = useCallback(async (expense) => {
        try {
            delete expense._id;
            const response = await fetch(`${API_URL}/expenses/one-time`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expense),
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add expense');
            }
            await refreshExpenses();
            await refreshIncome();
            showNotification('Expense added successfully', 'success');
        } catch (error) {
            console.error('Error adding expense:', error);
            showNotification(error.message || 'Failed to add expense', 'error');
        }
    }, [API_URL, refreshExpenses, refreshIncome]);

    const updateExpense = useCallback(async (expense) => {
        try {
            const response = await fetch(`${API_URL}/expenses/one-time/${expense._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expense),
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update expense');
            }
            await refreshExpenses();
            await refreshIncome();
            showNotification('Expense updated successfully', 'success');
            return await response.json();
        } catch (error) {
            console.error('Error updating expense:', error);
            showNotification(error.message || 'Failed to update expense', 'error');
            throw error;
        }
    }, [API_URL, refreshExpenses, refreshIncome]);

    const deleteExpense = useCallback(async (expenseId) => {
        try {
            const response = await fetch(`${API_URL}/expenses/one-time/${expenseId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete expense');
            }
            await refreshExpenses();
            await refreshIncome();
            showNotification('Expense deleted successfully', 'success');
            return await response.json();
        } catch (error) {
            console.error('Error deleting expense:', error);
            showNotification(error.message || 'Failed to delete expense', 'error');
            throw error;
        }
    }, [API_URL, refreshExpenses, refreshIncome]);

    /* ------------------ Recurring Expenses ------------------ */

    const addRecurringExpense = useCallback(async (expense) => {
        try {
            delete expense._id;
            const response = await fetch(`${API_URL}/expenses/recurring`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expense),
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add recurring expense');
            }
            await refreshExpenses();
            await refreshIncome();
            showNotification('Recurring expense added successfully', 'success');
        } catch (error) {
            console.error('Error adding recurring expense:', error);
            showNotification(error.message || 'Failed to add recurring expense', 'error');
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
                body: JSON.stringify(expense),
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update recurring expense');
            }
            await refreshExpenses();
            await refreshIncome();
            showNotification('Recurring expense updated successfully', 'success');
            return await response.json();
        } catch (error) {
            console.error('Error updating recurring expense:', error);
            showNotification(error.message || 'Failed to update recurring expense', 'error');
            throw error;
        }
    }, [API_URL, refreshExpenses, refreshIncome]);

    const deleteRecurringExpense = useCallback(async (recurringExpenseId) => {
        try {
            const response = await fetch(`${API_URL}/expenses/recurring/${recurringExpenseId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete recurring expense');
            }
            await refreshExpenses();
            await refreshIncome();
            showNotification('Recurring expense deleted successfully', 'success');
            return await response.json();
        } catch (error) {
            console.error('Error deleting recurring expense:', error);
            showNotification(error.message || 'Failed to delete recurring expense', 'error');
            throw error;
        }
    }, [API_URL, refreshExpenses, refreshIncome]);

    useEffect(() => {
        refreshExpenses();
    }, [refreshExpenses]);

    return (
        <ExpensesContext.Provider value={{
            expenses,
            loadingExpenses,
            refreshExpenses,
            addExpense,
            addRecurringExpense,
            updateExpense,
            updateRecurringExpense,
            deleteExpense,
            deleteRecurringExpense
        }}>
            {children}
            {notification && (
                <Snackbar
                    open={!!notification}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleClose} severity={notification.type} sx={{ width: '100%' }}>
                        {notification.message}
                    </Alert>
                </Snackbar>
            )}
        </ExpensesContext.Provider>
    );
};