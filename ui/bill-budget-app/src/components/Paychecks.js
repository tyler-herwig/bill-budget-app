import React, { useContext, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Collapse, IconButton, Box, Tooltip
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { Paid, CheckCircle, Error, ExpandMore, ExpandLess, Info, Loop } from '@mui/icons-material';
import moment from 'moment';
import { IncomeContext } from './IncomeContext';
import PaycheckSettingsMenu from './PaycheckSettingsMenu';

const Paychecks = () => {
    const { incomes } = useContext(IncomeContext);
    const [expandedRow, setExpandedRow] = useState(null);

    const handleIncomeDate = (incomeDate, incomeType) => {
        const today = moment().startOf('day');
        const date = moment.utc(incomeDate).startOf('day');

        return date.isSameOrBefore(today) ? (
            <small style={{color: 'grey', fontSize: '10px', display: 'flex', alignItems: 'center'}}>
                {moment.utc(incomeDate).format('MMMM Do, YYYY')}
                {incomeType === 'recurring' && (
                    <Tooltip title="Recurring">
                        <Loop fontSize='small' color='primary' style={{marginLeft: 4}}/>
                    </Tooltip>
                )}
                <Tooltip title="Received">
                    <Paid fontSize='small' color='success' style={{marginLeft: 4}}/>
                </Tooltip>
            </small>
        ) : (
            <small style={{color: 'grey', fontSize: '10px'}}>
                {moment.utc(incomeDate).format('MMMM Do, YYYY')}
                {incomeType === 'recurring' && (
                    <Loop fontSize='small' color='primary' style={{marginLeft: 4}}/>
                )}
            </small>
        );
    };

    const handleMoneyRemaining = (moneyRemaining) => {
        if (moneyRemaining > 0) {
            return (
                <Chip
                    icon={<CheckCircle />}
                    label={<NumericFormat value={moneyRemaining.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'}/>}
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
                    label={<NumericFormat value={moneyRemaining.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'}/>}
                    color="error"
                    variant="outlined"
                    size="small"
                    style={{ fontWeight: 100, fontSize: '10px' }}
                />
            );
        }
    };

    const handleExpandClick = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

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
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Chip
                                        icon={<Info />}
                                        label={income.source.charAt(0).toUpperCase() + income.source.slice(1) + ': ' + income.description}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                        style={{ fontWeight: 100, fontSize: '10px', marginBottom: 2 }}
                                    />
                                    <br/>
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
                                    <PaycheckSettingsMenu data={income}/>
                                    {income.additional_income.length > 0 && (
                                        <Tooltip title="Additional income available">
                                            <IconButton onClick={() => handleExpandClick(income._id)}>
                                                {expandedRow === income._id ? <ExpandLess /> : <ExpandMore />}
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                            {income.additional_income.length > 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                        <Collapse in={expandedRow === income._id} timeout="auto" unmountOnExit>
                                            <Box margin={1}>
                                                <Table size="small" aria-label="additional income">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell style={{ fontWeight: 'bold' }}>Source</TableCell>
                                                            <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
                                                            <TableCell style={{ fontWeight: 'bold' }}>Date Received</TableCell>
                                                            <TableCell style={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
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
                                                                        {moment.utc(additional.date_received).format('MMMM Do, YYYY')}
                                                                        {additional.type === 'recurring' && (
                                                                            <Tooltip title="Recurring">
                                                                                <Loop fontSize='small' color='primary' style={{marginLeft: 4}}/>
                                                                            </Tooltip>
                                                                        )}
                                                                    </small>
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <NumericFormat value={additional.amount.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
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

export default Paychecks;