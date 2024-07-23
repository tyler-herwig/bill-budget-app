import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import { Box, Typography, Grid, Alert, Tabs, Tab } from '@mui/material';
import { AccountBalance, Payments, East } from '@mui/icons-material';
import { NumericFormat } from 'react-number-format';
import moment from 'moment';
import { PaychecksContext } from './PaychecksContext';
import { BillsContext } from './BillsContext';

const BackgroundBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
}));

const PaychecksBackgroundBox = styled(BackgroundBox)(({ theme }) => ({
    background: 'linear-gradient(to right, rgba(102, 187, 106, 1), rgba(76, 175, 80, 1))',
    width: '100%',
    marginBottom: theme.spacing(2)
}));

const BillsBackgroundBox = styled(BackgroundBox)(({ theme }) => ({
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

export function BasicTabs() {
    const { paychecks } = useContext(PaychecksContext);
    const { bills } = useContext(BillsContext);

    const [value, setValue] = React.useState(0);
    const [currentData, setCurrentData] = useState(null);
    const [upcomingData, setUpcomingData] = useState(null);

    useEffect(() => {
        const currentDate = new Date();

        const findCurrentPaycheck = () =>
            paychecks
                .filter(paycheck => new Date(paycheck.date) <= currentDate)
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

        const findUpcomingPaycheck = () =>
            paychecks.find(paycheck => new Date(paycheck.date) > currentDate);

        const findRelatedBill = (paycheck) =>
            paychecks.find(p => new Date(p.date) > new Date(paycheck.date)) || {};

        const currentPaycheck = findCurrentPaycheck();
        const upcomingPaycheck = findUpcomingPaycheck();

        setCurrentData(currentPaycheck
            ? { paycheck: currentPaycheck, bill: findRelatedBill(currentPaycheck) }
            : null
        );

        setUpcomingData(upcomingPaycheck
            ? { paycheck: upcomingPaycheck, bill: findRelatedBill(upcomingPaycheck) }
            : null
        );

    }, [paychecks, bills]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleStatusInfo = (moneyRemaining) => {
        if (moneyRemaining > 0) {
            return (
                <Alert variant="outlined" severity="success">
                    Great news! You have <b>{<NumericFormat value={moneyRemaining.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</b> remaining after all bills.
                </Alert>
            )
        } else {
            moneyRemaining = Math.abs(moneyRemaining);
            return (
                <Alert variant="outlined" severity="error">
                    Uh oh! It looks like your bills exceed your paycheck by <b>{<NumericFormat value={moneyRemaining.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</b>.
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
                    <Tab label="Current Paycheck" {...a11yProps(0)} />
                    <Tab label="Upcoming Paycheck" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <PaychecksBackgroundBox>
                            <Typography variant="h6" style={{fontWeight: 'bold'}}><AccountBalance /> Current Paycheck</Typography>
                        </PaychecksBackgroundBox>
                        <Typography variant="h3">{<NumericFormat value={currentData.paycheck.amount.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</Typography>
                        <Typography variant="caption">You got paid on {moment.utc(currentData.paycheck.date).format('MMMM Do, YYYY')}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <BillsBackgroundBox>
                            <Typography variant="h6" style={{fontWeight: 'bold'}}><Payments /> Current Bills</Typography>
                        </BillsBackgroundBox>
                        <Typography variant="h3">{<NumericFormat value={currentData.paycheck.total_bills?.toFixed(2) || '0.00'} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</Typography>
                        <Typography variant="caption">{moment.utc(currentData.paycheck.date).format('MMMM Do, YYYY')} to {moment.utc(currentData.bill.date).format('MMMM Do, YYYY')}</Typography>
                    </Grid>
                </Grid>
                <br/>
                { handleStatusInfo(currentData.paycheck.money_remaining) }
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <PaychecksBackgroundBox>
                            <Typography variant="h6" style={{fontWeight: 'bold'}}><AccountBalance /> Upcoming Paycheck</Typography>
                        </PaychecksBackgroundBox>
                        <Typography variant="h3">{<NumericFormat value={upcomingData.paycheck.amount.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</Typography>
                        <Typography variant="caption">Next payment on {moment.utc(upcomingData.paycheck.date).format('MMMM Do, YYYY')}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <BillsBackgroundBox>
                            <Typography variant="h6" style={{fontWeight: 'bold'}}><Payments /> Upcoming Bills</Typography>
                        </BillsBackgroundBox>
                        <Typography variant="h3">{<NumericFormat value={upcomingData.paycheck.total_bills?.toFixed(2) || '0.00'} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</Typography>
                        <Typography variant="caption">{moment.utc(upcomingData.paycheck.date).format('MMMM Do, YYYY')} to {moment.utc(upcomingData.bill.date).format('MMMM Do, YYYY')}</Typography>
                    </Grid>
                </Grid>
                <br/>
                { handleStatusInfo(upcomingData.paycheck.money_remaining) }
            </CustomTabPanel>
        </Box>
    );
}