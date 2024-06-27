import React, { createContext, useState, useEffect } from 'react';

export const PaychecksContext = createContext();

export const PaychecksProvider = ({ children }) => {
    const [paychecks, setPaychecks] = useState([]);

    const API_URL = "http://localhost:5038/api";

    const refreshPaychecks = async () => {
        try {
            const response = await fetch(`${API_URL}/paychecks`);
            const data = await response.json();
            setPaychecks(data);
        } catch (error) {
            console.error('Error fetching paychecks:', error);
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
                }),
            });
            if (response.ok) {
                refreshPaychecks();
                return await response.json();
            } else {
                throw new Error('Failed to add paycheck');
            }
        } catch (error) {
            console.error('Error adding paycheck:', error);
            throw error;
        }
    };

    useEffect(() => {
        refreshPaychecks();
    }, []);

    return (
        <PaychecksContext.Provider value={{ paychecks, refreshPaychecks, addPaycheck }}>
            {children}
        </PaychecksContext.Provider>
    );
};
