import React, { useContext } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Tooltip, Box, Alert,
    Card, CardHeader, CardContent, Typography, Grid
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { Paid, CheckCircle, Error, Info, Loop, Payments, AccountBalance } from '@mui/icons-material';
import moment from 'moment';
import { IncomeContext } from './IncomeContext';
import IncomeSettingsMenu from './IncomeSettingsMenu';
import NoDataMessage from './NoDataMessage';
import LoadingBackdrop from './LoadingBackdrop';

const Income = () => {
    const { incomes, loadingIncome } = useContext(IncomeContext);

    const handleIncomeDate = (incomeDate, incomeType) => {
        const today = moment.utc().startOf('day');
        const date = moment.utc(incomeDate).startOf('day');

        return date.isSameOrBefore(today) ? (
            <span style={{ color: 'grey', fontSize: '12px'}}>
                {moment.utc(incomeDate).format('MMMM Do, YYYY')}
                {incomeType === 'recurring' && (
                    <Tooltip title="Recurring">
                        <Loop fontSize='small' color='primary' style={{ marginLeft: 4 }} />
                    </Tooltip>
                )}
                <Tooltip title="Received">
                    <Paid fontSize='small' color='success' style={{ marginLeft: 4 }} />
                </Tooltip>
            </span>
        ) : (
            <small style={{ color: 'grey', fontSize: '12px' }}>
                {moment.utc(incomeDate).format('MMMM Do, YYYY')}
                {incomeType === 'recurring' && (
                    <Tooltip title="Recurring">
                        <Loop fontSize='small' color='primary' style={{ marginLeft: 4 }} />
                    </Tooltip>
                )}
            </small>
        );
    };

    const handleMoneyRemaining = (moneyRemaining) => {
        if (moneyRemaining > 0) {
            return (
                <Chip
                    icon={<CheckCircle />}
                    label={<NumericFormat value={moneyRemaining.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />}
                    color="success"
                    variant="outlined"
                />
            );
        } else {
            return (
                <Chip
                    icon={<Error />}
                    label={<NumericFormat value={moneyRemaining.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />}
                    color="error"
                    variant="outlined"
                />
            );
        }
    };

    const handleAdditionalIncome = (income) => {
        return (
            <Alert
                variant="outlined"
                severity="success"
                iconMapping={{
                    success: <Paid fontSize="inherit" />,
                }}
            >
                Sweet! You have <b>{<NumericFormat value={(income.additional_income.reduce((sum, income) => sum + income.amount, 0)).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</b> of additional income for this period
            </Alert>
        )
    }

    if (loadingIncome) {
        return <LoadingBackdrop open={loadingIncome} />;
    }

    if (!incomes.length) {
        return <NoDataMessage title='Insufficient Data' message='The data available is not sufficient for this widget. Please adjust your filters and try again.'/>;
    }

    return (
        <>
            {incomes.map((income) => (
                <Card
                    key={income._id}
                    style={{ marginBottom: '15px', borderLeft: '5px solid #36A1EAFF' }}
                >
                    <CardHeader
                        title={
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box display="flex" alignItems="center">
                                    <Typography variant="h6">
                                        {income.description} <br/>
                                        {handleIncomeDate(income.date_received, income.type)}
                                    </Typography>
                                </Box>
                                <IncomeSettingsMenu data={income} />
                            </Box>
                        }
                        align="left"
                        className="month-header"
                    />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={6} lg={3}>
                                <Card
                                    sx={{
                                        boxShadow: '0px -1px 30px -3px rgba(0,0,0,0.15)',
                                    }}
                                >
                                    <CardHeader
                                        title= {
                                            <small style={{ fontSize: '14px', fontWeight: 'bold' }}>Amount</small>
                                        }
                                        style={{borderTop: '5px solid #36A1EAFF'}}
                                    />
                                    <CardContent>
                                        <Typography variant='h6'>
                                            <Chip icon={<Paid />} label={<NumericFormat value={income.amount.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />} variant="outlined" />
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6} lg={3}>
                                <Card
                                    sx={{
                                        boxShadow: '0px -1px 30px -3px rgba(0,0,0,0.15)',
                                    }}
                                >
                                    <CardHeader
                                        title= {
                                            <small style={{ fontSize: '14px', fontWeight: 'bold' }}>Total Income</small>
                                        }
                                        style={{borderTop: '5px solid #36A1EAFF'}}
                                    />
                                    <CardContent>
                                        <Typography variant='h6'>
                                            <Chip icon={<AccountBalance />} label={<NumericFormat value={income.total_income.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />} variant="outlined" />
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6} lg={3}>
                                <Card
                                    sx={{
                                        boxShadow: '0px -1px 30px -3px rgba(0,0,0,0.15)',
                                    }}
                                >
                                    <CardHeader
                                        title= {
                                            <small style={{ fontSize: '14px', fontWeight: 'bold' }}>Expenses</small>
                                        }
                                        style={{borderTop: '5px solid #36A1EAFF'}}
                                    />
                                    <CardContent>
                                        <Typography variant='h6'>
                                            <Chip icon={<Payments />} label={<NumericFormat value={income.total_expenses.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />} variant="outlined" />
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6} lg={3}>
                                <Card
                                    sx={{
                                        boxShadow: '0px -1px 30px -3px rgba(0,0,0,0.15)',
                                    }}
                                >
                                    <CardHeader
                                        title={
                                            <small style={{ fontSize: '14px', fontWeight: 'bold' }}>Money Remaining</small>
                                        }
                                        style={{
                                            borderTop: `5px solid ${income.money_remaining < 0 ? '#F44336' : '#4CAF50'}`
                                        }}
                                    />
                                    <CardContent>
                                        <Typography variant='h6'>
                                            {handleMoneyRemaining(income.money_remaining)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        {income.additional_income.length > 0 && (
                            <div style={{marginTop: 15}}>
                                {handleAdditionalIncome(income)}
                                <TableContainer style={{marginTop: 10}}>
                                    <Table size="small" aria-label="additional income">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ fontWeight: 'bold' }}>Source</TableCell>
                                                <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
                                                <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                                                <TableCell style={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {income.additional_income.map((additional) => (
                                                <TableRow key={additional._id}>
                                                    <TableCell>
                                                        <Chip
                                                            icon={<Info />}
                                                            label={additional.source.charAt(0).toUpperCase() + additional.source.slice(1)}
                                                            color="primary"
                                                            variant="outlined"
                                                            size="small"
                                                            style={{ fontWeight: 100, fontSize: '10px', marginRight: 5 }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{additional.description}</TableCell>
                                                    <TableCell>
                                                        <small style={{ color: 'grey', fontSize: '10px' }}>
                                                            {handleIncomeDate(additional.date_received, additional.type)}
                                                        </small>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <NumericFormat value={additional.amount.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <IncomeSettingsMenu data={additional} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </>
    );
};

export default Income;