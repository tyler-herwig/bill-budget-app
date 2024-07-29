import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import { Box, Typography, Grid, Alert, Tabs, Tab, Tooltip } from '@mui/material';
import { AccountBalance, Payments, Info } from '@mui/icons-material';
import { NumericFormat } from 'react-number-format';
import moment from 'moment';
import { IncomeContext } from './IncomeContext';
import { ExpensesContext } from './ExpensesContext';

const BackgroundBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
}));

const IncomeBackgroundBox = styled(BackgroundBox)(({ theme }) => ({
    background: 'linear-gradient(to right, rgba(102, 187, 106, 1), rgba(76, 175, 80, 1))',
    width: '100%',
    marginBottom: theme.spacing(2)
}));

const ExpensesBackgroundBox = styled(BackgroundBox)(({ theme }) => ({
    background: 'linear-gradient(to right, #00c6ff, #0072ff)',
    width: '100%',
    marginBottom: theme.spacing(2)
}));

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export function UserIntroTabs() {
    const { incomes } = useContext(IncomeContext);
    const { expenses } = useContext(ExpensesContext);

    const [value, setValue] = React.useState(0);
    const [currentData, setCurrentData] = useState(null);
    const [upcomingData, setUpcomingData] = useState(null);

    useEffect(() => {
        const currentDate = new Date();

        const findCurrentIncome = () =>
            incomes
                .filter(income => new Date(income.date_received) <= currentDate)
                .sort((a, b) => new Date(b.date_received) - new Date(a.date_received))[0];

        const findUpcomingIncome = () =>
            incomes.find(income => new Date(income.date_received) > currentDate);

        const findRelatedExpense = (income) =>
            incomes.find(p => new Date(p.date_received) > new Date(income.date_received)) || {};

        const currentIncome = findCurrentIncome();
        const upcomingIncome = findUpcomingIncome();

        setCurrentData(currentIncome
            ? { income: currentIncome, expense: findRelatedExpense(currentIncome) }
            : null
        );

        setUpcomingData(upcomingIncome
            ? { income: upcomingIncome, expense: findRelatedExpense(upcomingIncome) }
            : null
        );

    }, [incomes, expenses]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleStatusInfo = (moneyRemaining) => {
        if (moneyRemaining > 0) {
            return (
                <Alert variant="outlined" severity="success">
                    Great news! You have <b>{<NumericFormat value={moneyRemaining.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</b> remaining after all expenses.
                </Alert>
            )
        } else {
            moneyRemaining = Math.abs(moneyRemaining);
            return (
                <Alert variant="outlined" severity="error">
                    Uh oh! It looks like your expenses exceed your income by <b>{<NumericFormat value={moneyRemaining.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</b>.
                </Alert>
            )
        }
    }

    if (!upcomingData || !currentData) {
        return null;
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Current Income" {...a11yProps(0)} />
                    <Tab label="Upcoming Income" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <IncomeBackgroundBox>
                            <Typography variant="h6" style={{fontWeight: 'bold'}}><AccountBalance /> Current Income</Typography>
                        </IncomeBackgroundBox>
                        <Typography variant="h3">{<NumericFormat value={currentData.income.total_income.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</Typography>
                        <Typography variant="caption">You got paid on {moment.utc(currentData.income.date_received).format('MMMM Do, YYYY')}</Typography>
                        {currentData.income.additional_income.length > 0 && (
                            <Tooltip title="Total reflects additional income">
                                <Info fontSize='small' color='primary' style={{marginLeft: 4}}/>
                            </Tooltip>
                        )}
                    </Grid>
                    <Grid item xs={6}>
                        <ExpensesBackgroundBox>
                            <Typography variant="h6" style={{fontWeight: 'bold'}}><Payments /> Current Expenses</Typography>
                        </ExpensesBackgroundBox>
                        <Typography variant="h3">{<NumericFormat value={currentData.income.total_expenses?.toFixed(2) || '0.00'} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</Typography>
                        <Typography variant="caption">{moment.utc(currentData.income.date_received).format('MMMM Do, YYYY')} to {moment.utc(currentData.expense.date_received).format('MMMM Do, YYYY')}</Typography>
                    </Grid>
                </Grid>
                <br/>
                { handleStatusInfo(currentData.income.money_remaining) }
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <IncomeBackgroundBox>
                            <Typography variant="h6" style={{fontWeight: 'bold'}}><AccountBalance /> Upcoming Income</Typography>
                        </IncomeBackgroundBox>
                        <Typography variant="h3">{<NumericFormat value={upcomingData.income.total_income.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</Typography>
                        <Typography variant="caption">Next payment on {moment.utc(upcomingData.income.date_received).format('MMMM Do, YYYY')}</Typography>
                        {upcomingData.income.additional_income.length > 0 && (
                            <Tooltip title="Total reflects additional income">
                                <Info fontSize='small' color='primary' style={{marginLeft: 4}}/>
                            </Tooltip>
                        )}
                    </Grid>
                    <Grid item xs={6}>
                        <ExpensesBackgroundBox>
                            <Typography variant="h6" style={{fontWeight: 'bold'}}><Payments /> Upcoming Expenses</Typography>
                        </ExpensesBackgroundBox>
                        <Typography variant="h3">{<NumericFormat value={upcomingData.income.total_expenses?.toFixed(2) || '0.00'} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</Typography>
                        <Typography variant="caption">{moment.utc(upcomingData.income.date_received).format('MMMM Do, YYYY')} to {moment.utc(upcomingData.expense.date_received).format('MMMM Do, YYYY')}</Typography>
                    </Grid>
                </Grid>
                <br/>
                { handleStatusInfo(upcomingData.income.money_remaining) }
            </CustomTabPanel>
        </Box>
    );
}