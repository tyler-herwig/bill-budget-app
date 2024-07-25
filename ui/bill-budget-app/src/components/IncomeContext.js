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

    useEffect(() => {
        refreshIncome();
    }, [refreshIncome]);

    return (
        <IncomeContext.Provider value={{ incomes, loadingIncome, refreshIncome }}>
            {children}
        </IncomeContext.Provider>
    );
};