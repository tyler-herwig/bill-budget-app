import axios from 'axios';
import { IOneTimeIncome, IIncome } from '../models/income';

const API_URL = process.env.REACT_APP_API_URL;

export const getAllIncome = async (start_date: string, end_date: string) => {
  try {
    const response = await axios.get(`${API_URL}/income`, {
        params: { 
            start_date, 
            end_date 
        },
        withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching income:', error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch income');
  }
};

export const addIncome = async (income: IOneTimeIncome) => {
    delete income._id;

    try {
        await axios.post(
            `${API_URL}/income/one-time`,
            income,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            }
        );
    } catch (error: any) {
        console.error('Error adding income:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to add income');
    }
}

export const updateIncome = async (income: IOneTimeIncome) => {
    try {
        await axios.put(
            `${API_URL}/income/one-time/${income._id}`,
            income,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            }
        );
    } catch (error: any) {
        console.error('Error updating income:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to update income');
    }
}

export const deleteIncome = async (incomeId: string | null | undefined) => {
    try {
        await axios.delete(
            `${API_URL}/income/one-time/${incomeId}`,
            {
                withCredentials: true
            }
        );
    } catch (error: any) {
        console.error('Error deleting income:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to delete income');
    }
}

export const getIncomeById = async (incomeId: string) => {
    try {
        const response = await axios.get(`${API_URL}/income/one-time/${incomeId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching income:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch income');
    }
}

export const addRecurringIncome = async (income: IIncome) => {
    delete income._id;

    try {
        await axios.post(
            `${API_URL}/income/recurring`,
            income,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            }
        );
    } catch (error: any) {
        console.error('Error adding income:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to add income');
    }
}

export const updateRecurringIncome = async (income: IIncome) => {
    try {
        await axios.put(
            `${API_URL}/income/recurring/${income._id}`,
            income,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            }
        );
    } catch (error: any) {
        console.error('Error updating income:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to update income');
    }
}

export const deleteRecurringIncome = async (incomeId: string | null | undefined) => {
    try {
        await axios.delete(
            `${API_URL}/income/recurring/${incomeId}`,
            {
                withCredentials: true
            }
        );
    } catch (error: any) {
        console.error('Error deleting income:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to delete income');
    }
}

export const getRecurringIncomeById = async (incomeId: string | null) => {
    try {
        const response = await axios.get(`${API_URL}/income/recurring/${incomeId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching income:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch income');
    }
}
