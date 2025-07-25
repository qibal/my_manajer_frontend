'use client'

import { useState, useEffect, createContext, useContext } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode
import userService from '@/service/user_service'; // Import userService

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadUserFromCookies = async () => {
            const token = Cookies.get('jwt_token');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const userId = decodedToken.user_id; // Pastikan ini sesuai dengan key di token Anda

                    const userData = await userService.getUserById(userId);
                    if (userData) {
                        setUser({ isAuthenticated: true, ...userData });
                        console.log('User data loaded from cookies and API:', userData);
                    } else {
                        console.log('User data not found for ID from token. Logging out.');
                        Cookies.remove('jwt_token');
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Error decoding token or fetching user data:', error);
                    Cookies.remove('jwt_token');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        loadUserFromCookies();
    }, []);

    const logout = () => {
        Cookies.remove('jwt_token', { path: '/' }); // Tambahkan path: '/'
        setUser(null);
        router.push('/login');
    };

    // Fungsi untuk memperbarui status pengguna secara manual setelah login di page.js
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
