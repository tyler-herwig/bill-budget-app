import React, { useContext } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import { NumericFormat } from 'react-number-format';
import { Error } from '@mui/icons-material';
import moment from 'moment';
import { BillsContext } from './BillsContext';

const Bills = () => {
    const { bills, updateBillDatePaid } = useContext(BillsContext);
    const label = { inputProps: { 'aria-label': 'Bill paid checkbox' } };

    const handleDatePaidChange = (bill) => {
        const newDatePaid = bill.date_paid ? null : new Date().toISOString();
        updateBillDatePaid(bill._id, newDatePaid);
    };

    const handleDatePaid = (bill, label) => (
        <>
            <Checkbox {...label} checked={!!bill.date_paid} onChange={() => handleDatePaidChange(bill)}/>
            {bill.date_paid && (
                <>
                    <br />
                    <small style={{ color: 'grey', fontSize: '10px' }}>
                        {moment(bill.date_paid).format('MMMM Do, YYYY')}
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
                                title={`${monthData.monthName}, ${yearData._id}`}
                                align="left"
                                className='month-header'
                            />
                            <CardContent>
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                                                <TableCell style={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                                                <TableCell style={{ fontWeight: 'bold' }}>Due</TableCell>
                                                <TableCell style={{ fontWeight: 'bold' }} align="center">Paid</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {monthData.bills.map((bill) => (
                                                <TableRow key={bill._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell component="th" scope="row">
                                                        <b style={{ paddingRight: 10 }}>{bill.name}</b>
                                                        <hr />
                                                        <small style={{ color: 'grey', fontSize: '10px' }}>{bill.description}</small>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <NumericFormat value={bill.amount.toFixed(2)} displayType="text" thousandSeparator={true} prefix="$" />
                                                    </TableCell>
                                                    <TableCell>
                                                        {moment(bill.date_due).format('MMMM Do, YYYY')}
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        {handleDatePaid(bill, label)}
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
        </>
    );
};

export default Bills;