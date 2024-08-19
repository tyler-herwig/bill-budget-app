import * as React from 'react';
import {
    AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar,
    Tooltip, MenuItem, Divider, Select, FormControl, InputLabel
} from '@mui/material';
import { InsertChart, Dashboard, Person2, Logout } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ResponsiveAppBar({ setThemeMode, themeMode }) {
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const { profile, logOut } = useAuth();

    const settings = [
        {
            icon: <Dashboard fontSize='small' />,
            title: 'Dashboard',
            page: '/'
        },
        {
            icon: <Person2 fontSize='small' />,
            title: 'Profile',
            page: '/profile'
        },
        {
            icon: <Logout fontSize='small' />,
            title: 'Logout'
        }
    ];

    const handleThemeChange = (event) => {
        const selectedMode = event.target.value;
        setThemeMode(selectedMode);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <InsertChart sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        BUDGET EASY
                    </Typography>

                    <InsertChart sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        BUDGET EASY
                    </Typography>

                    <Box sx={{ flexGrow: 0, marginLeft: 'auto' }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                {Object.keys(profile).length ? <Avatar alt={profile.name} src={profile.picture} /> : ''}
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {Object.keys(profile).length && (
                                <MenuItem disabled>
                                    <Typography textAlign="center" sx={{ fontWeight: 'bold' }}>
                                        {profile.name}
                                    </Typography>
                                </MenuItem>
                            )}
                            <FormControl sx={{margin: 2}}>
                                <InputLabel>Theme</InputLabel>
                                <Select
                                    value={themeMode}
                                    onChange={handleThemeChange}
                                    label="Theme"
                                    sx={{ minWidth: 180 }}
                                >
                                    <MenuItem value="light">Light</MenuItem>
                                    <MenuItem value="dark">Dark</MenuItem>
                                    <MenuItem value="system">Use System Default</MenuItem>
                                </Select>
                            </FormControl>
                            <Divider />
                            {settings.map((setting) => (
                                setting.title === 'Logout' ? (
                                    <MenuItem key={setting.title} onClick={() => {
                                        handleCloseUserMenu();
                                        logOut();
                                    }}>
                                        <Typography textAlign="center">{setting.icon} {setting.title}</Typography>
                                    </MenuItem>
                                ) : (
                                    <MenuItem key={setting.title} onClick={handleCloseUserMenu} component={Link} to={setting.page}>
                                        <Typography textAlign="center">{setting.icon} {setting.title}</Typography>
                                    </MenuItem>
                                )
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;