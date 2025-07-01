// src/components/ProtectedRoute.js

import React from 'react';
// 👇 This line imports both Navigate and Outlet
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('authToken');

    // If a token exists, show the requested page (the Outlet).
    // If not, redirect to the homepage.
    return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;