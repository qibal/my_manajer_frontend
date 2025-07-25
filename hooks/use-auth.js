'use client'

import { useState, useEffect, createContext, useContext } from 'react';
// Hapus import Cookies
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import userService from '@/service/user_service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadUserFromToken = async () => {
            const token = localStorage.getItem('jwt_token'); // Mengambil dari localStorage
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const userId = decodedToken.user_id;

                    const userData = await userService.getUserById(userId);
                    if (userData) {
                        setUser({ isAuthenticated: true, ...userData });
                        console.log('User data loaded from token and API:', userData);
                    } else {
                        console.log('User data not found for ID from token. Logging out.');
                        localStorage.removeItem('jwt_token'); // Hapus dari localStorage
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Error decoding token or fetching user data:', error);
                    localStorage.removeItem('jwt_token'); // Hapus dari localStorage
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        loadUserFromToken();
    }, []);

    const logout = () => {
        localStorage.removeItem('jwt_token'); // Hapus dari localStorage
        setUser(null);
        router.push('/login');
    };

    const updateAuthState = (userData) => {
        setUser({ isAuthenticated: true, ...userData });
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, setUser: updateAuthState }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
