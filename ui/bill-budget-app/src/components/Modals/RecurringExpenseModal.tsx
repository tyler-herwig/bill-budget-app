import React, { useEffect, useState} from 'react';
import moment from 'moment';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { IRecurringExpense } from '../../models/expense.ts';
import { addRecurringExpense, updateRecurringExpense, deleteRecurringExpense } from '../../fetch/expense.ts';
import { useNotification } from '../Context/NotificationContext.tsx';

interface RecurringExpenseModalProps {
    action: 'add' | 'edit' | 'delete';
    expense?: IRecurringExpense;
    open: boolean;
    handleClose: () => void;
    refetch: () => void;
}

const RecurringIncomeModal: React.FC<RecurringExpenseModalProps> = ({ action, expense, open, handleClose, refetch }) => {
    const [formData, setFormData] = useState<IRecurringExpense>({
        name: '',
        description: '',
        amount: 0,
        recurring_expense_id: '',
        recurrence: {
            frequency: '',
            start_date: '',
            end_date: ''
        }
    });

    const { showNotification } = useNotification();

    useEffect(() => {
        if (expense) {
            setFormData(expense);
        }
    }, [expense]);

    const handleSelectChange = (field: keyof IRecurringExpense | 'recurrence.frequency') => (event: SelectChangeEvent<string>) => {
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

    const handleInputChange = (field: keyof IRecurringExpense) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    const handleAction = async (action: string) => {
        try {
            if (action === 'add') {
                try {
                    await addRecurringExpense(formData);
                    refetch();
                    showNotification('Recurring expense added successfully!', 'success');
                } catch (error) {
                    console.error('Error adding recurring expense:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to add recurring expense.';
                    showNotification(errorMessage, 'error');
                    return false;
                }
            }
    
            if (action === 'edit') {
                try {
                    await updateRecurringExpense(formData);
                    refetch();
                    showNotification('Recurring expense updated successfully!', 'success');
                } catch (error) {
                    console.error('Error updating recurring expense:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to update recurring expense.';
                    showNotification(errorMessage, 'error');
                    return false;
                }
            }
    
            if (action === 'delete') {
                try {
                    await deleteRecurringExpense(formData._id);
                    refetch();
                    showNotification('Recurring expense deleted successfully!', 'success');
                } catch (error) {
                    console.error('Error deleting recurring expense:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to delete recurring expense.';
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
            helper: `Are you sure you wish to delete recurring expense for ${formData ? formData.name : ''}?`,
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
                                        onChange={handleSelectChange('recurrence.frequency')}
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
                                        value={formData.recurrence.start_date ? moment(formData.recurrence.start_date) : null}
                                        onChange={(newValue) => {
                                            setFormData({
                                                ...formData,
                                                recurrence: {
                                                    ...formData.recurrence,
                                                    frequency: formData.recurrence?.frequency || '',
                                                    start_date: newValue ? newValue.toISOString() : '',
                                                    end_date: formData.recurrence?.end_date || '',
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
                                        value={formData.recurrence.end_date ? moment(formData.recurrence.end_date) : null}
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