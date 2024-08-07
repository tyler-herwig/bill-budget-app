import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { ProfileContext } from './ProfileContext';
import { DateRangeContext } from './DateRangeContext';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';

export const IncomeContext = createContext();

export const IncomeProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [loadingIncome, setLoadingIncome] = useState(true);
    const [notification, setNotification] = useState(null); // Add notification state

    const { dateRange } = useContext(DateRangeContext);
    const { refreshProfile } = useContext(ProfileContext);
    const API_URL = process.env.REACT_APP_API_URL;

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    const handleClose = () => {
        setNotification(null);
    };

    /* ------------------ General Income ------------------ */

    const refreshIncome = useCallback(async () => {
        if (!dateRange.startDate || !dateRange.endDate) return;

        setLoadingIncome(true);
        try {
            const queryParams = new URLSearchParams({
                start_date: dateRange.startDate.toISOString(),
                end_date: dateRange.endDate.toISOString()
            }).toString();
            const response = await fetch(`${API_URL}/income?${queryParams}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch income data');
            }
            const data = await response.json();
            setIncomes(data);
        } catch (error) {
            console.error('Error fetching income:', error);
            showNotification(error.message || 'Failed to fetch income data', 'error');
        } finally {
            setLoadingIncome(false);
        }
    }, [API_URL, dateRange]);

    /* ------------------ One-Time Income ------------------ */

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
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add income');
            }
            await refreshIncome();
            showNotification('Income added successfully', 'success');
        } catch (error) {
            console.error('Error adding income:', error);
            showNotification(error.message || 'Failed to add income', 'error');
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
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update income');
            }
            await refreshIncome();
            showNotification('Income updated successfully', 'success');
            return await response.json();
        } catch (error) {
            console.error('Error updating income:', error);
            showNotification(error.message || 'Failed to update income', 'error');
            throw error;
        }
    }, [API_URL, refreshIncome]);

    const deleteIncome = useCallback(async (incomeId) => {
        try {
            const response = await fetch(`${API_URL}/income/one-time/${incomeId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete income');
            }
            await refreshIncome();
            showNotification('Income deleted successfully', 'success');
            return await response.json();
        } catch (error) {
            console.error('Error deleting income:', error);
            showNotification(error.message || 'Failed to delete income', 'error');
            throw error;
        }
    }, [API_URL, refreshIncome]);

    /* ------------------ Recurring Income ------------------ */

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
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add recurring income');
            }
            await refreshIncome();
            await refreshProfile();
            showNotification('Recurring income added successfully', 'success');
        } catch (error) {
            console.error('Error adding recurring income:', error);
            showNotification(error.message || 'Failed to add recurring income', 'error');
        }
    }, [API_URL, refreshIncome, refreshProfile]);

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
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update recurring income');
            }
            await refreshIncome();
            await refreshProfile();
            showNotification('Recurring income updated successfully', 'success');
            return await response.json();
        } catch (error) {
            console.error('Error updating recurring income:', error);
            showNotification(error.message || 'Failed to update recurring income', 'error');
            throw error;
        }
    }, [API_URL, refreshIncome, refreshProfile]);

    const deleteRecurringIncome = useCallback(async (recurringIncomeId) => {
        try {
            const response = await fetch(`${API_URL}/income/recurring/${recurringIncomeId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete recurring income');
            }
            await refreshIncome();
            showNotification('Recurring income deleted successfully', 'success');
            return await response.json();
        } catch (error) {
            console.error('Error deleting recurring income:', error);
            showNotification(error.message || 'Failed to delete recurring income', 'error');
            throw error;
        }
    }, [API_URL, refreshIncome]);

    useEffect(() => {
        refreshIncome();
    }, [refreshIncome]);

    return (
        <IncomeContext.Provider value={{
            incomes,
            loadingIncome,
            refreshIncome,
            addIncome,
            addRecurringIncome,
            updateIncome,
            updateRecurringIncome,
            deleteIncome,
            deleteRecurringIncome
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
        </IncomeContext.Provider>
    );
};