import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Profile from './components/Profile';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './components/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Authentication from './components/Authentication';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
    const storedThemePreference = localStorage.getItem('theme') || 'system';
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // State for theme mode
    const [themeMode, setThemeMode] = useState(
        storedThemePreference === 'system' ? (prefersDarkMode ? 'dark' : 'light') : storedThemePreference
    );

    useEffect(() => {
        // Handle changes in theme based on user preference or system preference
        const handleSystemThemeChange = (e) => {
            if (storedThemePreference === 'system') {
                setThemeMode(e.matches ? 'dark' : 'light');
            }
        };

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', handleSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, [storedThemePreference]);

    const changeThemeMode = (mode) => {
        if (mode === 'system') {
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            mode = prefersDarkMode ? 'dark' : 'light';
        }
        setThemeMode(mode);
        localStorage.setItem('theme', mode);
    };

    const theme = createTheme({
        palette: {
            mode: themeMode,
        },
    });

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="App">
                    <Router>
                        <AuthProvider>
                            <ResponsiveAppBar setThemeMode={changeThemeMode} themeMode={themeMode} />
                            <Routes>
                                <Route path="/authentication" element={<Authentication />} />
                                <Route path="/" element={<PrivateRoute element={Dashboard} />} />
                                <Route path="/profile" element={<PrivateRoute element={Profile} />} />
                            </Routes>
                        </AuthProvider>
                    </Router>
                </div>
            </ThemeProvider>
        </GoogleOAuthProvider>
    );
};

export default App;