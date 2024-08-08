import React, { useContext, useMemo } from 'react';
import {
    Box, Button, FormControl, InputLabel, InputAdornment, OutlinedInput, Select, MenuItem,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { IncomeContext } from './IncomeContext';
import useRecurringIncome from '../hooks/useRecurringIncome';

const RecurringIncomeModal = ({ action, data, open, handleClose, salary }) => {
    const incomeContext = useContext(IncomeContext);

    const memoizedData = useMemo(() => {
        if (salary) {
            return { ...data, source: 'salary' };
        }
        return data;
    }, [data, salary]);

    const {
        formData,
        handleChange,
        handleRecurrenceChange,
        handleDateChange,
        handleAction
    } = useRecurringIncome({ context: incomeContext, data: memoizedData });

    const actionVerbage = {
        add: {
            title: 'ADD RECURRING INCOME',
            helper: 'Please fill out the form below to add a new recurring income.',
            button: 'Add'
        },
        edit: {
            title: 'EDIT RECURRING INCOME',
            helper: 'Please fill out the form below to update the recurring income.',
            button: 'Update'
        },
        delete: {
            title: 'DELETE RECURRING INCOME',
            helper: `Are you sure you wish to delete recurring income for ${data ? data.description : ''}?`,
            button: 'Delete'
        }
    };

    const { title, helper, button } = actionVerbage[action] || {};

    const startDate = new Date(formData.recurrence.start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isStartDateInPast = startDate < today;

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-title" aria-describedby="dialog-description">
            <DialogTitle id="dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="dialog-description" style={{ marginBottom: 15 }}>
                    {helper}
                </DialogContentText>
                {action !== 'delete' && (
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {formData.source !== 'salary' && !salary && (
                                <FormControl>
                                    <InputLabel htmlFor="outlined-adornment-source">Income Source</InputLabel>
                                    <Select
                                        id="outlined-adornment-source"
                                        value={formData.source}
                                        onChange={handleChange('source')}
                                        label="Source"
                                    >
                                        {/* Add your MenuItem options here */}
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
                        </Box>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Recurrence
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <FormControl>
                                    <InputLabel htmlFor="outlined-adornment-frequency">Frequency</InputLabel>
                                    <Select
                                        id="outlined-adornment-frequency"
                                        value={formData.recurrence.frequency}
                                        onChange={handleRecurrenceChange('frequency')}
                                        label="Frequency"
                                    >
                                        <MenuItem value="weekly">Weekly</MenuItem>
                                        <MenuItem value="bi-weekly">Bi-Weekly</MenuItem>
                                        <MenuItem value="semi-monthly">Semi-Monthly</MenuItem>
                                        <MenuItem value="monthly">Monthly</MenuItem>
                                        <MenuItem value="daily">Daily</MenuItem>
                                        <MenuItem value="yearly">Yearly</MenuItem>
                                    </Select>
                                </FormControl>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker
                                        label="Start Date"
                                        value={formData.recurrence.start_date}
                                        onChange={handleDateChange('start_date')}
                                        renderInput={(params) => <OutlinedInput {...params} />}
                                        disabled={action === 'edit' && isStartDateInPast}
                                    />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker
                                        label="End Date"
                                        value={formData.recurrence.end_date}
                                        onChange={handleDateChange('end_date')}
                                        renderInput={(params) => <OutlinedInput {...params} />}
                                    />
                                </LocalizationProvider>
                            </Box>
                        </Box>
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

export default RecurringIncomeModal;