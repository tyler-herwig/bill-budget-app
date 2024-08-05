import React from 'react';
import { Box, Alert, AlertTitle, Divider } from '@mui/material';

const NoDataMessage = ({ title, message }) => {
    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Alert variant="outlined" severity="info">
                <AlertTitle>{title}</AlertTitle>
                <Divider style={{ marginBottom: 10 }} />
                {message}
            </Alert>
        </Box>
    );
};

export default NoDataMessage;