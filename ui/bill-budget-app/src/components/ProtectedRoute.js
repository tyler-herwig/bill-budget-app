import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element }) => {
    const { profile, loadingAuth } = useAuth();

    if (loadingAuth) {
        return null;
    }

    // If not authenticated, redirect to /authentication
    if (!Object.keys(profile.data).length) {
        return <Navigate to="/authentication" replace />;
    }

    // Otherwise, render the requested component
    return element;
};

export default ProtectedRoute;