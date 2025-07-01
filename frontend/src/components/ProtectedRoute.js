// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Check for the authentication token in localStorage
    const token = localStorage.getItem('authToken');

    // If the token exists, allow access to the page.
    // The <Outlet /> component is a placeholder for whatever page we are protecting.
    if (token) {
        return <Outlet />;
    }

    // If no token exists, redirect the user to the homepage.
    return <Navigate to="/" replace />;
};

export default ProtectedRoute;