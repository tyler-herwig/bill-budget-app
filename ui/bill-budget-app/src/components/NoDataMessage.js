import React from 'react';
import { Box, Alert, AlertTitle, Divider } from '@mui/material';

const NoDataMessage = () => {
    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Alert variant="outlined" severity="info" >
            <AlertTitle>Insufficient Data</AlertTitle>
            <Divider style={{marginBottom: 10}}/>
            The data available is not sufficient for this widget. Please adjust your filters and try again.
        </Alert>
        </Box>
    );
};

export default NoDataMessage;