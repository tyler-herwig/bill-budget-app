import { useState, useEffect } from 'react';
import moment from 'moment';
import { addIncome, updateIncome, deleteIncome} from '../fetch/income.ts';
import { IOneTimeIncome } from '../models/income.ts';

const useOneTimeIncome = (income: IOneTimeIncome) => {
    const [formData, setFormData] = useState<IOneTimeIncome>({
        _id: income._id || '',
        source: income.source || '',
        description: income.description || '',
        amount: income.amount || 0,
        date_received: moment.utc(income.date_received || new Date()).toISOString()
    });

    console.log(formData);
    
    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleDateChange = (newValue: string) => {
        setFormData((prevState) => ({ ...prevState, date_received: newValue }));
    };

    const handleAction = async (action: string) => {
        try {
            switch (action) {
                case 'add':
                    await addIncome(formData);
                    break;
                case 'edit':
                    await updateIncome(formData);
                    break;
                case 'delete':
                    await deleteIncome(formData._id);
                    break;
                default:
                    break;
            }
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    };

    return {
        formData,
        handleChange,
        handleDateChange,
        handleAction
    };
};

export default useOneTimeIncome;