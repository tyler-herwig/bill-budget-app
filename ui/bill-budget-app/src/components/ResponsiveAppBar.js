import * as React from 'react';
import {
    AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar,
    Button, Tooltip, MenuItem, Divider
} from '@mui/material';
import { Menu as MenuIcon, InsertChart, AddBox, Dashboard, Person2, Logout } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const pages = [];

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const { profile, logOut } = useAuth();

    const settings = [
        {
            icon: <Dashboard fontSize='small'/>,
            title: 'Dashboard',
            page: '/'
        },
        {
            icon: <Person2 fontSize='small'/>,
            title: 'Profile',
            page: '/profile'
        },
        {
            icon: <Logout fontSize='small'/>,
            title: 'Logout'
        }
    ]

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

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="open navigation menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center"><AddBox /> {page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

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

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                sx={{ my: 2, color: 'white' }}
                                startIcon={<AddBox />}
                                onClick={handleCloseNavMenu}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                { Object.keys(profile).length ? <Avatar alt={profile.name} src={profile.picture} /> : '' }
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