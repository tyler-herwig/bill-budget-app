import React, { useState, useContext } from 'react';
import { Box, Button, ButtonGroup, FormControl, InputAdornment, InputLabel, OutlinedInput, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { PaychecksContext } from './PaychecksContext';

const PaycheckModal = ({ open, handleClose }) => {
    const [formData, setFormData] = useState({
        paycheckDate: dayjs(new Date()),
        paycheckAmount: ''
    });

    const { addPaycheck } = useContext(PaychecksContext);

    const handleDateChange = (newValue) => {
        setFormData((prevState) => ({ ...prevState, paycheckDate: newValue }));
    };

    const handleAmountChange = (event) => {
        setFormData((prevState) => ({ ...prevState, paycheckAmount: event.target.value }));
    };

    const handleSubmit = async () => {
        try {
            await addPaycheck(formData.paycheckDate.format('YYYY-MM-DD'), formData.paycheckAmount);
            handleClose(); // Close the dialog on successful submission
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-title" aria-describedby="dialog-description">
            <DialogTitle id="dialog-title">ADD PAYCHECK</DialogTitle>
            <DialogContent>
                <DialogContentText id="dialog-description">
                    Please fill out the form below to add a new paycheck.
                </DialogContentText>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Paycheck Date"
                            value={formData.paycheckDate}
                            onChange={handleDateChange}
                            renderInput={(params) => <OutlinedInput {...params} />}
                        />
                    </LocalizationProvider>
                    <FormControl>
                        <InputLabel htmlFor="outlined-adornment-amount">Paycheck Amount</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            value={formData.paycheckAmount}
                            onChange={handleAmountChange}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            label="Amount"
                        />
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaycheckModal;