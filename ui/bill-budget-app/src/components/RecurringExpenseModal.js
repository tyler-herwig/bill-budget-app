import React, { useState, useContext, useEffect } from 'react';
import {
    Box, Button, FormControl, InputLabel, InputAdornment, OutlinedInput, Select, MenuItem,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { ExpensesContext } from './ExpensesContext';

const RecurringExpenseModal = ({ action, data, open, handleClose }) => {
    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        description: '',
        amount: '',
        recurring_expense_id: '',
        recurrence: {
            frequency: '',
            start_date: moment(new Date()),
            end_date: moment(new Date())
        }
    });

    const actionVerbage = {
        add: {
            title: 'ADD RECURRING EXPENSE',
            helper: 'Please fill out the form below to add a new recurring expense.',
            button: 'Add'
        },
        edit: {
            title: 'EDIT RECURRING EXPENSE',
            helper: 'Please fill out the form below to update the recurring expense.',
            button: 'Update'
        },
        delete: {
            title: 'DELETE RECURRING EXPENSE',
            helper: `Are you sure you wish to delete recurring expense for ${data ? data.name : ''}?`,
            button: 'Delete'
        }
    };

    useEffect(() => {
        if (data) {
            setFormData({
                _id: data._id || '',
                name: data.name || '',
                description: data.description || '',
                amount: data.amount || '',
                recurring_expense_id: data.recurring_expense_id || '',
                recurrence: {
                    frequency: data.recurrence?.frequency || '',
                    start_date: moment.utc(data.recurrence?.start_date || new Date()),
                    end_date: moment.utc(data.recurrence?.end_date || new Date())
                }
            });
        }
    }, [data]);

    const { addRecurringExpense, updateRecurringExpense, deleteRecurringExpense } = useContext(ExpensesContext);

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleRecurrenceChange = (field) => (event) => {
        const value = event.target.value;
        setFormData((prevState) => ({
            ...prevState,
            recurrence: {
                ...prevState.recurrence,
                [field]: value
            }
        }));
    };

    const handleDateChange = (field) => (newValue) => {
        setFormData((prevState) => ({
            ...prevState,
            recurrence: {
                ...prevState.recurrence,
                [field]: newValue
            }
        }));
    };

    const handleSubmit = async () => {
        try {
            await addRecurringExpense(formData);
            handleClose(); // Close the dialog on successful submission
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await updateRecurringExpense(formData);
            handleClose(); // Close the dialog on successful update
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteRecurringExpense(formData.recurring_expense_id);
            handleClose(); // Close the dialog on successful deletion
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAction = () => {
        if (action === 'add') {
            handleSubmit();
        } else if (action === 'edit') {
            handleUpdate();
        } else if (action === 'delete') {
            handleDelete();
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
                <DialogContentText id="dialog-description" style={{marginBottom: 15}}>
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
                                        <MenuItem value="daily">Daily</MenuItem>
                                        <MenuItem value="weekly">Weekly</MenuItem>
                                        <MenuItem value="monthly">Monthly</MenuItem>
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
                <Button onClick={handleAction}>{button}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default RecurringExpenseModal;