'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, FileText, X } from 'lucide-react';

import { Button } from '@/components/Shadcn/button';
import { Separator } from '@/components/Shadcn/separator';

const menuItems = [
  {
    category: "Manajemen Umum",
    items: [
      { name: "Dashboard", id: "dashboard", icon: LayoutDashboard, href: '/app_management/dashboard' },
      { name: "Log Activities", id: "log-activities", icon: FileText, href: '/app_management/activity_logs' },
    ]
  },
  {
    category: "Manajemen Pengguna",
    items: [
      { name: "Daftar Pengguna", id: "user-management", icon: Users, href: '/app_management/user_management' },
    ]
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-[280px] bg-card p-6 pt-8 flex-shrink-0 border-r border-border">
      <h2 className="text-lg font-bold text-foreground mb-6">Manajemen Aplikasi</h2>
      <div className="space-y-4">
        <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground mb-4"
            onClick={() => router.back()} // Kembali ke halaman sebelumnya
        >
            <X className="mr-3 h-5 w-5" />
            Close Management
        </Button>
        <Separator />
        {menuItems.map(group => (
          <div key={group.category}>
            <h3 className="px-2 pb-2 text-xs font-semibold uppercase text-muted-foreground">{group.category}</h3>
            <ul className="space-y-1">
              {group.items.map(item => (
                <li key={item.id}>
                  <Link href={item.href} passHref>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left flex items-center px-3 py-2 text-sm font-medium rounded-md 
                        ${pathname.startsWith(item.href) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground'}
                      `}
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
      </div>
    </div>
  );
};


export default function AppManagementLayout({ children }) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
