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

    useEffect(() => {
        refreshPaychecks();
    }, []);

    return (
        <PaychecksContext.Provider value={{ paychecks, refreshPaychecks}}>
            {children}
        </PaychecksContext.Provider>
    );
};