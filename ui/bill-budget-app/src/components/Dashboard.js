import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Container, Grid, Paper, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';
import { AccountBalance, Payments } from '@mui/icons-material';
import UserIntroSection from './UserIntroSection';
import Income from './Income';
import Expenses from './Expenses';
import DateRangePickerComponent from './DateRangePickerComponent';
import ControlsSpeedDial from './ControlsSpeedDial';
import { IncomeProvider } from './IncomeContext';
import { ExpensesProvider } from './ExpensesContext';
import { DateRangeProvider } from './DateRangeContext';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const Dashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <DateRangeProvider>
            <IncomeProvider>
                <ExpensesProvider>
                    <DateRangePickerComponent />
                    <Container maxWidth="100%" style={{ marginTop: 15 }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <UserIntroSection />
                            <h2 align="left">
                                <AccountBalance /> Income
                            </h2>
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