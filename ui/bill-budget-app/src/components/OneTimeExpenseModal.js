import React, {useState, useContext, useEffect} from 'react';
import {
    Box, Button, FormControl, InputAdornment, InputLabel, OutlinedInput,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { ExpensesContext } from './ExpensesContext';

const OneTimeExpenseModal = ({ action, data, open, handleClose }) => {

    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        description: '',
        amount: '',
        date_due: moment(new Date())
    });

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

    useEffect(() => {
        if (data) {
            setFormData({
                _id: data._id || '',
                name: data.name || '',
                description: data.description || '',
                amount: data.amount || '',
                date_due: moment.utc(data.date_due || new Date())
            });
        }
    }, [data]);

    const { addExpense, updateExpense, deleteExpense } = useContext(ExpensesContext);

    const handleNameChange = (event) => {
        setFormData((prevState) => ({ ...prevState, name: event.target.value }));
    };

    const handleDescriptionChange = (event) => {
        setFormData((prevState) => ({ ...prevState, description: event.target.value }));
    };

    const handleAmountChange = (event) => {
        setFormData((prevState) => ({ ...prevState, amount: event.target.value }));
    };

    const handleDateChange = (newValue) => {
        setFormData((prevState) => ({ ...prevState, date_due: newValue }));
    };

    const handleSubmit = async () => {
        try {
            await addExpense(formData);
            handleClose(); // Close the dialog on successful submission
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await updateExpense(formData);
            handleClose(); // Close the dialog on successful update
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteExpense(formData._id);
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
                                onChange={handleNameChange}
                                label="Name"
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="outlined-adornment-description">Expense Description</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-description"
                                value={formData.description}
                                onChange={handleDescriptionChange}
                                label="Description"
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="outlined-adornment-amount">Expense Amount</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                value={formData.amount}
                                onChange={handleAmountChange}
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
                <Button onClick={handleAction}>{button}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default OneTimeExpenseModal;