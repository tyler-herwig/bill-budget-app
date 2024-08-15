import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ element: Element, ...rest }) => {
    const { profile, loadingAuth } = useAuth();

    // Check if the user is authenticated
    if (!loadingAuth) {
        if (Object.keys(profile).length === 0) {
            // If not authenticated, redirect to /authentication
            return <Navigate to="/authentication" replace />;
        }
    }

    // If authenticated, render the requested component
    return <Element {...rest} />;
};

export default PrivateRoute;