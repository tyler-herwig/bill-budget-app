import React from 'react';
import {
    Container, Grid, Paper, Avatar, Typography, TextField, Box, Button, TableContainer, Table, TableHead,
    TableRow, TableCell, TableBody, IconButton
} from '@mui/material';
import {MoreHoriz as MoreHorizIcon, Loop} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import RecurringIncomeModal from './RecurringIncomeModal';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const Profile = () => {
    const [open, setOpen] = React.useState(false);

    const handleOpenModal = (content) => {
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: 20, marginBottom: 20 }}>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Item>
                            <Avatar
                                alt="Profile Picture"
                                sx={{ width: 100, height: 100, margin: 'auto', bgcolor: '#0072ff', backgroundImage: 'linear-gradient(to right, #00c6ff, #0072ff)' }}
                            >
                                T
                            </Avatar>
                            <Typography variant="h3" component="h1" style={{ marginTop: 10 }}>
                                Tyler Herwig
                            </Typography>
                            <Button variant="outlined" color="primary" style={{ marginTop: 10 }}>
                                Edit Profile Picture
                            </Button>
                        </Item>
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
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        defaultValue="Tyler Herwig"
                                        variant="outlined"
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        defaultValue="tyler.herwig@example.com"
                                        variant="outlined"
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        defaultValue="********"
                                        variant="outlined"
                                        margin="normal"
                                    />
                                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                                        <Button variant="contained" color="primary" style={{marginTop: 20}}>
                                            Save Changes
                                        </Button>
                                    </Grid>
                                </Item>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <Item>
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
                                    <TableContainer component={Paper}>
                                        <Table aria-label="Income table" size="medium">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
                                                    <TableCell style={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                                                    <TableCell style={{ fontWeight: 'bold' }}>Recurrence</TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell style={{ fontWeight: 'bold' }}>Unemployment</TableCell>
                                                    <TableCell align="right">$526.00</TableCell>
                                                    <TableCell>
                                                        <Loop fontSize='small' color='primary' style={{ marginLeft: 4 }} /> Weekly <br/>
                                                        <small style={{ color: 'grey', fontSize: '10px' }}>June 1st, 2024 to August 31st, 2024</small>
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            aria-label="edit"
                                                            color="primary"
                                                        >
                                                            <MoreHorizIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{ fontWeight: 'bold' }}>Test Company</TableCell>
                                                    <TableCell align="right">$555.00</TableCell>
                                                    <TableCell>
                                                        <Loop fontSize='small' color='primary' style={{ marginLeft: 4 }} /> Bi-Weekly <br/>
                                                        <small style={{ color: 'grey', fontSize: '10px' }}>September 1st, 2024 to December 31st, 2024</small>
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            aria-label="edit"
                                                            color="primary"
                                                        >
                                                            <MoreHorizIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Item>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <RecurringIncomeModal action='add' open={open} handleClose={handleCloseModal} salary={true} />
        </Container>
    );
};

export default Profile;