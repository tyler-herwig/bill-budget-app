import React from 'react';
import {
    Container, Grid, Paper, Avatar, Typography, TextField, Box, Button, TableContainer, Table, TableHead,
    TableRow, TableCell, TableBody, IconButton
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import {MoreHoriz as MoreHorizIcon, Loop} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import RecurringIncomeModal from './RecurringIncomeModal';
import moment from 'moment';
import NoDataMessage from './NoDataMessage';
import { useAuth } from './AuthContext';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const Profile = () => {
    const [modalOpen, setModalOpen] = React.useState(false);

    const { profile, logOut } = useAuth();

    const handleOpenModal = (content) => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: 20, marginBottom: 20 }}>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        { Object.keys(profile).length ? (
                            <Item>
                                <Avatar
                                    alt={profile.name}
                                    src={profile.picture}
                                    sx={{ width: 100, height: 100, margin: 'auto' }}
                                />
                                <Typography variant="h3" component="h1" style={{ marginTop: 10 }}>
                                    {profile.name}
                                </Typography>
                            </Item>
                        ): '' }
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={5}>
                                <Item>
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                        <Typography variant="h4" component="h2" align="left">
                                            Profile
                                        </Typography>
                                    </Box>
                                    <small>This info is from your Google account. You cannot edit it within this application.</small>
                                    { Object.keys(profile).length ? (
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            value={profile.name}
                                            variant="outlined"
                                            margin="normal"
                                            disabled
                                        />
                                    ): '' }
                                    { Object.keys(profile).length ? (
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={profile.email}
                                            variant="outlined"
                                            margin="normal"
                                            disabled
                                        />
                                    ): '' }
                                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            style={{marginTop: 20}}
                                            onClick={logOut}
                                        >
                                            Log Out
                                        </Button>
                                    </Grid>
                                </Item>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <Item style={{paddingBottom: 20}}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                        <Typography variant="h4" component="h2" align="left">
                                            Salary
                                        </Typography>
                                    </Box>
                                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            style={{marginBottom: 20}}
                                            onClick={() => handleOpenModal('Add Income')}
                                        >
                                            Add Salary
                                        </Button>
                                    </Grid>
                                </Item>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <RecurringIncomeModal action='add' data={{}} open={modalOpen} handleClose={handleCloseModal} salary={true} />
        </Container>
    );
};

export default Profile;