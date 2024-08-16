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