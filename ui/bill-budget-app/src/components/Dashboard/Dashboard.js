import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllIncome } from '../../fetch/income.ts';
import { getAllExpenses } from '../../fetch/expense.ts';
import { Box, Container } from '@mui/material';
import UserIntroSection from './UserIntroSection';
import Income from './Income';
import DateRangePickerComponent from './DateRangePickerComponent';
import { DateRangeContext } from '../Context/DateRangeContext';

const Dashboard = () => {

    const { dateRange } = useContext(DateRangeContext);

    const { data: incomes, isLoading: isLoadingIncomes, refetch: refetchIncome } = useQuery({
        queryKey: ['income', dateRange.startDate, dateRange.endDate],
        queryFn: () => getAllIncome(dateRange.startDate, dateRange.endDate), 
        enabled: !!dateRange.startDate && !!dateRange.endDate,
        refetchOnWindowFocus: false
    });

    const { data: expenses, isLoading: isLoadingExpenses, refetch: refetchExpenses } = useQuery({
        queryKey: ['expenses', dateRange.startDate, dateRange.endDate],
        queryFn: () => getAllExpenses(dateRange.startDate, dateRange.endDate), 
        enabled: !!dateRange.startDate && !!dateRange.endDate,
        refetchOnWindowFocus: false
    });

    return (
        <>
            <DateRangePickerComponent refetch={refetchIncome} />
            <Container maxWidth="100%" style={{ marginTop: 15 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <UserIntroSection 
                        incomes={incomes} 
                        isLoadingIncomes={isLoadingIncomes} 
                        expenses={expenses}
                        isLoadingExpenses={isLoadingExpenses}
                    />
                    <Income 
                        incomes={incomes} 
                        isLoadingIncomes={isLoadingIncomes} 
                        refetch={refetchIncome}
                    />
                </Box>
            </Container>
        </>
    );
};

export default Dashboard;