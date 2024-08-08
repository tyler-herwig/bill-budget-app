import { useState, useEffect } from 'react';
import moment from 'moment';

const useOneTimeExpense = ({ context, data = {} }) => {
    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        description: '',
        amount: '',
        date_due: moment(new Date())
    });

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleDateChange = (newValue) => {
        setFormData((prevState) => ({ ...prevState, date_due: newValue }));
    };

    const handleAction = async (action) => {
        try {
            if (action === 'add') {
                await context.addExpense(formData);
            } else if (action === 'edit') {
                await context.updateExpense(formData);
            } else if (action === 'delete') {
                await context.deleteExpense(formData._id);
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
            name: data.name || '',
            description: data.description || '',
            amount: data.amount || '',
            date_due: moment.utc(data.date_due || new Date())
        });
    }, [data]);

    return {
        formData,
        handleChange,
        handleDateChange,
        handleAction
    };
};

export default useOneTimeExpense;