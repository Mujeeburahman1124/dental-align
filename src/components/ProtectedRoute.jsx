import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Check if user is logged in
    if (!userInfo || !userInfo.token) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has the correct role (if roles are specified)
    if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
        // Redirect to their appropriate dashboard if they try to access a wrong page
        if (userInfo.role === 'patient') return <Navigate to="/patient/dashboard" replace />;
        if (userInfo.role === 'dentist') return <Navigate to="/dentist/dashboard" replace />;
        if (userInfo.role === 'staff') return <Navigate to="/staff/dashboard" replace />;
        if (userInfo.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    // If authorized, render the child components
    return <Outlet />;
};

export default ProtectedRoute;
