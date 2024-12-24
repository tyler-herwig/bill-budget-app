import React, { useEffect, useState} from 'react';
import {IIncome } from '../../models/income';
import moment from 'moment';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { addRecurringIncome, deleteRecurringIncome, updateRecurringIncome } from '../../fetch/income.ts';

interface RecurringIncomeModalProps {
    action: 'add' | 'edit' | 'delete';
    income?: IIncome;
    salary?: boolean;
    open: boolean;
    handleClose: () => void;
    refetch: () => void;
}

const RecurringIncomeModal: React.FC<RecurringIncomeModalProps> = ({ action, income, salary, open, handleClose, refetch }) => {
    const [formData, setFormData] = useState<IIncome>({
        _id: '',
        source: '',
        description: '',
        amount: 0,
        recurring_income_id: '',
        date_received: '',
        type: '',
        recurrence: {
            frequency: '',
            start_date: '',
            end_date: ''
        }
    } as IIncome);

    useEffect(() => {
        if (income) {
            setFormData(income);
        }
    }, [income]);

    const handleSelectChange = (field: keyof IIncome | 'recurrence.frequency') => (event: SelectChangeEvent<string>) => {
        if (field === 'recurrence.frequency') {
            setFormData({ 
                ...formData, 
                recurrence: { 
                    ...formData.recurrence, 
                    frequency: event.target.value as string,
                    start_date: formData.recurrence?.start_date || '',
                    end_date: formData.recurrence?.end_date || ''
                } 
            });
        } else {
            setFormData({ ...formData, [field]: event.target.value as string });
        }
    };

    const handleInputChange = (field: keyof IIncome) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    const handleAction = async (action: string) => {
        try {
            switch (action) {
                case 'add':
                    await addRecurringIncome(formData);
                    refetch();
                    break;
                case 'edit':
                    await updateRecurringIncome(formData);
                    refetch();
                    break;
                case 'delete':
                    await deleteRecurringIncome(formData._id);
                    refetch();
                    break;
                default:
                    break;
            }
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    };

    const actionVerbage = {
        add: {
            title: 'ADD RECURRING INCOME',
            helper: 'Please fill out the form below to add a new recurring income.',
            button: 'Add'
        },
        edit: {
            title: 'EDIT RECURRING INCOME',
            helper: 'Please fill out the form below to update the recurring income.',
            button: 'Update'
        },
        delete: {
            title: 'DELETE RECURRING INCOME',
            helper: `Are you sure you wish to delete recurring income for ${formData ? formData.description : ''}?`,
            button: 'Delete'
        }
    };

    const { title, helper, button } = actionVerbage[action] || {};

    const startDate = new Date(formData.recurrence?.start_date ?? '');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isStartDateInPast = startDate < today;

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-title" aria-describedby="dialog-description">
            <DialogTitle id="dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="dialog-description" style={{ marginBottom: 15 }}>
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
                            {formData.source !== 'salary' && !salary && (
                                <FormControl>
                                    <InputLabel htmlFor="outlined-adornment-source">Income Source</InputLabel>
                                    <Select
                                        id="outlined-adornment-source"
                                        value={formData.source}
                                        onChange={handleSelectChange('source')}
                                        label="Source"
                                    >
                                        {/* Add your MenuItem options here */}
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
                                <InputLabel htmlFor="outlined-adornment-amount">Income Amount</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-amount"
                                    value={formData.amount}
                                    onChange={handleInputChange('amount')}
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
                                        value={formData.recurrence?.frequency || ''}
                                        onChange={handleSelectChange('recurrence.frequency')}
                                        label="Frequency"
                                    >
                                        <MenuItem value="weekly">Weekly</MenuItem>
                                        <MenuItem value="bi-weekly">Bi-Weekly</MenuItem>
                                        <MenuItem value="semi-monthly">Semi-Monthly</MenuItem>
                                        <MenuItem value="monthly">Monthly</MenuItem>
                                        <MenuItem value="daily">Daily</MenuItem>
                                        <MenuItem value="yearly">Yearly</MenuItem>
                                    </Select>
                                </FormControl>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker
                                        label="Start Date"
                                        value={formData.recurrence?.start_date ? moment(formData.recurrence.start_date) : null}
                                        onChange={(newValue) => {
                                            setFormData({
                                                ...formData,
                                                recurrence: {
                                                    ...formData.recurrence,
                                                    frequency: formData.recurrence?.frequency || '',
                                                    start_date: newValue ? newValue.toISOString() : '',
                                                    end_date: formData.recurrence?.end_date || ''
                                                }
                                            });
                                        }}
                                        slotProps={{
                                            textField: { variant: "outlined" },
                                        }}
                                        disabled={action === 'edit' && isStartDateInPast}
                                    />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker
                                        label="End Date"
                                        value={formData.recurrence?.end_date ? moment(formData.recurrence.end_date) : null}
                                        onChange={(newValue) => {
                                            setFormData({
                                                ...formData,
                                                recurrence: {
                                                    ...formData.recurrence,
                                                    frequency: formData.recurrence?.frequency || '',
                                                    start_date: formData.recurrence?.start_date || '',
                                                    end_date: newValue ? newValue.toISOString() : ''
                                                }
                                            });
                                        }}
                                        slotProps={{
                                            textField: { variant: "outlined" },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Box>
                        </Box>
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

export default RecurringIncomeModal;