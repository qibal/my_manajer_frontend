'use client';

import { useEffect } from 'react';
import { LoginForm } from "@/components/organisms/LoginForm";
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user?.isAuthenticated) {
            // Cek apakah ada businessId yang terkait
            if (user.businessIds && user.businessIds.length > 0) {
                router.push(`/discord/${user.businessIds[0]}/chanel_id`); // Ganti chanel_id dengan id chanel default
            } else {
                router.push('/dashboard');
            }
        }
    }, [user, loading, router]);

    if (loading || user?.isAuthenticated) {
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
                <LoginForm />
            </div>
        </div>
    );
}
