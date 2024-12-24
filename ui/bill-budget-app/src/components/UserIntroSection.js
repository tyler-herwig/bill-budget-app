import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { QueryStats } from '@mui/icons-material';
import { FinancialOutlookChart } from './FinancialOutlookChart';
import { UserIntroTabs } from './UserIntroTabs';
import { useAuth } from './AuthContext';

const UserIntroSection = ({incomes, isLoadingIncomes, expenses, isLoadingExpenses}) => {
    const { profile } = useAuth();

    if (isLoadingIncomes || isLoadingExpenses) return <p>Loading...</p>;

    return (
        <Grid container spacing={2} style={{ marginBottom: '15px' }}>
            <Grid item xs={12} md={5}>
                <InfoPaper style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    <Box>
                        { Object.keys(profile).length ? (
                            <Typography variant="h3">Welcome, {profile.name}!</Typography>
                        ) : '' }
                        <Typography variant="body1">Here's a quick overview of your financial data.</Typography>
                    </Box>
                    <br/>
                    <UserIntroTabs 
                        incomes={incomes} 
                        expenses={expenses}
                    />
                </InfoPaper>
            </Grid>
            <Grid item xs={12} md={7}>
                <InfoPaper style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    <Box>
                        <Typography variant="h6" style={{fontWeight: 'bold'}}><QueryStats /> Your Financial Outlook</Typography>
                        <br />
                        <FinancialOutlookChart incomes={incomes}/>
                    </Box>
                </InfoPaper>
            </Grid>
        </Grid>
    );
};

const InfoPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
}));

export default UserIntroSection;