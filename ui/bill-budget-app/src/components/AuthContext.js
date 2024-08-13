import React, { createContext, useState, useEffect, useCallback } from 'react';
import { googleLogout } from '@react-oauth/google';
import { gapi } from 'gapi-script';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [profile, setProfile] = useState({ data: {}, salaries: [] });
    const [loadingAuth, setLoadingAuth] = useState(false);
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchSalaries = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/income/recurring?source=salary`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching salaries:', error);
            return [];
        }
    }, [API_URL]);

    useEffect(() => {
        gapi.load('auth2', () => {
            gapi.auth2.init({ client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID });
        });
    }, []);

    const responseMessage = async (response) => {
        setLoadingAuth(true);
        try {
            const authResponse = await gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse();
            const accessToken = authResponse.access_token;

            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json',
                },
            });
            const userInfo = await userInfoResponse.json();

            // Await the result of fetchSalaries
            const salaries = await fetchSalaries();

            setProfile({
                data: userInfo,
                salaries: salaries
            });

            navigate('/profile');
        } catch (error) {
            console.log('Fetch Error:', error);
        } finally {
            setLoadingAuth(false);
        }
    };

    const errorMessage = (error) => {
        console.log('Login Failed:', error);
    };

    const logOut = () => {
        googleLogout();
        setProfile({ data: {}, salaries: [] });
        navigate('/authentication');
    };

    return (
        <AuthContext.Provider value={{ profile, loadingAuth, responseMessage, errorMessage, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);