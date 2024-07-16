import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Alert from '@mui/material/Alert';
import { AccountBalance, Payments, QueryStats } from '@mui/icons-material';
import Divider from '@mui/material/Divider';

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

const chartData = {
    labels: ['Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
        {
            label: 'Income',
            data: [2630, 2630, 2630, 2630],
            borderColor: 'rgba(76, 175, 80, 1)',
            backgroundColor: 'rgba(76, 175, 80, 0.2)'
        },
        {
            label: 'Expenses',
            data: [2201.82, 3375.46, 1165.26, 1165.26],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)'
        },
    ],
};

const UserIntroSection = () => {
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
                            <Typography variant="h3">$526.00</Typography>
                            <Typography variant="body2">Next payment on July 23rd</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <BillsBackgroundBox>
                                <Typography variant="h6" style={{fontWeight: 'bold'}}><Payments /> Upcoming Bills</Typography>
                            </BillsBackgroundBox>
                            <Typography variant="h3">$372.58</Typography>
                            <Typography variant="body2">Prior to July 23rd</Typography>
                        </Grid>
                    </Grid>
                    <Alert variant="outlined" severity="success">
                        Great news! You have <b>$153.52</b> remaining after all bills.
                    </Alert>
                </InfoPaper>
            </Grid>
            <Grid item xs={12} md={6}>
                <InfoPaper style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    <Box>
                        <Typography variant="h6" style={{fontWeight: 'bold'}}><QueryStats /> Your Financial Outlook</Typography>
                        <br/>
                        <Line
                            data={chartData}
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