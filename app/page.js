'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import LoginForm from '@/components/organisms/LoginForm';

export default function RootPage() {
    const { user, isAuthenticated, loading, login } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (isAuthenticated) {
            router.push(user.businessIds?.length > 0 ? `/${user.businessIds[0]}` : '/me');
        }
    }, [user, isAuthenticated, loading, router]);

    // The login logic is now handled by the useAuth hook,
    // so we can pass the `login` function directly to the form.
    const handleLogin = async (emailOrUsername, password) => {
        const result = await login(emailOrUsername, password);
        // The form itself will handle showing the error message based on the result
        return result;
    };

    if (loading) {
        return (
            <div className="flex min-h-svh w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Memuat...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-svh w-full items-center justify-center bg-background">
                <LoginForm onLogin={handleLogin} />
            </div>
        );
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="ml-2 text-muted-foreground">Memuat...</p>
        </div>
    );
}
