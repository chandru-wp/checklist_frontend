import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ user, allowedRoles }) {
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // Redirect unauthorized role to home/dashboard
    }

    return <Outlet />;
}
