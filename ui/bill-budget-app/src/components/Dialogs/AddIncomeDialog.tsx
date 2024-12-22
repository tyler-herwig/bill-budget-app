import React from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, Button, 
    RadioGroup, FormControlLabel, Radio, Divider 
} from '@mui/material';
import { Loop } from '@mui/icons-material';
import OneTimeIncomeModal from '../Modals/OneTimeIncomeModal.tsx';
import RecurringIncomeModal from '../RecurringIncomeModal';

interface AddIncomeDialogProps {
    open: boolean;
    handleClose: () => void;
}

const AddIncomeDialog = ({ open, handleClose }: AddIncomeDialogProps) => {
    const [incomeType, setIncomeType] = React.useState('base');
    const [oneTimeIncomeModalOpen, setOneTimeIncomeModalOpen] = React.useState(false);
    const [recurringIncomeModalOpen, setRecurringIncomeModalOpen] = React.useState(false);
    const [salary, setSalary] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIncomeType(event.target.value);
    };

    const handleDialogConfirm = () => {
        switch(incomeType) {
            case 'base':
                setSalary(true);
                setRecurringIncomeModalOpen(true);
                break;
            case 'one-time':
                setOneTimeIncomeModalOpen(true);
                break;
            case 'recurring':
                setSalary(false);
                setRecurringIncomeModalOpen(true);
                break;
            default:
                break;
        }
        handleClose();
    }

    const handleOneTimeIncomeModalClose = () => {
        setOneTimeIncomeModalOpen(false);
    }

    const handleRecurringIncomeModalClose = () => {
        setRecurringIncomeModalOpen(false);
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Select Income Type</DialogTitle>
                <DialogContent>
                    <RadioGroup value={incomeType} onChange={handleChange}>
                        <FormControlLabel value="base" control={<Radio/>} label="Base Income"/>
                        <small style={{fontSize: 10}}>Select 'Base Income' for regular paychecks or recurring salaries. You must have at least 1 base income.</small>
                        <Divider style={{marginTop: 15, marginBottom: 15}}/>
                        <FormControlLabel value="one-time" control={<Radio/>} label="One-Time Income"/>
                        <small style={{fontSize: 10}}>Select 'One-Time Income' for irregular or occasional income, such as gifts or freelance work.</small>
                        <Divider style={{marginTop: 15, marginBottom: 15}}/>
                        <FormControlLabel value="recurring" control={<Radio/>} label={<><Loop/> Recurring Income</>}/>
                        <small style={{fontSize: 10}}>Select 'Recurring Income' for income you receive regularly on a consistent basis, such as monthly payments or dividends.</small>
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDialogConfirm}>Confirm</Button>
                </DialogActions>
            </Dialog>

            <OneTimeIncomeModal action='add' open={oneTimeIncomeModalOpen} handleClose={handleOneTimeIncomeModalClose}/>
            <RecurringIncomeModal action='add' data={{}} open={recurringIncomeModalOpen} handleClose={handleRecurringIncomeModalClose} salary={salary}/>
        </>
    )
}

export default AddIncomeDialog;