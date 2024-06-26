import React, {useContext} from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { NumericFormat } from 'react-number-format';
import Chip from '@mui/material/Chip';
import Star from '@mui/icons-material/Star';
import { PaychecksContext } from './PaychecksContext';
import moment from 'moment';

const Paychecks = () => {
    const { paychecks } = useContext(PaychecksContext);

    const handlePaycheckDate = (paycheckDate) => {
        const today = moment().startOf('day'); // Get today's date at midnight
        const date = moment.utc(paycheckDate).startOf('day'); // Convert paycheckDate to a moment object and set time to midnight

        return date.isSameOrBefore(today) ? (
            <>
                {moment.utc(paycheckDate).format('MMMM Do, YYYY')}{' '}
                <Chip
                    icon={<Star />}
                    label="Received"
                    color="success"
                    variant="outlined"
                    size="small"
                    style={{ fontWeight: 100, fontSize: '10px' }}
                />
            </>
        ) : (
            moment.utc(paycheckDate).format('MMMM Do, YYYY')
        );
    };

    return (
        <TableContainer component={Paper}>
            <Table aria-label="Paychecks table">
                <TableHead>
                    <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }} align="right">Total Bills</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }} align="right">Money Remaining</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paychecks.map((paycheck) => (
                        <TableRow key={paycheck.date} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                                {handlePaycheckDate(paycheck.date)}
                            </TableCell>
                            <TableCell align="right">
                                <NumericFormat value={paycheck.amount.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                            </TableCell>
                            <TableCell align="right">
                                <NumericFormat value={paycheck.amount.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                            </TableCell>
                            <TableCell align="right">
                                <NumericFormat value={paycheck.amount.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Paychecks;