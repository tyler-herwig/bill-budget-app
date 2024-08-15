import React from 'react';
import { Container, Card, CardContent, Typography, CircularProgress, Divider } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from './AuthContext';

const Authentication = () => {
    const { loadingAuth, onLoginSuccess, onLoginFailure } = useAuth();

    return (
        <Container
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: (theme) => theme.palette.background.default,
            }}
        >
            <Card
                sx={{
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3
                }}
            >
                <CardContent>
                    <Typography variant="h2">Glad to have you</Typography>
                    <Typography variant="h6">Let's get those finances straightened out...</Typography>
                    <p>It's time to make budgeting easy</p>
                    <Divider style={{ marginBottom: 15 }} />
                    {loadingAuth ? (
                        <CircularProgress />
                    ) : (
                        <GoogleLogin
                            onSuccess={onLoginSuccess}
                            onError={onLoginFailure}
                            cookiePolicy='single_host_origin'
                        />
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default Authentication;