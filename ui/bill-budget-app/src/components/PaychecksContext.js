import React, { createContext, useState, useEffect } from 'react';

export const PaychecksContext = createContext();

export const PaychecksProvider = ({ children }) => {
    const [paychecks, setPaychecks] = useState([]);
    const [loadingPaychecks, setLoadingPaychecks] = useState(true);

    const API_URL = "http://localhost:5038/api";

    const refreshPaychecks = async () => {
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
    };

    const addPaycheck = async (paycheckDate, paycheckAmount) => {
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
    };

    const updatePaycheck = async (id, paycheckDate, paycheckAmount) => {
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
    };

    const deletePaycheck = async (id) => {
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
    };

    useEffect(() => {
        refreshPaychecks();
    }, []);

    return (
        <PaychecksContext.Provider value={{ paychecks, loadingPaychecks, refreshPaychecks, addPaycheck, updatePaycheck, deletePaycheck }}>
            {children}
        </PaychecksContext.Provider>
    );
};
