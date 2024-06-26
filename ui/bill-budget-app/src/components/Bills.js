import React, { Component } from 'react';
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
import { Error, Star } from '@mui/icons-material';
import moment from 'moment';

class Bills extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bills: []
        };
    }

    API_URL = "http://localhost:5038/api/";

    componentDidMount() {
        this.refreshBills();
    }

    async refreshBills() {
        try {
            const response = await fetch(this.API_URL + 'bills');
            const data = await response.json();
            this.setState({ bills: data });
        } catch (error) {
            console.error('Error fetching bills:', error);
        }
    }

    handleDatePaid = (datePaid, label) => {
        return (
            <>
                <Checkbox {...label} checked={!!datePaid} />
                {datePaid && (
                    <>
                        <br />
                        <small style={{ color: 'grey', fontSize: '10px' }}>
                            {moment(datePaid).format('MMMM Do, YYYY')}
                        </small>
                    </>
                )}
            </>
        )
    }

    render() {
        const { bills } = this.state;
        const label = { inputProps: { 'aria-label': 'Bill paid checkbox' } };

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
                                                            {bill.date_paid == null && <Chip icon={<Error />} label="Unpaid" color="error" size="small" />}
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
                                                            {this.handleDatePaid(bill.date_paid, label)}
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
    }
}

export default Bills;