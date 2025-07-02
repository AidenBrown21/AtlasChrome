// src/components/AdminRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // We need a new library to read the token

const useAuth = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return { isAuth: false, isAdmin: false };

    try {
        // Decode the token to check for the 'role' field
        const decoded = jwtDecode(token);
        const isAdmin = decoded.role === 'admin';
        return { isAuth: true, isAdmin };
    } catch (e) {
        return { isAuth: false, isAdmin: false };
    }
};

const AdminRoute = () => {
    const { isAdmin } = useAuth();

    // If the user is an admin, show the page. Otherwise, redirect to the dashboard.
    return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;