import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { PaychecksContext } from './PaychecksContext';

export const ExpensesContext = createContext();

export const ExpensesProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [loadingExpenses, setLoadingExpenses] = useState(true);
    const { refreshPaychecks } = useContext(PaychecksContext);

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
                await refreshPaychecks();
                return await response.json();
            } else {
                throw new Error('Failed to update expense');
            }
        } catch (error) {
            console.error('Error updating expense:', error);
            throw error;
        }
    }, [API_URL, refreshExpenses, refreshPaychecks]);

    useEffect(() => {
        refreshExpenses();
    }, [refreshExpenses]);

    return (
        <ExpensesContext.Provider value={{ expenses, loadingExpenses, refreshExpenses, updateExpense }}>
            {children}
        </ExpensesContext.Provider>
    );
};