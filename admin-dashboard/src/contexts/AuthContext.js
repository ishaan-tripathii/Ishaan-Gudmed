
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api/apiService';
import { ENDPOINTS } from '../config/api.config';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await apiService.get(ENDPOINTS.AUTH.USER);
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiService.post(ENDPOINTS.AUTH.LOGIN, { email, password });
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                setUser(response.data.user);
                navigate('/admin'); // Updated route
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError(error.response?.data?.message || 'Login failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await apiService.post(ENDPOINTS.AUTH.LOGOUT);
            setUser(null);
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};