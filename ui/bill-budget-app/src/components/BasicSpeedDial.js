import React from 'react';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import { AccountBalance, Payments } from '@mui/icons-material';
import PaycheckModal from './PaycheckModal';
import BillModal from './BillModal';

const actions = [
    { icon: <AccountBalance />, name: 'Add Paycheck' },
    { icon: <Payments />, name: 'Add Bill' }
];

export default function BasicSpeedDial() {
    const [open, setOpen] = React.useState(false);
    const [modalContent, setModalContent] = React.useState('');

    const handleOpenModal = (content) => {
        setModalContent(content);
        setOpen(true);
    };

    const handleCloseModal = () => setOpen(false);

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

            {modalContent === 'Add Paycheck' && (
                <PaycheckModal action='add' open={open} handleClose={handleCloseModal} />
            )}
            {modalContent === 'Add Bill' && (
                <BillModal open={open} handleClose={handleCloseModal} />
            )}
        </>
    );
}