import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, FormControl, InputAdornment, InputLabel, OutlinedInput, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { PaychecksContext } from './PaychecksContext';

const PaycheckModal = ({ data, open, handleClose }) => {
    const [formData, setFormData] = useState({
        id: '',
        paycheckDate: moment(new Date()),
        paycheckAmount: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                id: data._id || '',
                paycheckDate: moment.utc(data.date || new Date()),
                paycheckAmount: data.amount || ''
            });
        }
    }, [data]);

    const { addPaycheck, updatePaycheck } = useContext(PaychecksContext);

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

    const handleUpdate = async ()  => {
        try {
            await updatePaycheck(formData.id, formData.paycheckDate.format('YYYY-MM-DD'), formData.paycheckAmount);
            handleClose(); // Close the dialog on successful update
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-title" aria-describedby="dialog-description">
            <DialogTitle id="dialog-title">{data ? 'EDIT PAYCHECK' : 'ADD PAYCHECK'}</DialogTitle>
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
                    <LocalizationProvider dateAdapter={AdapterMoment}>
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
                {data ? <Button onClick={handleUpdate}>Update</Button> : <Button onClick={handleSubmit}>Add</Button>}
            </DialogActions>
        </Dialog>
    );
};

export default PaycheckModal;