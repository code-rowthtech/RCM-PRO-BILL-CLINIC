import { Navigate, useLocation } from 'react-router-dom';

// Production authentication and remote loader code are excluded.
// There is no demo bypass for protected pages.
const PrivateRoute = () => {
    const location = useLocation();
    return <Navigate to="/account/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
