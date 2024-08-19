import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const useAuth = () => {
    const user = sessionStorage.getItem('token');
    return user !== null;
};

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    const isAuthenticated = useAuth(); // Aquí se verifica si el usuario está autenticado

    if (!isAuthenticated) {
        // Redirige a la página de login, pero guarda la ubicación a la que el usuario intentaba ir
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

// Ruta pública
export const PublicRoute = ({ children }: { children: ReactNode }) => {
    const isAuthenticated = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return children;
};