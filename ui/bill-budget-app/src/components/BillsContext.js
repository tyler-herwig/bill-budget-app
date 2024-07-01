import React, { createContext, useState, useEffect, useContext } from 'react';
import { PaychecksContext } from './PaychecksContext';

export const BillsContext = createContext();

export const BillsProvider = ({ children }) => {
    const [bills, setBills] = useState([]);
    const { refreshPaychecks } = useContext(PaychecksContext);

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
                refreshPaychecks(); // Refresh paychecks after updating bill
            } else {
                console.error('Failed to update bill:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating bill:', error);
        }
    };

    const addBill = async (billName, billDescription, billDateDue, billAmount) => {
        try {
            const response = await fetch(`${API_URL}/bills`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: billName,
                    description: billDescription,
                    date_due: billDateDue,
                    amount: billAmount
                }),
            });
            if (response.ok) {
                refreshBills(); // Refresh data after successful addition
                refreshPaychecks(); // Refresh paychecks after adding bill
            } else {
                console.error('Failed to add bill:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding bill:', error);
        }
    };

    useEffect(() => {
        refreshBills();
    }, []);

    return (
        <BillsContext.Provider value={{ bills, refreshBills, updateBillDatePaid, addBill }}>
            {children}
        </BillsContext.Provider>
    );
};