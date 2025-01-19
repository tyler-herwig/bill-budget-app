import axios from "axios";
import { IOneTimeExpense, IRecurringExpense } from "../models/expense";


const API_URL = process.env.REACT_APP_API_URL;

export const getAllExpenses = async (start_date: string, end_date: string) => {
    try {
      const response = await axios.get(`${API_URL}/expenses`, {
          params: { 
              start_date, 
              end_date 
          },
          withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching expenses:', error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch expenses');
    }
  };

export const getExpenseCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/expenses/categories`, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching expense categories:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch expense categories');
    }
;}

export const addExpense = async (expense: IOneTimeExpense) => {
    try {
        const response = await axios.post(`${API_URL}/expenses/one-time`, expense, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        console.error('Error adding expense:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to add expense');
    }
};

export const updateExpense = async (expense: IOneTimeExpense) => {
    try {
        const response = await axios.put(`${API_URL}/expenses/one-time/${expense._id}`, expense, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        console.error('Error updating expense:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to update expense');
    }
}

export const deleteExpense = async (expenseId: string | null | undefined) => {
    try {
        const response = await axios.delete(`${API_URL}/expenses/one-time/${expenseId}`, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        console.error('Error deleting expense:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to delete expense');
    }
}

export const getExpenseById = async (expenseId: string) => {
    try {
        const response = await axios.get(`${API_URL}/expenses/one-time/${expenseId}`, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching expense:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch expense');    
    }
}

export const addRecurringExpense = async (expense: IRecurringExpense) => {
    try {
        const response = await axios.post(`${API_URL}/expenses/recurring`, expense, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        console.error('Error adding recurring expense:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to add recurring expense');
    }
}

export const updateRecurringExpense = async (expense: IRecurringExpense) => {
    try {
        const response = await axios.put(`${API_URL}/expenses/recurring/${expense._id}`, expense, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        console.error('Error updating recurring expense:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to update recurring expense');
    }
}

export const deleteRecurringExpense = async (expenseId: string | null | undefined) => {
    try {
        const response = await axios.delete(`${API_URL}/expenses/recurring/${expenseId}`, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        console.error('Error deleting recurring expense:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to delete recurring expense');
    }
}

export const getRecurringExpenseById = async (expenseId: string | null) => {
    try {
        const response = await axios.get(`${API_URL}/expenses/recurring/${expenseId}`, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching recurring expense:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch recurring expense');  
    }
}