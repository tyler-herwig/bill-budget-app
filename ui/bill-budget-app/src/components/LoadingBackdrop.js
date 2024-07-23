import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

const LoadingBackdrop = ({ open }) => {
    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            open={open}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default LoadingBackdrop;