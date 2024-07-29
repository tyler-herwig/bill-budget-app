import React, { createContext, useState, useEffect, useCallback } from 'react';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState({ salaries: [] });
    const [loadingProfile, setLoadingProfile] = useState(true);

    const API_URL = process.env.REACT_APP_API_URL;

    const refreshProfile = useCallback(async () => {
        setLoadingProfile(true);
        try {
            const response = await fetch(`${API_URL}/income/recurring?source=salary`);
            const data = await response.json();
            setProfile({
                salaries: data
            });
        } catch (error) {
            console.error('Error fetching salary:', error);
        } finally {
            setLoadingProfile(false);
        }
    }, [API_URL]);

    useEffect(() => {
        refreshProfile();
    }, [refreshProfile]);

    return (
        <ProfileContext.Provider value={{ profile, loadingProfile, refreshProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};