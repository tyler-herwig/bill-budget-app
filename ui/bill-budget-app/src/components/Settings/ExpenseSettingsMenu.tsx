import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import {
    Menu, MenuItem, Divider, IconButton, ListSubheader
} from '@mui/material';
import {
    Edit as EditIcon, Delete as DeleteIcon, MoreHoriz as MoreHorizIcon,
    AppRegistration as EditRecurringIcon, DeleteSweep as DeleteRecurringIcon
} from '@mui/icons-material';
import OneTimeExpenseModal from '../Modals/OneTimeExpenseModal.tsx';
import { useQuery } from '@tanstack/react-query';
import { getIncomeById, getRecurringIncomeById } from '../../fetch/income.ts';
import RecurringExpenseModal from '../Modals/RecurringExpenseModal.tsx';
import { IOneTimeExpense, IRecurringExpense } from '../../models/expense.ts';
import { getExpenseById, getRecurringExpenseById } from '../../fetch/expense.ts';

interface ExpenseSettingsMenuProps {
    expenseId: string;
    recurringExpenseId: string | null;
    refetch: () => void;
}

const ExpenseSettingsMenu: React.FC<ExpenseSettingsMenuProps> = ({ expenseId, recurringExpenseId, refetch }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openOneTimeExpenseModal, setOpenOneTimeExpenseModal] = React.useState(false);
    const [openRecurringExpenseModal, setOpenRecurringExpenseModal] = React.useState(false);
    const [action, setAction] = React.useState<'add' | 'edit' | 'delete'>('edit');

    const openSettings = Boolean(anchorEl);

    const { data: expenseData, refetch: fetchExpense } = useQuery<IOneTimeExpense>({
        queryKey: ['expense', expenseId],
        queryFn: () => getExpenseById(expenseId),
        enabled: false
    });

    const { data: recurringExpenseData, refetch: fetchRecurringExpense } = useQuery<IRecurringExpense>({
        queryKey: ['recurringExpense', recurringExpenseId],
        queryFn: () => getRecurringExpenseById(recurringExpenseId),
        enabled: false
    });

    const handleCloseModal = (type) =>  {
        switch (type) {
            case 'one-time':
                setOpenOneTimeExpenseModal(false);
                break;
            case 'recurring':
                setOpenRecurringExpenseModal(false);
                break;
            default:
                break;
        }
    }

    const handleClickSettings = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseSettings = () => {
        setAnchorEl(null);
    };

    const handleEditClick = async (type: string) => {
        handleCloseSettings();
        setAction('edit');

        switch (type) {
            case 'one-time':
                await fetchExpense();
                setOpenOneTimeExpenseModal(true);
                break;
            case 'recurring':
                await fetchRecurringExpense();
                setOpenRecurringExpenseModal(true);
                break;
            default:
                break;
        }
    };

    const handleDeleteClick = async (type: string) => {
        handleCloseSettings();
        setAction('delete');

        switch (type) {
            case 'one-time':
                await fetchExpense();
                setOpenOneTimeExpenseModal(true);
                break;
            case 'recurring':
                await fetchRecurringExpense();
                setOpenRecurringExpenseModal(true);
            default:
                break;
        }
    };

    return (
        <div>
            <IconButton
                aria-label="edit"
                color="primary"
                id={`edit-expense-settings-${expenseId}`}
                aria-controls={openSettings ? 'expense-settings-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openSettings ? 'true' : undefined}
                onClick={handleClickSettings}
            >
                <MoreHorizIcon />
            </IconButton>

            <StyledMenu
                id="expense-settings-menu"
                MenuListProps={{
                    'aria-labelledby': `edit-expense-settings-${expenseId}`,
                }}
                anchorEl={anchorEl}
                open={openSettings}
                onClose={handleCloseSettings}
            >
                {recurringExpenseId && [
                    <ListSubheader key="recurrence-header">Recurrence</ListSubheader>,
                    <MenuItem key="edit-recurring" onClick={() => handleEditClick('recurring')} disableRipple>
                        <EditRecurringIcon />
                        Edit
                    </MenuItem>,
                    <MenuItem key="delete-recurring" onClick={() => handleDeleteClick('recurring')} disableRipple>
                        <DeleteRecurringIcon />
                        Delete
                    </MenuItem>,
                    <Divider key="divider" sx={{ my: 0.5 }} />,
                ]}
                <ListSubheader>One-Time</ListSubheader>
                <MenuItem onClick={() => handleEditClick('one-time')} disableRipple>
                    <EditIcon />
                    Edit
                </MenuItem>
                <MenuItem onClick={() => handleDeleteClick('one-time')} disableRipple>
                    <DeleteIcon />
                    Delete
                </MenuItem>
            </StyledMenu>

            {/* Pass fetched income data to the modal */}
            <OneTimeExpenseModal 
                action={action} 
                expense={expenseData} 
                open={openOneTimeExpenseModal} 
                handleClose={() => handleCloseModal('one-time')}
                refetch={refetch}
            />

            <RecurringExpenseModal 
                action={action} 
                expense={recurringExpenseData} 
                open={openRecurringExpenseModal} 
                handleClose={() => handleCloseModal('recurring')}
                refetch={refetch}
            />
        </div>
    );
};

const StyledMenu = styled((props: any) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

export default ExpenseSettingsMenu;