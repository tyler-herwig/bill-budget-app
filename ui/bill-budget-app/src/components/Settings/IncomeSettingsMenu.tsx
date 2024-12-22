import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import {
    Menu, MenuItem, Divider, IconButton, ListSubheader
} from '@mui/material';
import {
    Edit as EditIcon, Delete as DeleteIcon, MoreHoriz as MoreHorizIcon,
    AppRegistration as EditRecurringIcon, DeleteSweep as DeleteRecurringIcon
} from '@mui/icons-material';
import OneTimeIncomeModal from '../Modals/OneTimeIncomeModal.tsx';
import { IOneTimeIncome } from '../../models/income';
import { useQuery } from '@tanstack/react-query';
import { getIncomeById } from '../../fetch/income.ts';

interface IncomeSettingsMenuProps {
    incomeId: string;
    recurringIncomeId: string | null;
}

const IncomeSettingsMenu: React.FC<IncomeSettingsMenuProps> = ({ incomeId, recurringIncomeId }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [open, setOpen] = React.useState(false);
    const [action, setAction] = React.useState<'add' | 'edit' | 'delete'>('edit');

    const openSettings = Boolean(anchorEl);

    const { data: incomeData, refetch: fetchIncome } = useQuery<IOneTimeIncome>({
        queryKey: ['income', incomeId],
        queryFn: () => getIncomeById(incomeId),
        enabled: false
    });

    const handleCloseModal = () => setOpen(false);

    const handleClickSettings = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseSettings = () => {
        setAnchorEl(null);
    };

    const handleEditClick = async (type: string) => {
        handleCloseSettings();
        setAction('edit');

        if (type === 'one-time') {
            await fetchIncome();
        }

        setOpen(true);
    };

    const handleDeleteClick = (type: string) => {
        handleCloseSettings();
        setAction('delete');
        setOpen(true);
    };

    return (
        <div>
            <IconButton
                aria-label="edit"
                color="primary"
                id={`edit-income-settings-${incomeId}`}
                aria-controls={openSettings ? 'income-settings-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openSettings ? 'true' : undefined}
                onClick={handleClickSettings}
            >
                <MoreHorizIcon />
            </IconButton>

            <StyledMenu
                id="income-settings-menu"
                MenuListProps={{
                    'aria-labelledby': `edit-income-settings-${incomeId}`,
                }}
                anchorEl={anchorEl}
                open={openSettings}
                onClose={handleCloseSettings}
            >
                {recurringIncomeId && [
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
            <OneTimeIncomeModal 
                action={action} 
                income={incomeData} 
                open={open} 
                handleClose={handleCloseModal} 
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

export default IncomeSettingsMenu;