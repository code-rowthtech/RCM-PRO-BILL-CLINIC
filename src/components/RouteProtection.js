import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkRouteAccess } from '../utils/routeGuard';

const RouteProtection = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check access when component mounts or route changes
        const hasAccess = checkRouteAccess(location.pathname);
        
        if (hasAccess === false) {
            // User doesn't have permission for this route
            navigate('/access-denied', { replace: true });
        } else if (hasAccess === null && !isPublicRoute(location.pathname)) {
            // Route not found in menu and not a public route
            navigate('/error-404', { replace: true });
        }
    }, [location.pathname, navigate]);

    // Listen for manual URL changes
    useEffect(() => {
        const handlePopState = () => {
            const hasAccess = checkRouteAccess(window.location.pathname);
            if (hasAccess === false) {
                navigate('/access-denied', { replace: true });
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [navigate]);

    return children;
};

const isPublicRoute = (pathname) => {
    const publicRoutes = [
        '/account/',
        '/error-404',
        '/error-500', 
        '/access-denied',
        '/maintenance'
    ];
    
    return publicRoutes.some(route => pathname.startsWith(route));
};

export default RouteProtection;