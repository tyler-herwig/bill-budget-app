import React, {useContext} from 'react';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { NumericFormat } from 'react-number-format';
import Chip from '@mui/material/Chip';
import Paid from '@mui/icons-material/Paid';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Error from '@mui/icons-material/Error';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { PaychecksContext } from './PaychecksContext';
import PaycheckModal from './PaycheckModal';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import PaycheckSettingsMenu from './PaycheckSettingsMenu';
import moment from 'moment';

const Paychecks = () => {
    const { paychecks } = useContext(PaychecksContext);

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