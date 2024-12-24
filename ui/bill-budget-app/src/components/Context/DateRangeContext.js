import React, { createContext, useState, useEffect, useCallback } from 'react';
import moment from 'moment';

export const DateRangeContext = createContext();

export const DateRangeProvider = ({ children }) => {
    const [dateRange, setDateRange] = useState(null);
    const [loading, setLoading] = useState(true);

    const getStoredDateRange = () => {
        const storedRange = localStorage.getItem('date_range');
        return storedRange ? JSON.parse(storedRange) : null;
    };

    const setStoredDateRange = (range) => {
        localStorage.setItem('date_range', JSON.stringify(range));
    };

    const updateDateRange = useCallback((range) => {
        if (range.rangeType === 'custom') {
            setDateRange({
                startDate: range.startDate,
                endDate: range.endDate,
                rangeType: range.rangeType
            });

            setStoredDateRange({
                startDate: range.startDate,
                endDate: range.endDate,
                rangeType: range.rangeType
            });
        } else {
            let predefinedRange = setPredefinedDateRange(range.rangeType);
            setDateRange({
                startDate: predefinedRange.startDate,
                endDate: predefinedRange.endDate,
                rangeType: range.rangeType
            });

            setStoredDateRange({
                startDate: predefinedRange.startDate.toISOString(),
                endDate: predefinedRange.endDate.toISOString(),
                rangeType: range.rangeType
            });
        }

    }, []);

    const setPredefinedDateRange = (rangeType) => {
        let startDate, endDate;

        switch (rangeType) {
            case 'thisWeek':
                startDate = moment.utc().startOf('week');
                endDate = moment.utc().endOf('week');
                break;
            case 'lastWeek':
                startDate = moment.utc().subtract(1, 'week').startOf('week');
                endDate = moment.utc().subtract(1, 'week').endOf('week');
                break;
            case 'twoWeeks':
                startDate = moment.utc().subtract(1, 'week').startOf('week');
                endDate = moment.utc().endOf('week');
                break;
            case 'thisMonth':
                startDate = moment.utc().startOf('month');
                endDate = moment.utc().endOf('month');
                break;
            case 'lastMonth':
                startDate = moment.utc().subtract(1, 'month').startOf('month');
                endDate = moment.utc().subtract(1, 'month').endOf('month');
                break;
            case 'sixMonths':
                startDate = moment.utc().startOf('month');
                endDate = moment.utc().add(5, 'months').endOf('month');
                break;
            case 'currentYear':
                startDate = moment.utc().startOf('year');
                endDate = moment.utc().endOf('year');
                break;
            default:
                return; // No action for custom or invalid range
        }

        return {
            startDate: startDate,
            endDate: endDate
        };
    };

    useEffect(() => {
        const storedRange = getStoredDateRange();
        if (storedRange) {
            setDateRange({
                startDate: moment.utc(storedRange.startDate),
                endDate: moment.utc(storedRange.endDate),
                rangeType: storedRange.rangeType
            });
        } else {
            // Set default range if no stored value
            updateDateRange({
                startDate: moment.utc().subtract(30, 'days'),
                endDate: moment.utc(),
                rangeType: 'thisMonth'
            });
        }
        setLoading(false);
    }, [updateDateRange]);

    if (loading) {
        return null;
    }

    return (
        <DateRangeContext.Provider value={{ dateRange, updateDateRange, setPredefinedDateRange }}>
            {children}
        </DateRangeContext.Provider>
    );
};