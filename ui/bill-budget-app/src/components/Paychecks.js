import React, { useContext } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box, CircularProgress
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { Paid, CheckCircle, Error } from '@mui/icons-material';
import moment from 'moment';
import { PaychecksContext } from './PaychecksContext';
import PaycheckSettingsMenu from './PaycheckSettingsMenu';

const Paychecks = () => {
    const { paychecks, loadingPaychecks } = useContext(PaychecksContext);

    const handlePaycheckDate = (paycheckDate) => {
        const today = moment().startOf('day');
        const date = moment.utc(paycheckDate).startOf('day');

        return date.isSameOrBefore(today) ? (
            <>
                {moment.utc(paycheckDate).format('MMMM Do, YYYY')}{' '}
                <br/>
                <Chip
                    icon={<Paid />}
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
            )
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
            )
        }
    }

    if (loadingPaychecks) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                style={{ height: '100vh' }}
            >
                <CircularProgress />
            </Box>
        )
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="Paychecks table" size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }} align="right">Total Bills</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }} align="right">Money Remaining</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paychecks.map((paycheck) => (
                        <TableRow key={paycheck._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                                {handlePaycheckDate(paycheck.date)}
                            </TableCell>
                            <TableCell align="right">
                                <NumericFormat value={paycheck.amount.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                            </TableCell>
                            <TableCell align="right">
                                <NumericFormat value={paycheck.total_bills.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                            </TableCell>
                            <TableCell align="right">
                                {handleMoneyRemaining(paycheck.money_remaining)}
                            </TableCell>
                            <TableCell>
                                <PaycheckSettingsMenu data={paycheck}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Paychecks;