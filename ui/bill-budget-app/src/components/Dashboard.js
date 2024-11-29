import React from 'react';
import { Box, Container } from '@mui/material';
import UserIntroSection from './UserIntroSection';
import Income from './Income';
import DateRangePickerComponent from './DateRangePickerComponent';
import ControlsSpeedDial from './ControlsSpeedDial';
import { IncomeProvider } from './IncomeContext';
import { ExpensesProvider } from './ExpensesContext';
import { DateRangeProvider } from './DateRangeContext';

const Dashboard = () => {

    return (
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
                    <ControlsSpeedDial />
                </ExpensesProvider>
            </IncomeProvider>
        </DateRangeProvider>
    );
};

export default Dashboard;