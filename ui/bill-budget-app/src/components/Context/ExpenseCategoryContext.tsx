import React, { createContext, ReactNode } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getExpenseCategories } from '../../fetch/expense.ts';

interface ExpenseCategory {
    _id: string;
    description: string;
    order: number;
}

interface ExpenseCategoryContextType {
    expenseCategories: ExpenseCategory[];
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
}

const ExpenseCategoryContext = createContext<ExpenseCategoryContextType | null>(null);

interface ExpenseCategoryProviderProps {
    children: ReactNode;
}

export const ExpenseCategoryProvider: React.FC<ExpenseCategoryProviderProps> = ({ children }) => {
    const {
        data = [],
        isLoading,
        isError,
        refetch,
    }: UseQueryResult<ExpenseCategory[]> = useQuery({
        queryKey: ['expenseCategories'],
        queryFn: getExpenseCategories
    });

    return (
        <ExpenseCategoryContext.Provider value={{ expenseCategories: data, isLoading, isError, refetch }}>
            {children}
        </ExpenseCategoryContext.Provider>
    );
};

export const useExpenseCategoryContext = () => {
    const context = React.useContext(ExpenseCategoryContext);
    if (!context) {
        throw new Error('useExpenseCategoryContext must be used within an ExpenseCategoryProvider');
    }
    return context;
};