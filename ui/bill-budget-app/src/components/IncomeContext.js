import React, { createContext, useState, useEffect, useCallback } from 'react';

export const IncomeContext = createContext();

export const IncomeProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [loadingIncome, setLoadingIncome] = useState(true);

    const API_URL = process.env.REACT_APP_API_URL;

    const refreshIncome = useCallback(async () => {
        setLoadingIncome(true);
        try {
            const response = await fetch(`${API_URL}/income`);
            const data = await response.json();
            setIncomes(data);
        } catch (error) {
            console.error('Error fetching income:', error);
        } finally {
            setLoadingIncome(false);
        }
    }, [API_URL]);

    const addIncome = useCallback(async (income) => {
        try {
            delete income._id;
            const response = await fetch(`${API_URL}/income/one-time`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(income),
            });
            if (response.ok) {
                await refreshIncome(); // Refresh income after adding income
            } else {
                console.error('Failed to add income:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding income:', error);
        }
    }, [API_URL, refreshIncome]);

    const addRecurringIncome = useCallback(async (income) => {
        try {
            delete income._id;
            const response = await fetch(`${API_URL}/income/recurring`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(income),
            });
            if (response.ok) {
                await refreshIncome(); // Refresh income after adding income
            } else {
                console.error('Failed to add income:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding income:', error);
        }
    }, [API_URL, refreshIncome]);

    const updateIncome = useCallback(async (income) => {
        try {
            const response = await fetch(`${API_URL}/income/one-time/${income._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(income)
            });
            if (response.ok) {
                await refreshIncome();
                return await response.json();
            } else {
                throw new Error('Failed to update income');
            }
        } catch (error) {
            console.error('Error updating income:', error);
            throw error;
        }
    }, [API_URL, refreshIncome]);

    const updateRecurringIncome = useCallback(async (income) => {
        delete income._id;
        try {
            const response = await fetch(`${API_URL}/income/recurring/${income.recurring_income_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(income)
            });
            if (response.ok) {
                await refreshIncome();
                return await response.json();
            } else {
                throw new Error('Failed to update income');
            }
        } catch (error) {
            console.error('Error updating income:', error);
            throw error;
        }
    }, [API_URL, refreshIncome]);

    useEffect(() => {
        refreshIncome();
    }, [refreshIncome]);

    return (
        <IncomeContext.Provider value={{ incomes, loadingIncome, refreshIncome, addIncome, addRecurringIncome, updateIncome, updateRecurringIncome }}>
            {children}
        </IncomeContext.Provider>
    );
};