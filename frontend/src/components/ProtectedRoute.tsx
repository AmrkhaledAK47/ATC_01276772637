import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '@/services/auth.service';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

/**
 * Protected route component that checks if the user is authenticated
 * and has the required role before allowing access to the page.
 * If not authenticated, redirects to the login page.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles = []
}) => {
    const location = useLocation();
    const isAuthenticated = AuthService.isAuthenticated();
    const currentUser = AuthService.getCurrentUserFromStorage();

    // Check if user is authenticated
    if (!isAuthenticated) {
        // Redirect to login page and pass the intended destination
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // If roles are specified, check if the user has the necessary role
    if (allowedRoles.length > 0) {
        const hasRequiredRole = allowedRoles.includes(currentUser?.role);

        if (!hasRequiredRole) {
            // Redirect to unauthorized page or dashboard
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // If authenticated and authorized, render the children
    return <>{children}</>;
}; 