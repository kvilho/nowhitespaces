import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const location = useLocation();
    const isAuthenticated = authService.isAuthenticated();
    const userRole = authService.getRole(); // Fetch the user's role from authService

    if (!isAuthenticated) {
        // Redirect to login if the user is not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        // Redirect to home if the user does not have the required role
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;