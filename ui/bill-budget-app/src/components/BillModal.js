import React, { useState, useContext } from 'react';
import { Box, Button, FormControl, InputAdornment, InputLabel, OutlinedInput, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { BillsContext } from './BillsContext';

const BillModal = ({ open, handleClose }) => {
    const [formData, setFormData] = useState({
        billName: '',
        billDescription: '',
        billDateDue: dayjs(new Date()),
        billAmount: ''
    });

    const { addBill } = useContext(BillsContext);

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

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-title" aria-describedby="dialog-description">
            <DialogTitle id="dialog-title">ADD BILL</DialogTitle>
            <DialogContent>
                <DialogContentText id="dialog-description">
                    Please fill out the form below to add a new bill.
                </DialogContentText>
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Bill Due Date"
                            value={formData.billDateDue}
                            onChange={handleDateChange}
                            renderInput={(params) => <OutlinedInput {...params} />}
                        />
                    </LocalizationProvider>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default BillModal;