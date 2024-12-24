import React, { useState, useEffect } from 'react';
import {
    Box, Button, FormControl, InputAdornment, InputLabel, OutlinedInput,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Select, MenuItem,
    SelectChangeEvent
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { IOneTimeIncome } from '../../models/income.ts';
import { addIncome, deleteIncome, updateIncome } from '../../fetch/income.ts';
import { useNotification } from '../Context/NotificationContext.tsx';

interface OneTimeIncomeModalProps {
    action: 'add' | 'edit' | 'delete';
    income?: IOneTimeIncome;
    open: boolean;
    handleClose: () => void;
    refetch: () => void;
}

const OneTimeIncomeModal: React.FC<OneTimeIncomeModalProps> = ({ action, income, open, handleClose, refetch }) => {
    const [formData, setFormData] = useState<IOneTimeIncome>({
        source: '',
        description: '',
        amount: 0,
        date_received: ''
    });

    const { showNotification } = useNotification();

    useEffect(() => {
        if (income) {
            setFormData(income);
        }
    }, [income]);

    const handleSelectChange = (field: keyof IOneTimeIncome) => (event: SelectChangeEvent<string>) => {
        setFormData({ ...formData, [field]: event.target.value as string });
    };

    const handleInputChange = (field: keyof IOneTimeIncome) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    const handleDateChange = (date: string) => {
        setFormData({ ...formData, date_received: date });
    };

    const handleAction = async (action: string) => {
        try {
            if (action === 'add') {
                try {
                    await addIncome(formData);
                    refetch();
                    showNotification('Income added successfully!', 'success');
                } catch (error) {
                    console.error('Error adding income:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to add income.';
                    showNotification(errorMessage, 'error');
                    return false;
                }
            }
    
            if (action === 'edit') {
                try {
                    await updateIncome(formData);
                    refetch();
                    showNotification('Income updated successfully!', 'success');
                } catch (error) {
                    console.error('Error updating income:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to update income.';
                    showNotification(errorMessage, 'error');
                    return false;
                }
            }
    
            if (action === 'delete') {
                try {
                    await deleteIncome(formData._id);
                    refetch();
                    showNotification('Income deleted successfully!', 'success');
                } catch (error) {
                    console.error('Error deleting income:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to delete income.';
                    showNotification(errorMessage, 'error');
                    return false;
                }
            }
    
            return true;
        } catch (error) {
            console.error('Unexpected error:', error);
            showNotification('An unexpected error occurred. Please try again.', 'error');
            return false;
        }
    };    

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
            helper: `Are you sure you wish to delete one-time income for ${formData ? formData.description + ' on ' + moment.utc(formData.date_received).format('MMMM Do, YYYY') : ''}?`,
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
                                <InputLabel htmlFor="outlined-adornment-source">Source</InputLabel>
                                <Select
                                    id="outlined-adornment-source"
                                    value={formData.source}
                                    onChange={handleSelectChange('source')}
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
                                onChange={handleInputChange('description')}
                                label="Description"
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                value={formData.amount}
                                onChange={handleInputChange('amount')}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                label="Amount"
                            />
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                label="Income Received"
                                value={formData.date_received ? moment(formData.date_received) : null}
                                onChange={(newValue) => handleDateChange(newValue ? newValue.toISOString() : '')}
                                slotProps={{
                                    textField: { variant: "outlined" },
                                }}
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