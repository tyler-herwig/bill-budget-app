import React, { createContext, useState } from 'react';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [profile, setProfile] = useState({});
    const [loadingAuth, setLoadingAuth] = useState(false);
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;

    const onLoginSuccess = async (response) => {
        setLoadingAuth(true);
        try {
            const { credential } = response;

            const res = await fetch(`${API_URL}/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${credential}` // Token in Authorization header
                },
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();

            if (data.user) {
                setProfile(data.user);
                navigate('/profile');
            } else {
                console.error('User data not found:', data);
            }
        } catch (error) {
            console.error('Error during authentication:', error);
        } finally {
            setLoadingAuth(false);
        }
    };

    const onLoginFailure = (response) => {
        console.log('Login Failed:', response);
    };

    const logOut = () => {
        googleLogout();
        setProfile({});
        navigate('/authentication');
    };

    return (
        <AuthContext.Provider value={{ profile, loadingAuth, onLoginSuccess, onLoginFailure, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);