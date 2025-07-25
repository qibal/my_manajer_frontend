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
                    console.log('Decoded Token:', decodedToken);
                    // Periksa apakah token sudah expired
                    if (decodedToken.exp * 1000 < Date.now()) {
                        console.warn('JWT token has expired. Removing token.');
                        localStorage.removeItem('jwt_token');
                        setUser(null);
                        setLoading(false);
                        return; // Penting: hentikan eksekusi lebih lanjut
                    }

                    const userId = decodedToken.user_id;

                    const userData = await userService.getUserById(userId);
                    if (userData) {
                        setUser({ ...userData }); // Hanya menyimpan data user, tanpa isAuthenticated
                        console.log('User data loaded from token and API:', userData);
                    } else {
                        console.warn('User data not found for ID from token. Removing JWT token.');
                        localStorage.removeItem('jwt_token'); // Hapus dari localStorage
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Error decoding token or fetching user data, removing JWT token:', error);
                    localStorage.removeItem('jwt_token'); // Hapus dari localStorage
                    setUser(null);
                }
            } else {
                console.log('No JWT token found in localStorage.');
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

    // Fungsi untuk memperbarui state user, bukan lagi 'isAuthenticated' secara eksplisit
    const setUserData = (userData) => {
        setUser({ ...userData });
    };

    // isAutenticated sekarang menjadi nilai yang di-derive
    const isAuthenticated = !!user; // true jika user bukan null, false jika null

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, logout, setUser: setUserData }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
