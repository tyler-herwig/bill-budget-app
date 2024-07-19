import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { QueryStats } from '@mui/icons-material';
import { FinancialOutlookChart } from './FinancialOutlookChart';
import { BasicTabs } from './BasicTabs';

const InfoPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
}));

const UserIntroSection = () => {
    return (
        <Grid container spacing={2} style={{ marginBottom: '15px' }}>
            <Grid item xs={12} md={6}>
                <InfoPaper style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    <Box>
                        <Typography variant="h3" style={{ color: '#fff' }}>Welcome, Tyler!</Typography>
                        <Typography variant="body1" style={{ color: '#fff' }}>Here's a quick overview of your financial data.</Typography>
                    </Box>
                    <br/>
                    <BasicTabs/>
                </InfoPaper>
            </Grid>
            <Grid item xs={12} md={6}>
                <InfoPaper style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    <Box>
                        <Typography variant="h6" style={{fontWeight: 'bold'}}><QueryStats /> Your Financial Outlook</Typography>
                        <br />
                        <FinancialOutlookChart/>
                    </Box>
                </InfoPaper>
            </Grid>
        </Grid>
    );
};

export default UserIntroSection;