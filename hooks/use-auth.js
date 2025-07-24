import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import authService from '@/service/auth_service';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('jwt_token');
        if (token) {
            // Anda bisa menambahkan logika validasi token di sini
            // Untuk saat ini, kita hanya mengasumsikan token valid jika ada
            // Dan mengambil data user dari token atau dari API jika diperlukan
            setUser({ isAuthenticated: true }); // Placeholder, Anda bisa mendekode token untuk data user
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await authService.login(email, password);
            if (response.status_code === 200 && response.data?.token) {
                Cookies.set('jwt_token', response.data.token, { expires: 7 }); // Simpan token 7 hari
                setUser({ isAuthenticated: true, businessIds: response.data.businessIds });

                if (response.data.businessIds && response.data.businessIds.length > 0) {
                    // Redirect ke halaman business server dengan businessId pertama
                    router.push(`/${response.data.businessIds[0]}/chanel_id`); // Ganti chanel_id dengan id chanel default
                } else {
                    // Jika tidak ada businessId, redirect ke dashboard
                    router.push('/dashboard');
                }
                return { success: true };
            } else {
                return { success: false, message: response.message || 'Login failed' };
            }
        } catch (err) {
            console.error('Login error:', err);
            return { success: false, message: err.response?.data?.message || 'Terjadi kesalahan saat login.' };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        Cookies.remove('jwt_token');
        setUser(null);
        router.push('/login'); // Redirect ke halaman login setelah logout
    };

    return { user, loading, login, logout };
}
