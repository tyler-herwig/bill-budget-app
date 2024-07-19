import React, { useContext, useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Card, CardHeader, CardContent, Checkbox, TextField, Dialog, DialogActions, DialogContent,
    DialogTitle, Button, IconButton
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { CalendarMonth, MoreHoriz } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import { BillsContext } from './BillsContext';

const Bills = () => {
    const { bills, updateBillDatePaid } = useContext(BillsContext);
    const label = { inputProps: { 'aria-label': 'Bill paid checkbox' } };

    const [open, setOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDatePaidChange = (bill) => {
        if (bill.date_paid) {
            updateBillDatePaid(bill._id, null);
        } else {
            setSelectedBill(bill);
            setOpen(true);
        }
    };

    const handleDateSelection = () => {
        if (selectedBill && selectedDate) {
            updateBillDatePaid(selectedBill._id, selectedDate.toISOString());
        }
        setOpen(false);
        setSelectedBill(null);
        setSelectedDate(null);
    };

    const handleDatePaid = (bill, label) => (
        <>
            <Checkbox {...label} checked={!!bill.date_paid} onChange={() => handleDatePaidChange(bill)}/>
            {bill.date_paid && (
                <>
                    <br />
                    <small style={{ color: 'grey', fontSize: '10px' }}>
                        {moment.utc(bill.date_paid).format('MMMM Do, YYYY')}
                    </small>
                </>
            )}
        </>
    );

    return (
        <>
            {bills.map((yearData) => (
                <Card key={yearData._id} style={{ marginBottom: '15px' }}>
                    {yearData.months.map((monthData) => (
                        <div key={monthData.monthName}>
                            <CardHeader
                                title={
                                    <Box display="flex" alignItems="center">
                                        <CalendarMonth sx={{ mr: 1 }} />
                                        <Typography variant="h6">
                                            {`${monthData.monthName}, ${yearData._id}`}
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
                                            {monthData.bills.map((bill) => (
                                                <TableRow key={bill._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell component="th" scope="row">
                                                        <b style={{ paddingRight: 10 }}>{bill.name}</b>
                                                        <br/>
                                                        <small style={{ color: 'grey', fontSize: '10px' }}>{bill.description}</small>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <NumericFormat value={bill.amount.toFixed(2)} displayType="text" thousandSeparator={true} prefix="$" />
                                                    </TableCell>
                                                    <TableCell>
                                                        {moment.utc(bill.date_due).format('MMMM Do, YYYY')}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {handleDatePaid(bill, label)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton aria-label="edit" color="primary">
                                                            <MoreHoriz />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </div>
                    ))}
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

export default Bills;