import React, { createContext, useState, useEffect, useCallback } from 'react';
import moment from 'moment';

export const DateRangeContext = createContext();

export const DateRangeProvider = ({ children }) => {
    const [dateRange, setDateRange] = useState(null); // Start with null
    const [loading, setLoading] = useState(true); // Add loading state

    const getStoredDateRange = () => {
        const storedRange = localStorage.getItem('date_range');
        return storedRange ? JSON.parse(storedRange) : null;
    };

    const setStoredDateRange = (range) => {
        localStorage.setItem('date_range', JSON.stringify(range));
    };

    const updateDateRange = useCallback((range) => {
        setDateRange({
            startDate: range.startDate,
            endDate: range.endDate
        });

        setStoredDateRange({
            startDate: range.startDate.toISOString(),
            endDate: range.endDate.toISOString()
        });
    }, []); // No dependencies for updateDateRange

    useEffect(() => {
        const storedRange = getStoredDateRange();
        if (storedRange) {
            setDateRange({
                startDate: moment(storedRange.startDate),
                endDate: moment(storedRange.endDate)
            });
        } else {
            // Set default range if no stored value
            updateDateRange({
                startDate: moment().subtract(30, 'days'),
                endDate: moment()
            });
        }
        setLoading(false); // Set loading to false after setting the range
    }, [updateDateRange]);

    if (loading) {
        return null;
    }

    return (
        <DateRangeContext.Provider value={{ dateRange, updateDateRange }}>
            {children}
        </DateRangeContext.Provider>
    );
};