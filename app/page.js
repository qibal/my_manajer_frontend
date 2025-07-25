'use client';

import { useEffect, useState } from 'react';
import { LoginForm } from "@/components/organisms/LoginForm";
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import authService from '@/service/auth_service';
// Hapus import Cookies

export default function Home() {
    const { user, loading, setUser } = useAuth();
    const router = useRouter();
    const [showNoBusinessMessage, setShowNoBusinessMessage] = useState(false);

    const handleLogin = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            console.log('Login API Response:', response);

            if (response.success && response.data?.token) {
                localStorage.setItem('jwt_token', response.data.token); // Simpan ke localStorage
                // Memperbarui setUser untuk menyimpan seluruh data pengguna yang diterima dari backend
                setUser({ isAuthenticated: true, ...response.data });
                console.log('Token saved to localStorage and user state updated.', response.data);

                if (response.data.businessIds && response.data.businessIds.length > 0) {
                    const firstBusinessId = response.data.businessIds[0];
                    console.log(`Redirecting to business: ${firstBusinessId}`);
                    // Redirect ke halaman bisnis, page di sana akan menangani redirect ke channel pertama
                    router.push(`/${firstBusinessId}`);
                } else {
                    console.log('User has no associated businesses. Redirecting to @me.');
                    // Untuk super_admin atau user tanpa bisnis, redirect ke halaman utama generik
                    router.push('/@me');
                }
                return { success: true };
            } else {
                console.log('Login failed:', response.message);
                setShowNoBusinessMessage(false); // Sembunyikan pesan jika login gagal
                return { success: false, message: response.message || 'Login failed' };
            }
        } catch (err) {
            console.error('Login error:', err);
            setShowNoBusinessMessage(false); // Sembunyikan pesan jika terjadi error
            return { success: false, message: err.response?.data?.message || 'Terjadi kesalahan saat login.' };
        }
    };

    useEffect(() => {
        if (!loading && user?.isAuthenticated) {
            // Cek apakah user memiliki businessIds yang sudah dimuat
            if (user.businessIds && user.businessIds.length > 0) {
                const firstBusinessId = user.businessIds[0];
                console.log(`User already authenticated. Redirecting to business: ${firstBusinessId}`);
                router.push(`/${firstBusinessId}`);
            } else if (user.businessIds && user.businessIds.length === 0) {
                console.log('User already authenticated but has no associated businesses. Redirecting to @me.');
                router.push('/@me');
            }
            // Hapus else block karena logic sudah tercakup, dan untuk menghindari loop redirect yang tidak perlu
        }
    }, [user, loading, router]);

    if (loading || (!loading && user?.isAuthenticated)) { // Tampilkan loading jika sedang memuat ATAU jika sudah diautentikasi (karena akan redirect)
        return (
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <p className="ml-2 text-gray-600">Memuat...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                {showNoBusinessMessage ? (
                    <div className="text-center p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md" role="alert">
                        <p className="font-bold">Informasi</p>
                        <p>Anda belum terdaftar atau memiliki akses ke bisnis manapun. Silakan hubungi administrator Anda untuk mendapatkan akses.</p>
                    </div>
                ) : (
                    <LoginForm onLogin={handleLogin} />
                )}
            </div>
        </div>
    );
}
