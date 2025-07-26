'use client';

import { useRouter, usePathname, useParams } from 'next/navigation';
import { Shield, Users, VenetianMask, Bot, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/Shadcn/button';
import { Separator } from '@/components/Shadcn/separator';

const menuItems = [
  {
    category: "Pinwin Studio",
    items: [
      { name: "Business Profile", id: "profile", icon: Shield, href: '' },
      { name: "Channels", id: "channels", icon: VenetianMask, href: '/chanels' },
    ]
  },
  {
    category: "People",
    items: [
      { name: "Members", id: "members", icon: Users, href: '/members' },
      { name: "Roles", id: "roles", icon: Bot, href: '/roles' },
    ]
  },
];

const Sidebar = ({ businessId }) => {
  const pathname = usePathname();
  const router = useRouter();
  const baseHref = `/business_settings/${businessId}`;

  return (
    <div className="w-[280px] bg-card p-6 pt-14 flex-shrink-0 border-r border-border">
      <div className="space-y-4">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground mb-4" onClick={() => router.push(`/${businessId}`)}>
            <X className="mr-3 h-5 w-5" />
            Close Settings
        </Button>
        <Separator />
        {menuItems.map(group => (
          <div key={group.category}>
            <h3 className="px-2 pb-2 text-xs font-bold uppercase text-muted-foreground">{group.category}</h3>
            <ul className="space-y-1">
              {group.items.map(item => {
                const fullPath = `${baseHref}${item.href}`;
                const isActive = item.href === '' ? pathname === fullPath : pathname.startsWith(fullPath);
                
                return (
                  <li key={item.id}>
                    <Link href={fullPath} passHref>
                      <button
                        className={`w-full text-left flex items-center px-2 py-1.5 text-sm font-medium rounded-md ${
                          isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground'
                        }`}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function BusinessSettingsLayout({ children }) {
    const params = useParams();
    const { bussiness_id } = params;

    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar businessId={bussiness_id} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
