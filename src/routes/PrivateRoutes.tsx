import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const useAuth = () => {
    // Aquí deberías reemplazar este código con tu lógica de autenticación real
    // Por ejemplo, verificar si hay un token válido almacenado en localStorage
    const user = localStorage.getItem('token');
    return user !== null;
};

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    const isAuthenticated = useAuth(); // Aquí verificarías si el usuario está autenticado

    if (!isAuthenticated) {
        // Redirige a la página de login, pero guarda la ubicación a la que el usuario intentaba ir
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};
