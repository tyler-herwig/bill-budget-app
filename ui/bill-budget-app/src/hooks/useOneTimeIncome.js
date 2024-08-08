import { useState, useEffect } from 'react';
import moment from 'moment';

const useRecurringIncome = ({ context, data = {} }) => {
    const [formData, setFormData] = useState({
        _id: '',
        source: '',
        description: '',
        amount: '',
        date_received: moment(new Date())
    });

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleDateChange = (newValue) => {
        setFormData((prevState) => ({ ...prevState, date_received: newValue }));
    };

    const handleAction = async (action) => {
        try {
            if (action === 'add') {
                await context.addIncome(formData);
            } else if (action === 'edit') {
                await context.updateIncome(formData);
            } else if (action === 'delete') {
                await context.deleteIncome(formData._id);
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
            date_received: moment.utc(data.date_received || new Date())
        });
    }, [data]);

    return {
        formData,
        handleChange,
        handleDateChange,
        handleAction
    };
};

export default useRecurringIncome;