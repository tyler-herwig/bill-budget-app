import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PaycheckModal from './PaycheckModal';

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

const PaycheckSettingsMenu = ({ data }) => {
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

    return (
        <div>
            <IconButton
                aria-label="edit"
                color="primary"
                id={`edit-paycheck-settings-${data._id}`}
                aria-controls={openSettings ? 'paycheck-settings-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openSettings ? 'true' : undefined}
                variant="contained"
                onClick={handleClickSettings}
            >
                <MoreHoriz />
            </IconButton>

            <StyledMenu
                id="paycheck-settings-menu"
                MenuListProps={{
                    'aria-labelledby': `edit-paycheck-settings-${data._id}`,
                }}
                anchorEl={anchorEl}
                open={openSettings}
                onClose={handleCloseSettings}
            >
                <MenuItem onClick={handleEditClick} disableRipple>
                    <EditIcon />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleCloseSettings} disableRipple>
                    <FileCopyIcon />
                    Duplicate
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handleDeleteClick}>
                    <DeleteIcon />
                    Delete
                </MenuItem>
                <MenuItem onClick={handleCloseSettings} disableRipple>
                    <MoreHorizIcon />
                    More
                </MenuItem>
            </StyledMenu>
            <PaycheckModal action={action} data={modalData} open={open} handleClose={handleCloseModal} />
        </div>
    );
}

export default PaycheckSettingsMenu;