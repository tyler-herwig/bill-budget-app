import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box, Container } from '@mui/material';
import UserIntroSection from './UserIntroSection';
import Income from './Income';
import DateRangePickerComponent from './DateRangePickerComponent';
import { IncomeProvider } from './IncomeContext';
import { ExpensesProvider } from './ExpensesContext';
import { DateRangeProvider } from './DateRangeContext';

const Dashboard = () => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <DateRangeProvider>
                <IncomeProvider>
                    <ExpensesProvider>
                        <DateRangePickerComponent />
                        <Container maxWidth="100%" style={{ marginTop: 15 }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <UserIntroSection />
                                <Income />
                            </Box>
                        </Container>
                    </ExpensesProvider>
                </IncomeProvider>
            </DateRangeProvider>
        </QueryClientProvider>
    );
};

export default Dashboard;