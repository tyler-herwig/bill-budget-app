import React from 'react';
import { SpeedDial, SpeedDialIcon, SpeedDialAction, Dialog, DialogTitle, DialogContent, DialogActions, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { AccountBalance, Payments } from '@mui/icons-material';
import OneTimeIncomeModal from './OneTimeIncomeModal';
import RecurringIncomeModal from './RecurringIncomeModal';
import OneTimeExpenseModal from './OneTimeExpenseModal';
import RecurringExpenseModal from './RecurringExpenseModal';

const actions = [
    { icon: <AccountBalance />, name: 'Add Income' },
    { icon: <Payments />, name: 'Add Expense' }
];

export default function ControlsSpeedDial() {
    const [open, setOpen] = React.useState(false);
    const [modalContent, setModalContent] = React.useState('');
    const [expenseType, setExpenseType] = React.useState('one-time');
    const [expenseDialogOpen, setExpenseDialogOpen] = React.useState(false);
    const [incomeType, setIncomeType] = React.useState('one-time');
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
        setIncomeType('one-time'); // Reset the selection
    };

    const handleIncomeTypeChange = (event) => {
        setIncomeType(event.target.value);
    };

    const handleIncomeDialogConfirm = () => {
        setModalContent(incomeType === 'one-time' ? 'Add One-Time Income' : 'Add Recurring Income');
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
                        onClick={() => handleOpenModal(action.name)}
                    />
                ))}
            </SpeedDial>

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
                        <FormControlLabel value="one-time" control={<Radio />} label="One-Time Income" />
                        <FormControlLabel value="recurring" control={<Radio />} label="Recurring Income" />
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
                        <FormControlLabel value="one-time" control={<Radio />} label="One-Time Expense" />
                        <FormControlLabel value="recurring" control={<Radio />} label="Recurring Expense" />
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