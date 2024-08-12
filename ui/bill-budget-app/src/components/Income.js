import React, { useContext } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Tooltip, Box, Alert
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { Paid, CheckCircle, Error, Info, Loop } from '@mui/icons-material';
import moment from 'moment';
import { IncomeContext } from './IncomeContext';
import IncomeSettingsMenu from './IncomeSettingsMenu';
import NoDataMessage from './NoDataMessage';

const Income = () => {
    const { incomes } = useContext(IncomeContext);

    const handleIncomeDate = (incomeDate, incomeType) => {
        const today = moment.utc().startOf('day');
        const date = moment.utc(incomeDate).startOf('day');

        return date.isSameOrBefore(today) ? (
            <small style={{ color: 'grey', fontSize: '10px', display: 'flex', alignItems: 'center' }}>
                {moment.utc(incomeDate).format('MMMM Do, YYYY')}
                {incomeType === 'recurring' && (
                    <Tooltip title="Recurring">
                        <Loop fontSize='small' color='primary' style={{ marginLeft: 4 }} />
                    </Tooltip>
                )}
                <Tooltip title="Received">
                    <Paid fontSize='small' color='success' style={{ marginLeft: 4 }} />
                </Tooltip>
            </small>
        ) : (
            <small style={{ color: 'grey', fontSize: '10px' }}>
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
                    size="small"
                    style={{ fontWeight: 100, fontSize: '10px' }}
                />
            );
        } else {
            return (
                <Chip
                    icon={<Error />}
                    label={<NumericFormat value={moneyRemaining.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />}
                    color="error"
                    variant="outlined"
                    size="small"
                    style={{ fontWeight: 100, fontSize: '10px' }}
                />
            );
        }
    };

    if (!incomes.length) {
        return <NoDataMessage title='Insufficient Data' message='The data available is not sufficient for this widget. Please adjust your filters and try again.'/>;
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="Income table" size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>Source</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }} align="right">Total Income</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }} align="right">Expenses</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }} align="right">Money Remaining</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {incomes.map((income) => (
                        <React.Fragment key={income._id}>
                            <TableRow style={{borderLeft: '5px solid #36A1EAFF'}}>
                                <TableCell component="th" scope="row">
                                    <Chip
                                        icon={<Info />}
                                        label={income.source.charAt(0).toUpperCase() + income.source.slice(1) + ': ' + income.description}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                        style={{ fontWeight: 100, fontSize: '10px', marginBottom: 2 }}
                                    />
                                    <br />
                                    {handleIncomeDate(income.date_received, income.type)}
                                </TableCell>
                                <TableCell align="right">
                                    <NumericFormat value={income.amount.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                </TableCell>
                                <TableCell align="right">
                                    <NumericFormat value={income.total_income.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                </TableCell>
                                <TableCell align="right">
                                    <NumericFormat value={income.total_expenses.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                </TableCell>
                                <TableCell align="right">
                                    {handleMoneyRemaining(income.money_remaining)}
                                </TableCell>
                                <TableCell>
                                    <IncomeSettingsMenu data={income} />
                                </TableCell>
                            </TableRow>
                            {income.additional_income.length > 0 && (
                                <TableRow style={{borderLeft: '5px solid #66BA6AFF'}}>
                                    <TableCell colSpan={7} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                        <Box margin={1}>
                                            <Alert variant="outlined" severity="success">
                                                Sweet! You have <b>{<NumericFormat value={(income.additional_income.reduce((sum, income) => sum + income.amount, 0)).toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</b> of additional income for this period.
                                            </Alert>
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
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default Income;