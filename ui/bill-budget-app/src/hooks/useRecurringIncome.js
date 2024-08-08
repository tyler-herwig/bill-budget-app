import { useState, useEffect } from 'react';
import moment from 'moment';

const useRecurringIncome = ({ context, data = {} }) => {
    const [formData, setFormData] = useState({
        _id: '',
        source: '',
        description: '',
        amount: '',
        recurring_income_id: '',
        recurrence: {
            frequency: '',
            start_date: moment(new Date()),
            end_date: moment(new Date())
        }
    });

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleRecurrenceChange = (field) => (event) => {
        const value = event.target.value;
        setFormData((prevState) => ({
            ...prevState,
            recurrence: {
                ...prevState.recurrence,
                [field]: value
            }
        }));
    };

    const handleDateChange = (field) => (newValue) => {
        setFormData((prevState) => ({
            ...prevState,
            recurrence: {
                ...prevState.recurrence,
                [field]: newValue
            }
        }));
    };

    const handleAction = async (action) => {
        try {
            if (action === 'add') {
                await context.addRecurringIncome(formData);
            } else if (action === 'edit') {
                await context.updateRecurringIncome(formData);
            } else if (action === 'delete') {
                await context.deleteRecurringIncome(formData.recurring_income_id);
            }
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    };

    useEffect(() => {
        setFormData({
            _id: data._id || '',
            source: data.source || '',
            description: data.description || '',
            amount: data.amount || '',
            recurring_income_id: data.recurring_income_id || '',
            recurrence: {
                frequency: data.recurrence?.frequency || '',
                start_date: moment.utc(data.recurrence?.start_date || new Date()),
                end_date: moment.utc(data.recurrence?.end_date || new Date())
            }
        });
    }, [data]);

    return {
        formData,
        handleChange,
        handleRecurrenceChange,
        handleDateChange,
        handleAction
    };
};

export default useRecurringIncome;