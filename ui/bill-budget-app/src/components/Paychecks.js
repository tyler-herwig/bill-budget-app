import React from 'react';
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

function createData(date, amount) {
    return { date, amount };
}

const rows = [
    createData('June 13th, 2024', 1578.00),
    createData('June 18th, 2024', 526.00),
    createData('June 25th, 2024', 526.00),
];

function Paychecks() {
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
                    {rows.map((row) => (
                        <TableRow key={row.date} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                                {row.date === 'June 25th, 2024' ? (
                                    <>
                                        {row.date} <Chip icon={<Star />} label="Current" color="success" variant="outlined" size="small" style={{fontWeight: 100, fontSize: '10px'}}/>
                                    </>
                                ) : (
                                    row.date
                                )}
                            </TableCell>
                            <TableCell align="right">
                                <NumericFormat value={row.amount.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                            </TableCell>
                            <TableCell align="right">
                                <NumericFormat value={row.amount.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                            </TableCell>
                            <TableCell align="right">
                                <NumericFormat value={row.amount.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Paychecks;