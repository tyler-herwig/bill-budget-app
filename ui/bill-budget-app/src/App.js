import './App.css';
import React, { Component } from 'react';
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

class App extends Component {
    constructor(props) {
        super(props);
        const storedThemePreference = localStorage.getItem('theme') || 'system';
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        this.state = {
            themeMode: storedThemePreference === 'system'
                ? (prefersDarkMode ? 'dark' : 'light')
                : storedThemePreference,
        };
    }

    setThemeMode = (mode) => {
        if (mode === 'system') {
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            mode = prefersDarkMode ? 'dark' : 'light';
        }

        this.setState({ themeMode: mode });
        localStorage.setItem('theme', mode);
    };

    render() {
        const { themeMode } = this.state;

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
                                <ResponsiveAppBar setThemeMode={this.setThemeMode} themeMode={themeMode} />
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
    }
}

export default App;