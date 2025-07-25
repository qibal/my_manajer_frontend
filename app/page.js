'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import LoginForm from '@/components/organisms/LoginForm'; // Import LoginForm
import authService from '@/service/auth_service'; // Import authService

export default function RootPage() {
    const { user, isAuthenticated, loading, setUser } = useAuth(); // Ambil isAuthenticated dan setUser
    const router = useRouter();

    // useEffect harus dipanggil di level teratas, sebelum kondisi apapun
    useEffect(() => {
        // Jangan lakukan redirect jika masih loading atau jika user tidak terautentikasi (karena akan render LoginForm)
        if (loading || !isAuthenticated) return;

        if (isAuthenticated) {
            // Jika user memiliki businessIds, redirect ke business pertama, jika tidak redirect ke '/me'
            router.push(user.businessIds?.length > 0 ? `/${user.businessIds[0]}` : '/me');
        }
    }, [user, isAuthenticated, loading, router]); // Tambahkan isAuthenticated ke dependency array

    const handleLogin = async (emailOrUsername, password) => {
        try {
            const response = await authService.login(emailOrUsername, password);
            console.log("🚀 ~ handleLogin ~ response:", response)
            // Simpan token JWT ke localStorage
            localStorage.setItem('jwt_token', response.data.token); // Perbaikan: Ambil token dari response.data.token
            // Update state user di context dengan data user dari response
            setUser(response.data); // Perbaikan: Panggil setUser dengan response.data
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: error.message || "Login failed" };
        }
    };

    // Jika loading, tampilkan indikator loading
    if (loading) {
        return (
            <div className="flex min-h-svh w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Memuat...</p>
            </div>
        );
    }

    // Jika user tidak terautentikasi, tampilkan LoginForm
    if (!isAuthenticated) {
        return (
            <div className="flex min-h-svh w-full items-center justify-center bg-background">
                <LoginForm onLogin={handleLogin} />
            </div>
        );
    }

    // Ini hanya akan tercapai jika user terautentikasi dan redirect tidak segera terjadi (jarang)
    // Tampilkan loading indicator sementara proses redirect berlangsung
    return (
        <div className="flex min-h-svh w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="ml-2 text-muted-foreground">Memuat...</p>
        </div>
    );
}
