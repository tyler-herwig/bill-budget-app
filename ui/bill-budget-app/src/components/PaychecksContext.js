import React, { createContext, useState, useEffect, useCallback } from 'react';

export const PaychecksContext = createContext();

export const PaychecksProvider = ({ children }) => {
    const [paychecks, setPaychecks] = useState([]);
    const [loadingPaychecks, setLoadingPaychecks] = useState(true);

    const API_URL = process.env.REACT_APP_API_URL;

    // Memoize refreshPaychecks function
    const refreshPaychecks = useCallback(async () => {
        setLoadingPaychecks(true);
        try {
            const response = await fetch(`${API_URL}/paychecks`);
            const data = await response.json();
            setPaychecks(data);
        } catch (error) {
            console.error('Error fetching paychecks:', error);
        } finally {
            setLoadingPaychecks(false);
        }
    }, [API_URL]);

    // Memoize addPaycheck function
    const addPaycheck = useCallback(async (paycheckDate, paycheckAmount) => {
        try {
            const response = await fetch(`${API_URL}/paychecks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: paycheckDate,
                    amount: paycheckAmount,
                })
            });
            if (response.ok) {
                await refreshPaychecks();
                return await response.json();
            } else {
                throw new Error('Failed to add paycheck');
            }
        } catch (error) {
            console.error('Error adding paycheck:', error);
            throw error;
        }
    }, [API_URL, refreshPaychecks]);

    // Memoize updatePaycheck function
    const updatePaycheck = useCallback(async (id, paycheckDate, paycheckAmount) => {
        try {
            const response = await fetch(`${API_URL}/paychecks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: paycheckDate,
                    amount: paycheckAmount,
                })
            });
            if (response.ok) {
                await refreshPaychecks();
                return await response.json();
            } else {
                throw new Error('Failed to update paycheck');
            }
        } catch (error) {
            console.error('Error updating paycheck:', error);
            throw error;
        }
    }, [API_URL, refreshPaychecks]);

    // Memoize deletePaycheck function
    const deletePaycheck = useCallback(async (id) => {
        try {
            const response = await fetch(`${API_URL}/paychecks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                await refreshPaychecks();
                return await response.json();
            } else {
                throw new Error('Failed to delete paycheck');
            }
        } catch (error) {
            console.error('Error deleting paycheck:', error);
            throw error;
        }
    }, [API_URL, refreshPaychecks]);

    useEffect(() => {
        refreshPaychecks();
    }, [refreshPaychecks]);

    return (
        <PaychecksContext.Provider value={{ paychecks, loadingPaychecks, refreshPaychecks, addPaycheck, updatePaycheck, deletePaycheck }}>
            {children}
        </PaychecksContext.Provider>
    );
};