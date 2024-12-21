import React from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, Button, 
    RadioGroup, FormControlLabel, Radio, Divider 
} from '@mui/material';
import { Loop } from '@mui/icons-material';
import OneTimeExpenseModal from '../OneTimeExpenseModal';
import RecurringExpenseModal from '../RecurringExpenseModal';

interface AddExpenseDialogProps {
    open: boolean;
    handleClose: () => void;
}

const AddExpenseDialog = ({ open, handleClose }: AddExpenseDialogProps) => {
    const [expenseType, setIncomeType] = React.useState('one-time');
    const [oneTimeExpenseModalOpen, setOneTimeExpenseModalOpen] = React.useState(false);
    const [recurringExpenseModalOpen, setRecurringExpenseModalOpen] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIncomeType(event.target.value);
    };

    const handleDialogConfirm = () => {
        switch(expenseType) {  
            case 'one-time':
                setOneTimeExpenseModalOpen(true);
                break;
            case 'recurring':
                setRecurringExpenseModalOpen(true);
                break;
            default:
                break;
        }
        handleClose();
    }

    const handleOneTimeExpenseModalClose = () => {
        setOneTimeExpenseModalOpen(false);
    }

    const handleRecurringExpenseModalClose = () => {   
        setRecurringExpenseModalOpen(false);
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Select Expense Type</DialogTitle>
                <DialogContent>
                    <RadioGroup value={expenseType} onChange={handleChange}>
                        <FormControlLabel value="one-time" control={<Radio/>} label="One-Time Expense"/>
                        <small style={{fontSize: 10}}>Select 'One-Time Expense' for irregular or non-recurring expenses such as a single purchase, medical bill, or repair.</small>
                        <Divider style={{marginTop: 15, marginBottom: 15}}/>
                        <FormControlLabel value="recurring" control={<Radio/>} label={<><Loop/> Recurring Expense</>}/>
                        <small style={{fontSize: 10}}>Select 'Recurring Expense' for regular, ongoing expenses such as monthly subscriptions, rent, or utilities.</small>
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDialogConfirm}>Confirm</Button>
                </DialogActions>
            </Dialog>

            <OneTimeExpenseModal action='add' data={{}} open={oneTimeExpenseModalOpen} handleClose={handleOneTimeExpenseModalClose}/>
            <RecurringExpenseModal action='add' data={{}} open={recurringExpenseModalOpen} handleClose={handleRecurringExpenseModalClose}/>
        </>
    )
}

export default AddExpenseDialog;