import React, { useEffect, useState } from 'react';
import {
    Box, Button, FormControl, InputAdornment, InputLabel, OutlinedInput,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { IOneTimeExpense } from '../../models/expense';
import { addExpense, deleteExpense, updateExpense } from '../../fetch/expense.ts';
import { useNotification } from '../Context/NotificationContext.tsx';

interface OneTimeExpenseModalProps {
    action: 'add' | 'edit' | 'delete';
    expense?: any;
    open: boolean;
    handleClose: () => void;
    refetch: () => void;
}

const OneTimeExpenseModal: React.FC<OneTimeExpenseModalProps> = ({ action, expense, open, handleClose, refetch }) => {
    const [formData, setFormData] = useState<IOneTimeExpense>({
        name: '',
        description: '',
        amount: 0,
        date_due: ''
    });

    const { showNotification } = useNotification();

    useEffect(() => {
        if (expense) {
            setFormData(expense);
        }
    }, [expense]);

    const handleInputChange = (field: keyof IOneTimeExpense) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    const handleDateChange = (date: moment.Moment | null) => {
        setFormData({ ...formData, date_due: date ? date.toISOString() : '' });
    };

    const handleAction = async (action: string) => {
        try {
            if (action === 'add') {
                try {
                    await addExpense(formData);
                    refetch();
                    showNotification('One-time expense added successfully!', 'success');
                } catch (error) {
                    console.error('Error adding expense:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to add expense.';
                    showNotification(errorMessage, 'error');
                    return false;
                }
            }
    
            if (action === 'edit') {
                try {
                    await updateExpense(formData);
                    refetch();
                    showNotification('One-time expense updated successfully!', 'success');
                } catch (error) {
                    console.error('Error updating expense:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to update expense.';
                    showNotification(errorMessage, 'error');
                    return false;
                }
            }
    
            if (action === 'delete') {
                try {
                    await deleteExpense(formData._id);
                    refetch();
                    showNotification('One-time expense deleted successfully!', 'success');
                } catch (error) {
                    console.error('Error deleting expense:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to delete expense.';
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
            title: 'ADD ONE-TIME EXPENSE',
            helper: 'Please fill out the form below to add a new one-time expense.',
            button: 'Add'
        },
        edit: {
            title: 'EDIT ONE-TIME EXPENSE',
            helper: 'Please fill out the form below to update the one-time expense.',
            button: 'Update'
        },
        delete: {
            title: 'DELETE ONE-TIME EXPENSE',
            helper: `Are you sure you wish to delete one-time expense for ${formData ? formData.name + ' on ' + moment.utc(formData.date_due).format('MMMM Do, YYYY') : ''}?`,
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
                        <FormControl>
                            <InputLabel htmlFor="outlined-adornment-name">Expense Name</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-name"
                                value={formData.name}
                                onChange={handleInputChange('name')}
                                label="Name"
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="outlined-adornment-description">Expense Description</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-description"
                                value={formData.description}
                                onChange={handleInputChange('description')}
                                label="Description"
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="outlined-adornment-amount">Expense Amount</InputLabel>
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
                                label="Expense Due Date"
                                value={formData.date_due ? moment(formData.date_due) : null}
                                onChange={handleDateChange}
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

export default OneTimeExpenseModal;