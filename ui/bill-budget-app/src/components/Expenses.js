import React, { useContext, useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Card, CardHeader, CardContent, Checkbox, TextField, Dialog, DialogActions, DialogContent,
    DialogTitle, Button, Tooltip
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { CalendarMonth, Loop, WarningAmber } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import ExpenseSettingsMenu from './ExpenseSettingsMenu';
import { ExpensesContext } from './ExpensesContext';
import NoDataMessage from './NoDataMessage';

const Expenses = () => {
    const { expenses, updateExpense } = useContext(ExpensesContext);
    const label = { inputProps: { 'aria-label': 'Expense paid checkbox' } };

    const [open, setOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleCardStyling = (monthData) => {
        const currentMonth = moment.utc().month() + 1;
        const currentYear = moment.utc().year();

        if (currentMonth === monthData.month && currentYear === monthData.year) {
            return '5px #66BA6AFF solid';
        } else {
            return '5px #36A1EAFF solid';
        }
    }

    const handleDatePaidChange = (expense) => {
        if (expense.date_paid) {
            updateExpense({
                _id: expense._id,
                date_paid: null,
                status: 'unpaid'
            });
        } else {
            setSelectedExpense(expense);
            setOpen(true);
        }
    };

    const handleDateSelection = () => {
        if (selectedExpense && selectedDate) {
            updateExpense({
                _id: selectedExpense._id,
                date_paid: selectedDate.toISOString(),
                status: 'paid'
            });
        }
        setOpen(false);
        setSelectedExpense(null);
        setSelectedDate(null);
    };

    const handleDateDue = (expense) => {
        const today = moment.utc().startOf('day');
        const date = moment.utc(expense.date_due).startOf('day');

        return (
            <small style={{ color: 'grey', fontSize: '10px', display: 'flex', alignItems: 'center' }}>
                {moment.utc(expense.date_due).format('MMMM Do, YYYY')}
                {expense.type === 'recurring' && (
                    <Tooltip title="Recurring">
                        <Loop fontSize='small' color='primary' style={{marginLeft: 4}}/>
                    </Tooltip>
                )}
                {date.isBefore(today) && !expense.date_paid ? (
                    <Tooltip title="Expense is showing not paid. Have you paid this yet?">
                        <WarningAmber fontSize='small' color='error' style={{marginLeft: 4}}/>
                    </Tooltip>
                ) : '' }
                {date.isSame(today) && !expense.date_paid ? (
                    <Tooltip title="Expense is due today!">
                        <WarningAmber fontSize='small' color='warning' style={{marginLeft: 4}}/>
                    </Tooltip>
                ) : '' }
            </small>
        );
    };

    const handleDatePaid = (expense, label) => (
        <>
            <Checkbox {...label} checked={!!expense.date_paid} onChange={() => handleDatePaidChange(expense)}/>
            {expense.date_paid && (
                <>
                    <br />
                    <small style={{ color: 'grey', fontSize: '10px' }}>
                        {moment.utc(expense.date_paid).format('MMMM Do, YYYY')}
                    </small>
                </>
            )}
        </>
    );

    if (!expenses.length) {
        return <NoDataMessage title='Insufficient Data' message='The data available is not sufficient for this widget. Please add an expense or adjust your filters and try again.'/>;
    }

    return (
        <>
            {expenses.map((monthData) => (
                <Card
                    key={monthData.fullMonthName + monthData.year}
                    style={{ marginBottom: '15px', borderLeft: handleCardStyling(monthData) }}
                >
                            <CardHeader
                                title={
                                    <Box display="flex" alignItems="center">
                                        <CalendarMonth sx={{ mr: 1 }} />
                                        <Typography variant="h6">
                                            {`${monthData.fullMonthName}, ${monthData.year}`}
                                        </Typography>
                                    </Box>
                                }
                                align="left"
                                className='month-header'
                            />
                            <CardContent>
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table" size="medium">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                                                <TableCell style={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                                                <TableCell style={{ fontWeight: 'bold' }}>Due</TableCell>
                                                <TableCell style={{ fontWeight: 'bold' }} align="center">Paid</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {monthData.expenses.map((expense) => (
                                                <TableRow key={expense._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell component="th" scope="row">
                                                        <b style={{ paddingRight: 10 }}>{expense.name}</b>
                                                        <br/>
                                                        <small style={{ color: 'grey', fontSize: '10px' }}>{expense.description}</small>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <NumericFormat value={expense.amount.toFixed(2)} displayType="text" thousandSeparator={true} prefix="$" />
                                                    </TableCell>
                                                    <TableCell>
                                                        {handleDateDue(expense)}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {handleDatePaid(expense, label)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <ExpenseSettingsMenu data={expense}/>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                </Card>
            ))}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Select Date Paid</DialogTitle>
                <DialogContent>
                    <DatePicker
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleDateSelection}>Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Expenses;