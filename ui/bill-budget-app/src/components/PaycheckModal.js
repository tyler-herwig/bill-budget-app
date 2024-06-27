import React, { useState, useContext } from 'react';
import { Box, Button, ButtonGroup, FormControl, InputAdornment, InputLabel, Modal, OutlinedInput, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { PaychecksContext } from './PaychecksContext';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

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
            handleClose(); // Close the modal on successful submission
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={modalStyle}>
                <Typography id="modal-title" variant="h6" component="h2">
                    ADD PAYCHECK
                </Typography>
                <br />
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
                    <ButtonGroup variant="outlined" aria-label="Basic button group">
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSubmit}>Add</Button>
                    </ButtonGroup>
                </Box>
            </Box>
        </Modal>
    );
};

export default PaycheckModal;