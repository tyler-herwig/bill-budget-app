import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Alert from '@mui/material/Alert';
import { AccountBalance, Payments, QueryStats } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import { PaychecksContext } from './PaychecksContext';
import { BillsContext } from './BillsContext';
import { NumericFormat } from 'react-number-format';
import moment from 'moment';

const InfoPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
}));

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

const UserIntroSection = () => {
    const { paychecks } = useContext(PaychecksContext);
    const { bills } = useContext(BillsContext);

    const [upcomingData, setUpcomingData] = useState(null);
    const [chartData, setChartData] = useState({ labels: [], paychecks: [], bills: [] });

    useEffect(() => {
        const currentDate = new Date();

        const upcomingPaycheck = paychecks.find(paycheck => new Date(paycheck.date) > currentDate);
        setUpcomingData(upcomingPaycheck);

        const labelsSet = new Set();
        const paycheckTotalByMonth = {};
        const billsChartData = [];

        paychecks.forEach(paycheck => {
            let paycheckMonth = moment.utc(paycheck.date).format('YYYY-MM');
            labelsSet.add(moment.utc(paycheckMonth).format('MMM') + ', ' + moment.utc(paycheckMonth).format('YYYY'));

            if (!paycheckTotalByMonth[paycheckMonth]) {
                paycheckTotalByMonth[paycheckMonth] = 0;
            }
            paycheckTotalByMonth[paycheckMonth] += paycheck.amount;
        });

        const paychecksChartData = Object.entries(paycheckTotalByMonth)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(entry => entry[1]);

        const labels = Array.from(labelsSet);

        bills.forEach(billYears => {
            let totalBillsByMonth = billYears.months.map(month => month.totalAmount);
            billsChartData.push(...totalBillsByMonth);
        });

        setChartData({
            labels: labels,
            paychecks: paychecksChartData,
            bills: billsChartData
        });
    }, [paychecks, bills]);

    if (!upcomingData) {
        return null;
    }

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

    const dynamicChartData = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Paychecks',
                data: chartData.paychecks,
                borderColor: 'rgba(76, 175, 80, 1)',
                backgroundColor: 'rgba(76, 175, 80, 0.2)'
            },
            {
                label: 'Bills',
                data: chartData.bills,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)'
            },
        ],
    };

    return (
        <Grid container spacing={2} style={{ marginBottom: '15px' }}>
            <Grid item xs={12} md={6}>
                <InfoPaper style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    <Box>
                        <Typography variant="h3" style={{ color: '#fff' }}>Welcome, Tyler!</Typography>
                        <Typography variant="body1" style={{ color: '#fff' }}>Here's a quick overview of your financial data.</Typography>
                    </Box>
                    <Divider />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <PaychecksBackgroundBox>
                                <Typography variant="h6" style={{fontWeight: 'bold'}}><AccountBalance /> Upcoming Paycheck</Typography>
                            </PaychecksBackgroundBox>
                            <Typography variant="h3">{<NumericFormat value={upcomingData.amount.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</Typography>
                            <Typography variant="body2">Next payment on {moment.utc(upcomingData.date).format('MMMM Do')}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <BillsBackgroundBox>
                                <Typography variant="h6" style={{fontWeight: 'bold'}}><Payments /> Upcoming Bills</Typography>
                            </BillsBackgroundBox>
                            <Typography variant="h3">{<NumericFormat value={upcomingData.total_bills.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</Typography>
                            <Typography variant="body2">Prior to {moment.utc(upcomingData.date).format('MMMM Do')}</Typography>
                        </Grid>
                    </Grid>
                    { handleStatusInfo(upcomingData.money_remaining) }
                </InfoPaper>
            </Grid>
            <Grid item xs={12} md={6}>
                <InfoPaper style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    <Box>
                        <Typography variant="h6" style={{fontWeight: 'bold'}}><QueryStats /> Your Financial Outlook</Typography>
                        <br />
                        <Line
                            data={dynamicChartData}
                            options={{
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: function (tooltipItem) {
                                                return tooltipItem.dataset.label + ': $' + tooltipItem.raw.toFixed(2);
                                            },
                                        },
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            callback: function (value) {
                                                return '$' + value.toFixed(2);
                                            },
                                        },
                                    },
                                },
                            }}
                        />
                    </Box>
                </InfoPaper>
            </Grid>
        </Grid>
    );
};

export default UserIntroSection;