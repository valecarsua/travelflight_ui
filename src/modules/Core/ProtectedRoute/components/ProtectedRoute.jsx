import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const isAuthenticated = !!localStorage.getItem('access_token');

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;