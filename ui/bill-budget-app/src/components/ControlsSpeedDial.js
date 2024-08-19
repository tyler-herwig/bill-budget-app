import React from 'react';
import {
    SpeedDial, SpeedDialIcon, SpeedDialAction, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, RadioGroup, FormControlLabel, Radio, Divider
} from '@mui/material';
import { AccountBalance, Payments, Loop } from '@mui/icons-material';
import OneTimeIncomeModal from './OneTimeIncomeModal';
import RecurringIncomeModal from './RecurringIncomeModal';
import OneTimeExpenseModal from './OneTimeExpenseModal';
import RecurringExpenseModal from './RecurringExpenseModal';

const actions = [
    { icon: <AccountBalance />, name: 'Income' },
    { icon: <Payments />, name: 'Expense' }
];

export default function ControlsSpeedDial() {
    const [open, setOpen] = React.useState(false);
    const [modalContent, setModalContent] = React.useState('');
    const [expenseType, setExpenseType] = React.useState('one-time');
    const [expenseDialogOpen, setExpenseDialogOpen] = React.useState(false);
    const [incomeType, setIncomeType] = React.useState('base');
    const [incomeDialogOpen, setIncomeDialogOpen] = React.useState(false);

    const handleOpenModal = (content) => {
        if (content === 'Add Expense') {
            setExpenseDialogOpen(true);
        } else {
            setIncomeDialogOpen(true);
        }
    };

    const handleCloseModal = () => {
        setOpen(false);
        setModalContent('');
    };

    const handleIncomeDialogClose = () => {
        setIncomeDialogOpen(false);
        setIncomeType('base'); // Reset the selection
    };

    const handleIncomeTypeChange = (event) => {
        setIncomeType(event.target.value);
    };

    const handleIncomeDialogConfirm = () => {
        setModalContent(incomeType === 'one-time' ? 'Add One-Time Income' : 'base' ? 'Add Base Income' : 'Add Recurring Income');
        setIncomeDialogOpen(false);
        setOpen(true);
    };

    const handleExpenseDialogClose = () => {
        setExpenseDialogOpen(false);
        setExpenseType('one-time'); // Reset the selection
    };

    const handleExpenseTypeChange = (event) => {
        setExpenseType(event.target.value);
    };

    const handleExpenseDialogConfirm = () => {
        setModalContent(expenseType === 'one-time' ? 'Add One-Time Expense' : 'Add Recurring Expense');
        setExpenseDialogOpen(false);
        setOpen(true);
    };

    return (
        <>
            <SpeedDial
                ariaLabel="Actions menu"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipOpen
                        onClick={() => handleOpenModal(action.name)}
                    />
                ))}
            </SpeedDial>

            {modalContent === 'Add Base Income' && (
                <RecurringIncomeModal action='add' data={{}} open={open} handleClose={handleCloseModal} salary={true} />
            )}
            {modalContent === 'Add One-Time Income' && (
                <OneTimeIncomeModal action='add' data={{}} open={open} handleClose={handleCloseModal} />
            )}
            {modalContent === 'Add Recurring Income' && (
                <RecurringIncomeModal action='add' data={{}} open={open} handleClose={handleCloseModal} />
            )}
            {modalContent === 'Add One-Time Expense' && (
                <OneTimeExpenseModal action='add' data={{}} open={open} handleClose={handleCloseModal} />
            )}
            {modalContent === 'Add Recurring Expense' && (
                <RecurringExpenseModal action='add' data={{}} open={open} handleClose={handleCloseModal} />
            )}

            <Dialog open={incomeDialogOpen} onClose={handleIncomeDialogClose}>
                <DialogTitle>Select Income Type</DialogTitle>
                <DialogContent>
                    <RadioGroup value={incomeType} onChange={handleIncomeTypeChange}>
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
                    <Button onClick={handleIncomeDialogClose}>Cancel</Button>
                    <Button onClick={handleIncomeDialogConfirm}>Confirm</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={expenseDialogOpen} onClose={handleExpenseDialogClose}>
                <DialogTitle>Select Expense Type</DialogTitle>
                <DialogContent>
                    <RadioGroup value={expenseType} onChange={handleExpenseTypeChange}>
                        <FormControlLabel value="one-time" control={<Radio/>} label="One-Time Expense"/>
                        <small style={{fontSize: 10}}>Select 'One-Time Expense' for irregular or non-recurring expenses such as a single purchase, medical bill, or repair.</small>
                        <Divider style={{marginTop: 15, marginBottom: 15}}/>
                        <FormControlLabel value="recurring" control={<Radio/>} label={<><Loop/> Recurring Expense</>}/>
                        <small style={{fontSize: 10}}>Select 'Recurring Expense' for regular, ongoing expenses such as monthly subscriptions, rent, or utilities.</small>
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleExpenseDialogClose}>Cancel</Button>
                    <Button onClick={handleExpenseDialogConfirm}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}