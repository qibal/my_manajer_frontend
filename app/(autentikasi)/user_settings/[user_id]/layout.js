'use client';

import { useRouter, usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { User, LogOut, X } from 'lucide-react';
import { Button } from '@/components/Shadcn/button';
import { Separator } from '@/components/Shadcn/separator';
import { useAuth } from '@/hooks/use-auth';

const Sidebar = ({ userId }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();

    const menuItems = [
        {
            category: 'User Settings',
            items: [
                { name: 'My Profile', id: 'profile', icon: User, href: `/user_settings/${userId}/profile` },
            ],
        },
    ];

    const handleLogout = () => {
        logout(); // This will also redirect to '/' as defined in useAuth
    };

    return (
        <div className="w-[280px] bg-card p-6 pt-8 flex-shrink-0 border-r border-border">
            <h2 className="text-lg font-bold text-foreground mb-6">User Settings</h2>
            <div className="space-y-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground mb-4"
                    onClick={() => router.back()}
                >
                    <X className="mr-3 h-5 w-5" />
                    Close Settings
                </Button>
                <Separator />
                {menuItems.map((group) => (
                    <div key={group.category}>
                        <h3 className="px-2 pb-2 text-xs font-semibold uppercase text-muted-foreground">{group.category}</h3>
                        <ul className="space-y-1">
                            {group.items.map((item) => (
                                <li key={item.id}>
                                    <Link href={item.href} passHref>
                                        <Button
                                            variant="ghost"
                                            className={`w-full justify-start text-left flex items-center px-3 py-2 text-sm font-medium rounded-md 
                                            ${pathname.startsWith(item.href) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground'}`}
                                        >
                                            <item.icon className="mr-3 h-5 w-5" />
                                            {item.name}
                                        </Button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                 <Separator />
                <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default function UserSettingsLayout({ children }) {
    const params = useParams();
    const { user_id } = params;

    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar userId={user_id} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto bg-background">
                    {children}
                </main>
            </div>
        </div>
    );
} 