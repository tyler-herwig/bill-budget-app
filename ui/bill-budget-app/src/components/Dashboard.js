import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllIncome } from '../fetch/income.ts';
import { Box, Container } from '@mui/material';
import UserIntroSection from './UserIntroSection';
import Income from './Income';
import DateRangePickerComponent from './DateRangePickerComponent';
import { IncomeProvider } from './IncomeContext';
import { ExpensesProvider } from './ExpensesContext';
import { DateRangeContext } from './DateRangeContext';

const Dashboard = () => {

    const { dateRange } = useContext(DateRangeContext);

    const { data, isLoading } = useQuery({
        queryKey: ['income', dateRange.startDate, dateRange.endDate],
        queryFn: () => getAllIncome(dateRange.startDate, dateRange.endDate), 
        enabled: !!dateRange.startDate && !!dateRange.endDate
      });

    return (
        <IncomeProvider>
            <ExpensesProvider>
                <DateRangePickerComponent />
                <Container maxWidth="100%" style={{ marginTop: 15 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <UserIntroSection />
                        <Income data={data} isLoading={isLoading} />
                    </Box>
                </Container>
            </ExpensesProvider>
        </IncomeProvider>
    );
};

export default Dashboard;