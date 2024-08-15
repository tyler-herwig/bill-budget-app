import React, { createContext, useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [profile, setProfile] = useState({});
    const [loadingAuth, setLoadingAuth] = useState(true); // Default to true while checking auth status
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;

    // Function to check if the user is already authenticated
    const checkAuthentication = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/check-auth`, {
                method: 'GET',
                credentials: 'include', // Send cookies along with the request
            });

            if (!res.ok) {
                // If the response status is 401 (Unauthorized), redirect to /authenticate
                if (res.status === 401) {
                    navigate('/authentication');
                }
                throw new Error('Network response was not ok');
            }

            const data = await res.json();

            if (data.user) {
                setProfile(data.user);
            } else {
                console.error('User data not found:', data);
            }
        } catch (error) {
            console.error('Error during authentication check:', error);
        } finally {
            setLoadingAuth(false);
        }
    };

    useEffect(() => {
        checkAuthentication();
    }, []);

    const onLoginSuccess = async (response) => {
        setLoadingAuth(true);
        try {
            const { credential } = response;

            const res = await fetch(`${API_URL}/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${credential}`, // Token in Authorization header
                },
                credentials: 'include',
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

    const logOut = async() => {
        try {
            const res = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include', // Ensure cookies are included in the request
            });

            if (!res.ok) {
                if (res.status === 400) {
                    console.warn('No access token found');
                } else {
                    throw new Error('Failed to log out');
                }
            }

            googleLogout(); // Perform Google logout
            setProfile({}); // Clear the profile state
            navigate('/authentication'); // Redirect to the authentication page
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ profile, loadingAuth, onLoginSuccess, onLoginFailure, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);