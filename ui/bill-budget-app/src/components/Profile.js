import React from 'react';
import {
    Container, Grid, Card, CardContent, Avatar, Typography, TextField,
    Divider, List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const MenuCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    padding: theme.spacing(2),
    boxShadow: theme.shadows[3],
    textAlign: 'center',
}));

const ProfileCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    padding: theme.spacing(3),
    boxShadow: theme.shadows[3]
}));

const CustomListItem = styled(ListItem)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        borderRadius: theme.shape.borderRadius,
    },
    '&.Mui-selected': {
        backgroundColor: theme.palette.action.selected,
        borderRadius: theme.shape.borderRadius,
    },
    width: '100%',
    justifyContent: 'flex-start',
    padding: theme.spacing(1),
}));

const MenuList = styled(List)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 0,
}));

const Profile = () => {
    const { profile, logOut } = useAuth();
    const location = useLocation();

    return (
        <Container maxWidth="lg" style={{ marginTop: 20, marginBottom: 20 }}>
            <Grid container spacing={2}>
                {/* Menu Section */}
                <Grid item xs={12} md={4}>
                    <MenuCard>
                        <CardContent>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    textAlign: 'left',
                                    fontSize: 16,
                                    fontWeight: 'bold'
                                }}
                            >
                                Profile Settings
                            </Typography>
                            <Divider sx={{ my: 2 }}/>
                            <MenuList>
                                <CustomListItem
                                    button
                                    component={Link}
                                    to="/"
                                    selected={location.pathname === '/'}
                                >
                                    <ListItemIcon>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Dashboard" />
                                </CustomListItem>
                                <CustomListItem
                                    button
                                    component={Link}
                                    to="/profile"
                                    selected={location.pathname === '/profile'}
                                    style={{margin: 5}}
                                >
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Profile" />
                                </CustomListItem>
                                <Divider sx={{ my: 2 }} />
                                <CustomListItem
                                    button
                                    onClick={logOut}
                                >
                                    <ListItemIcon>
                                        <ExitToAppIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Logout" />
                                </CustomListItem>
                            </MenuList>
                        </CardContent>
                    </MenuCard>
                </Grid>

                {/* Profile Content Section */}
                <Grid item xs={12} md={8}>
                    <ProfileCard>
                        <CardContent>
                            <Avatar
                                alt={profile.name}
                                src={profile.picture}
                                sx={{ width: 120, height: 120, margin: 'auto' }}
                            />
                            <Typography variant="h4" component="h1" sx={{ mt: 2 }}>
                                {profile.name}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2 }}>
                                {profile.email}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                This info is from your Google account. You cannot edit it within this application.
                            </Typography>
                            <TextField
                                fullWidth
                                label="Name"
                                value={profile.name}
                                variant="outlined"
                                margin="normal"
                                disabled
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                value={profile.email}
                                variant="outlined"
                                margin="normal"
                                disabled
                                sx={{ mb: 2 }}
                            />
                        </CardContent>
                    </ProfileCard>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;