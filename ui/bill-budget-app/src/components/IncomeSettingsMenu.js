import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import {
    Menu, MenuItem, Divider, IconButton
} from '@mui/material';
import {
    Edit as EditIcon, Delete as DeleteIcon, FileCopy as FileCopyIcon, MoreHoriz as MoreHorizIcon
} from '@mui/icons-material';
import OneTimeIncomeModal from './OneTimeIncomeModal';
import RecurringIncomeModal from './RecurringIncomeModal';

const StyledMenu = styled((props) => (
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

const IncomeSettingsMenu = ({ data }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openSettings = Boolean(anchorEl);
    const [open, setOpen] = React.useState(false);
    const [action, setAction] = React.useState('');
    const [modalData, setModalData] = React.useState({});

    const handleCloseModal = () => setOpen(false);

    const handleClickSettings = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseSettings = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        handleCloseSettings();
        setModalData(data);
        setAction('edit');
        setOpen(true);
    };

    const handleDeleteClick = () => {
        handleCloseSettings();
        setModalData(data);
        setAction('delete');
        setOpen(true);
    }

    const ModalComponent = data.type === 'recurring'
        ? RecurringIncomeModal
        : OneTimeIncomeModal;

    return (
        <div>
            <IconButton
                aria-label="edit"
                color="primary"
                id={`edit-income-settings-${data._id}`}
                aria-controls={openSettings ? 'income-settings-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openSettings ? 'true' : undefined}
                variant="contained"
                onClick={handleClickSettings}
            >
                <MoreHorizIcon />
            </IconButton>

            <StyledMenu
                id="income-settings-menu"
                MenuListProps={{
                    'aria-labelledby': `edit-income-settings-${data._id}`,
                }}
                anchorEl={anchorEl}
                open={openSettings}
                onClose={handleCloseSettings}
            >
                <MenuItem onClick={handleEditClick} disableRipple>
                    <EditIcon />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleCloseSettings} disableRipple disabled={true}>
                    <FileCopyIcon />
                    Duplicate
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handleDeleteClick}>
                    <DeleteIcon />
                    Delete
                </MenuItem>
                <MenuItem onClick={handleCloseSettings} disableRipple disabled={true}>
                    <MoreHorizIcon />
                    More
                </MenuItem>
            </StyledMenu>
            <ModalComponent action={action} data={modalData} open={open} handleClose={handleCloseModal} />
        </div>
    );
}

export default IncomeSettingsMenu;