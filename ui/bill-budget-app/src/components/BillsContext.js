import React, { createContext, useState, useEffect } from 'react';

export const BillsContext = createContext();

export const BillsProvider = ({ children }) => {
    const [bills, setBills] = useState([]);

    const API_URL = "http://localhost:5038/api";

    const refreshBills = async () => {
        try {
            const response = await fetch(`${API_URL}/bills`);
            const data = await response.json();
            setBills(data);
        } catch (error) {
            console.error('Error fetching bills:', error);
        }
    };

    const updateBillDatePaid = async (id, datePaid) => {
        try {
            const response = await fetch(`${API_URL}/bills/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date_paid: datePaid }),
            });
            if (response.ok) {
                refreshBills(); // Refresh data after successful update
            } else {
                console.error('Failed to update bill:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating bill:', error);
        }
    };

    useEffect(() => {
        refreshBills();
    }, []);

    return (
        <BillsContext.Provider value={{ bills, refreshBills, updateBillDatePaid}}>
            {children}
        </BillsContext.Provider>
    );
};