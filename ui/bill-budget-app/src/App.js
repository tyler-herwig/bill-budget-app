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

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

class App extends Component {
    render() {
        return (
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline />
                    <div className="App">
                        <Router>
                            <AuthProvider>
                                <ResponsiveAppBar />
                                <Routes>
                                    <Route path="/authentication" element={<Authentication />} />
                                    <Route path="/" element={<Dashboard/>} />
                                    <Route path="/profile" element={<Profile/>} />
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