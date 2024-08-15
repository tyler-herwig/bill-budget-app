import { styled } from '@mui/material/styles';
import { Box, Container, Grid, Paper } from '@mui/material';
import { AccountBalance, Payments } from '@mui/icons-material';
import UserIntroSection from './UserIntroSection';
import Income from './Income';
import Expenses from './Expenses';
import DateRangePickerComponent from './DateRangePickerComponent';
import ControlsSpeedDial from './ControlsSpeedDial';
import { IncomeProvider } from './IncomeContext';
import { ExpensesProvider } from './ExpensesContext';
import { DateRangeProvider } from './DateRangeContext';
import React from "react";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const Dashboard = () => {
    return (
        <DateRangeProvider>
            <IncomeProvider>
                <ExpensesProvider>
                    <DateRangePickerComponent />
                    <Container maxWidth="100%" style={{ marginTop: 15 }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <UserIntroSection />
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={6}>
                                    <Item>
                                        <h2 align="left">
                                            <AccountBalance /> Income
                                        </h2>
                                        <Income />
                                    </Item>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Item>
                                        <h2 align="left">
                                            <Payments /> Expenses
                                        </h2>
                                        <Expenses />
                                    </Item>
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>
                    <ControlsSpeedDial />
                </ExpensesProvider>
            </IncomeProvider>
        </DateRangeProvider>
    );
};

export default Dashboard;