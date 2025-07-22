// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(true);

    // Verificar si hay un token válido al cargar la app
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('authToken');
            const storedUser = localStorage.getItem('user');
            
            if (storedToken && storedUser) {
                try {
                    // Verificar que el token siga siendo válido
                    await authAPI.getProfile();
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    // Token inválido, limpiar todo
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            
            setToken(response.token);
            setUser(response.user);
            
            // Guardar en localStorage
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            
            return { success: true, user: response.user };
        } catch (error) {
            const errorMessage = error.response?.data?.non_field_errors?.[0] 
                || error.response?.data?.detail 
                || 'Error de conexión';
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.log('Error al hacer logout en el servidor:', error);
        } finally {
            // Limpiar estado local independientemente del resultado del servidor
            setToken(null);
            setUser(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
    };

    const register = async (userData) => {
        try {
            await authAPI.register(userData);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message 
                || error.response?.data?.username?.[0]
                || error.response?.data?.password?.[0]
                || 'Error al registrar usuario';
            return { success: false, error: errorMessage };
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!token && !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};