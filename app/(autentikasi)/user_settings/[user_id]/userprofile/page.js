'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import userService from '@/service/user_service';
import { Button } from '@/components/Shadcn/button';
import { Input } from '@/components/Shadcn/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Shadcn/avatar';
import { toast } from 'sonner';

export default function UserProfilePage() {
    const { user, loading, refetchUser } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleUpdateProfile = async () => {
        if (!user) return;

        const updateData = {};
        if (username !== user.username) updateData.username = username;
        if (email !== user.email) updateData.email = email;

        if (Object.keys(updateData).length === 0) {
            toast.info("No changes to update.");
            return;
        }

        const promise = userService.updateUser(user.id, updateData);

        toast.promise(promise, {
            loading: 'Updating profile...',
            success: (updatedUser) => {
                refetchUser(); // Memuat ulang data pengguna dari context
                return 'Profile updated successfully!';
            },
            error: (err) => `Error: ${err.message || 'Failed to update profile.'}`,
        });
    };

    if (loading || !user) {
        return <div className="p-8">Loading profile...</div>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your personal information.</p>
            
            <div className="mt-8 space-y-8">
                <div>
                    <h3 className="text-xs font-bold uppercase text-muted-foreground">Avatar</h3>
                    <p className="text-xs text-muted-foreground mt-1">We recommend an image of at least 256x256.</p>
                    <div className="mt-3 flex items-center gap-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user.avatar || ''} />
                            <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Button>Change Avatar</Button>
                        <Button variant="ghost" className="text-destructive hover:text-destructive-foreground">Remove</Button>
                    </div>
                </div>

                <div>
                    <label htmlFor="username" className="text-xs font-bold uppercase text-muted-foreground">Username</label>
                    <Input 
                        id="username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-2"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="text-xs font-bold uppercase text-muted-foreground">Email</label>
                    <Input 
                        id="email" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2"
                    />
                </div>
                
                <div className="pt-4">
                    <Button onClick={handleUpdateProfile}>Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
