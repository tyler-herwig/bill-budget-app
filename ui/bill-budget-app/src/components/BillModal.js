import React, {useState, useContext, useEffect} from 'react';
import {
    Box, Button, FormControl, InputAdornment, InputLabel, OutlinedInput,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { BillsContext } from './BillsContext';

const BillModal = ({ action, data, open, handleClose }) => {

    const [formData, setFormData] = useState({
        id: '',
        billName: '',
        billDescription: '',
        billDateDue: moment(new Date()),
        billAmount: ''
    });

    const actionVerbage = {
        add: {
            title: 'ADD BILL',
            helper: 'Please fill out the form below to add a new bill.',
            button: 'Add'
        },
        edit: {
            title: 'EDIT BILL',
            helper: 'Please fill out the form below to update the bill.',
            button: 'Update'
        },
        delete: {
            title: 'DELETE BILL',
            helper: `Are you sure you wish to delete bill for ${data ? data.name + ' on ' + moment.utc(data.date_due).format('MMMM Do, YYYY') : ''}?`,
            button: 'Delete'
        }
    };

    useEffect(() => {
        if (data) {
            setFormData({
                id: data._id || '',
                billName: data.name || '',
                billDescription: data.description || '',
                billDateDue: moment.utc(data.date_due || new Date()),
                billAmount: data.amount || ''
            });
        }
    }, [data]);

    const { addBill, updateBill, deleteBill } = useContext(BillsContext);

    const handleNameChange = (event) => {
        setFormData((prevState) => ({ ...prevState, billName: event.target.value }));
    };

    const handleDescriptionChange = (event) => {
        setFormData((prevState) => ({ ...prevState, billDescription: event.target.value }));
    };

    const handleDateChange = (newValue) => {
        setFormData((prevState) => ({ ...prevState, billDateDue: newValue }));
    };

    const handleAmountChange = (event) => {
        setFormData((prevState) => ({ ...prevState, billAmount: event.target.value }));
    };

    const handleSubmit = async () => {
        try {
            await addBill(formData.billName, formData.billDescription, formData.billDateDue.format('YYYY-MM-DD'), formData.billAmount);
            handleClose(); // Close the dialog on successful submission
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await updateBill(formData.id, formData.billName, formData.billDescription, formData.billDateDue.format('YYYY-MM-DD'), formData.billAmount);
            handleClose(); // Close the dialog on successful update
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteBill(formData.id);
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
                            <InputLabel htmlFor="outlined-adornment-name">Bill Name</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-name"
                                value={formData.billName}
                                onChange={handleNameChange}
                                label="Name"
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="outlined-adornment-description">Bill Description</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-description"
                                value={formData.billDescription}
                                onChange={handleDescriptionChange}
                                label="Description"
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="outlined-adornment-amount">Bill Amount</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                value={formData.billAmount}
                                onChange={handleAmountChange}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                label="Amount"
                            />
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                label="Bill Due Date"
                                value={formData.billDateDue}
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

export default BillModal;