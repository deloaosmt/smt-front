import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "./AuthHook";

// Functional component for protected routes
export const PrivateRoute = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};
