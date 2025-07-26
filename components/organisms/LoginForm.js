'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Shadcn/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/Shadcn/card';
import { Input } from '@/components/Shadcn/input';
import { Label } from '@/components/Shadcn/label';
import { useAuth } from '@/hooks/use-auth'; // Import useAuth hook
import { useForm } from 'react-hook-form'; // Import useForm from react-hook-form
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/Shadcn/form'; // Import Shadcn Form components

export default function LoginForm({
    className,
    onLogin, // Tambahkan onLogin ke props
    ...props
}) {
    // const [emailOrUsername, setEmailOrUsername] = useState(''); // Akan diganti dengan react-hook-form
    // const [password, setPassword] = useState(''); // Akan diganti dengan react-hook-form
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // const { login } = useAuth(); // Hapus penggunaan hook useAuth di sini

    // Inisialisasi react-hook-form
    const form = useForm({
        defaultValues: {
            emailOrUsername: "",
            password: "",
        },
    });

    const onSubmit = async (values) => {
        setIsLoading(true);
        setError(null);

        // Gunakan onLogin prop yang diteruskan dari parent
        const result = await onLogin(values.emailOrUsername, values.password);
        if (!result.success) {
            setError(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="w-[300px]">
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email or username below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="emailOrUsername"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email or Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="emailOrUsername"
                                                type="text"
                                                placeholder="m@example.com or username"
                                                required
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center">
                                            <FormLabel>Password</FormLabel>
                                            {/* <a
                                                href="#"
                                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                            >
                                                Forgot your password?
                                            </a> */}
                                        </div>
                                        <FormControl>
                                            <Input
                                                id="password"
                                                type="password"
                                                required
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
