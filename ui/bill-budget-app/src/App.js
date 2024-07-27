import './App.css';
import React, { Component, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Container, Grid, Paper } from '@mui/material';
import { AccountBalance, Payments } from '@mui/icons-material';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Income from './components/Income';
import Expenses from './components/Expenses';
import BasicSpeedDial from './components/BasicSpeedDial';
import UserIntroSection from './components/UserIntroSection';
import LoadingBackdrop from './components/LoadingBackdrop';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { IncomeProvider, IncomeContext } from './components/IncomeContext';
import { ExpensesProvider, ExpensesContext } from './components/ExpensesContext';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const AppContent = () => {
    const { loadingIncome } = useContext(IncomeContext);
    const { loadingExpenses } = useContext(ExpensesContext);

    const isLoading = loadingIncome || loadingExpenses;

    return (
        <>
            <LoadingBackdrop open={isLoading} />
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
        </>
    );
};

class App extends Component {
    render() {
        return (
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <div className="App">
                    <IncomeProvider>
                        <ExpensesProvider>
                            <ResponsiveAppBar />
                            <AppContent />
                            <BasicSpeedDial />
                        </ExpensesProvider>
                    </IncomeProvider>
                </div>
            </ThemeProvider>
        );
    }
}

export default App;