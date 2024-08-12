import React, { useContext, useMemo} from 'react';
import {
    Box, Button, FormControl, InputAdornment, InputLabel, OutlinedInput,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { ExpensesContext } from './ExpensesContext';
import useOneTimeExpense from '../hooks/useOneTimeExpense';

const OneTimeExpenseModal = ({ action, data, open, handleClose }) => {
    const expensesContext = useContext(ExpensesContext);
    const memoizedData = useMemo(() => data, [data]);

    const {
        formData,
        handleChange,
        handleDateChange,
        handleAction
    } = useOneTimeExpense({ context: expensesContext, data: memoizedData });

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
            helper: `Are you sure you wish to delete one-time expense for ${data ? data.name + ' on ' + moment.utc(data.date_due).format('MMMM Do, YYYY') : ''}?`,
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
                                onChange={handleChange('name')}
                                label="Name"
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="outlined-adornment-description">Expense Description</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-description"
                                value={formData.description}
                                onChange={handleChange('description')}
                                label="Description"
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="outlined-adornment-amount">Expense Amount</InputLabel>
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
                                label="Expense Due Date"
                                value={formData.date_due}
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

export default OneTimeExpenseModal;