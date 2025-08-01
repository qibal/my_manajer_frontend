'use client'

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import userService from '@/service/user_service';
import authService from '@/service/auth_service'; // Import authService

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null); // State untuk token
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Efek untuk memuat token awal dari localStorage saat komponen pertama kali dirender
    useEffect(() => {
        const initialToken = localStorage.getItem('jwt_token');
        if (initialToken) {
            setToken(initialToken);
        } else {
            setLoading(false); // Selesaikan loading jika tidak ada token
        }
    }, []);

    // Definisikan fungsi loadUser agar bisa dipanggil ulang
    const loadUserFromToken = async (currentToken) => {
        if (!currentToken) {
            setUser(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const decodedToken = jwtDecode(currentToken);
            if (decodedToken.exp * 1000 < Date.now()) {
                console.warn('JWT token has expired.');
                logout();
                return;
            }

            const userData = await userService.getUserById(decodedToken.user_id);
            if (userData) {
                setUser({ ...userData });
            } else {
                console.warn('User data not found for ID from token.');
                logout();
            }
        } catch (error) {
            console.error('Failed to decode token or fetch user.', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    // Efek untuk memuat data pengguna setiap kali token berubah
    useEffect(() => {
        loadUserFromToken(token);
    }, [token]);

    const refetchUser = () => {
        if (token) {
            loadUserFromToken(token);
        }
    };

    const login = async (emailOrUsername, password) => {
        try {
            // authService.login now returns the full response data
            const response = await authService.login(emailOrUsername, password);
            const newToken = response.data.token;
            localStorage.setItem('jwt_token', newToken);
            setToken(newToken);
            return { success: true };
        } catch (error) {
            console.error("Login failed in auth hook:", error);
            // error is already a string message from the service
            return { success: false, message: error };
        }
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        setToken(null);
        setUser(null);
        router.push('/');
    };
    
    const isAuthenticated = !!user;
    const isSuperAdmin = !!user?.roles?.system?.includes('super_admin');

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isSuperAdmin, loading, login, logout, refetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
