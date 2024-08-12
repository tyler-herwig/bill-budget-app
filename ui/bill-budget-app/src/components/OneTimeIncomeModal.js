import React, { useContext, useMemo} from 'react';
import {
    Box, Button, FormControl, InputAdornment, InputLabel, OutlinedInput,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Select, MenuItem
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { IncomeContext } from './IncomeContext';
import useOneTimeIncome from '../hooks/useOneTimeIncome';

const OneTimeIncomeModal = ({ action, data, open, handleClose }) => {
    const incomeContext = useContext(IncomeContext);
    const memoizedData = useMemo(() => data, [data]);

    const {
        formData,
        handleChange,
        handleDateChange,
        handleAction
    } = useOneTimeIncome({ context: incomeContext, data: memoizedData });

    const actionVerbage = {
        add: {
            title: 'ADD ONE-TIME INCOME',
            helper: 'Please fill out the form below to add a new one-time income.',
            button: 'Add'
        },
        edit: {
            title: 'EDIT ONE-TIME INCOME',
            helper: 'Please fill out the form below to update the one-time income.',
            button: 'Update'
        },
        delete: {
            title: 'DELETE ONE-TIME INCOME',
            helper: `Are you sure you wish to delete one-time income for ${data ? data.description + ' on ' + moment.utc(data.date_received).format('MMMM Do, YYYY') : ''}?`,
            button: 'Delete'
        }
    };

    const { title, helper, button } = actionVerbage[action] || {};

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-title" aria-describedby="dialog-description">
            <DialogTitle id="dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="dialog-description">
                    {helper}
                </DialogContentText>
                {action !== 'delete' && (
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        {formData.source !== 'salary' && (
                            <FormControl>
                                <InputLabel htmlFor="outlined-adornment-source">Income Source</InputLabel>
                                <Select
                                    id="outlined-adornment-source"
                                    value={formData.source}
                                    onChange={handleChange('source')}
                                    label="Source"
                                >
                                    <MenuItem value="investment">Investment</MenuItem>
                                    <MenuItem value="freelance">Freelance</MenuItem>
                                    <MenuItem value="rental">Rental</MenuItem>
                                    <MenuItem value="business">Business</MenuItem>
                                    <MenuItem value="bonus">Bonus</MenuItem>
                                    <MenuItem value="dividend">Dividend</MenuItem>
                                    <MenuItem value="interest">Interest</MenuItem>
                                    <MenuItem value="royalty">Royalty</MenuItem>
                                    <MenuItem value="gift">Gift</MenuItem>
                                    <MenuItem value="pension">Pension</MenuItem>
                                    <MenuItem value="social_security">Social Security</MenuItem>
                                    <MenuItem value="alimony">Alimony</MenuItem>
                                    <MenuItem value="child_support">Child Support</MenuItem>
                                    <MenuItem value="grant">Grant</MenuItem>
                                    <MenuItem value="award">Award</MenuItem>
                                    <MenuItem value="cash_windfall">Cash Windfall</MenuItem>
                                    <MenuItem value="miscellaneous">Miscellaneous</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                        <FormControl>
                            <InputLabel htmlFor="outlined-adornment-description">Income Description</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-description"
                                value={formData.description}
                                onChange={handleChange('description')}
                                label="Description"
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="outlined-adornment-amount">Income Amount</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                value={formData.amount}
                                onChange={handleChange('amount')}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                label="Amount"
                            />
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                label="Income Due Received"
                                value={formData.date_received}
                                onChange={handleDateChange}
                                renderInput={(params) => <OutlinedInput {...params} />}
                            />
                        </LocalizationProvider>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={async () => {
                        const success = await handleAction(action);
                        if (success) {
                            handleClose();
                        }
                    }}
                >
                    {button}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OneTimeIncomeModal;