import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { ProfileContext } from './ProfileContext';
import { DateRangeContext } from './DateRangeContext';

export const IncomeContext = createContext();

export const IncomeProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [loadingIncome, setLoadingIncome] = useState(true);

    const { dateRange } = useContext(DateRangeContext);
    const { refreshProfile } = useContext(ProfileContext);
    const API_URL = process.env.REACT_APP_API_URL;

    const refreshIncome = useCallback(async () => {
        if (!dateRange.startDate || !dateRange.endDate) return; // Ensure dateRange is valid

        setLoadingIncome(true);
        try {
            const queryParams = new URLSearchParams({
                start_date: dateRange.startDate.toISOString(),
                end_date: dateRange.endDate.toISOString()
            }).toString();
            const response = await fetch(`${API_URL}/income?${queryParams}`);
            const data = await response.json();
            setIncomes(data);
        } catch (error) {
            console.error('Error fetching income:', error);
        } finally {
            setLoadingIncome(false);
        }
    }, [API_URL, dateRange]); // Include dateRange in dependencies

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
                await refreshIncome();
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
                await refreshIncome();
                await refreshProfile();
            } else {
                console.error('Failed to add income:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding income:', error);
        }
    }, [API_URL, refreshIncome, refreshProfile]);

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
                await refreshProfile();
                return await response.json();
            } else {
                throw new Error('Failed to update income');
            }
        } catch (error) {
            console.error('Error updating income:', error);
            throw error;
        }
    }, [API_URL, refreshIncome, refreshProfile]);

    useEffect(() => {
        refreshIncome();
    }, [refreshIncome]); // Call refreshIncome when it changes

    return (
        <IncomeContext.Provider value={{ incomes, loadingIncome, refreshIncome, addIncome, addRecurringIncome, updateIncome, updateRecurringIncome }}>
            {children}
        </IncomeContext.Provider>
    );
};