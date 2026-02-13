import React from 'react';
import { Navigate } from 'react-router-dom';

// check apakah user sudah login
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        // kembali ke halaman login
        return <Navigate to="/login" replace />;
    }

    //masuk ke semua halaman 
    return children;
};

export default PrivateRoute;