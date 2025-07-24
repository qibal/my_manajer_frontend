'use client';

import { useState } from 'react';
import { LayoutDashboard, Users, UserPlus, FileText, Cog } from 'lucide-react';

// Import komponen Shadcn
import { Button } from '@/components/Shadcn/button';

// Dummy data untuk menu (bisa diganti dengan data dinamis jika diperlukan)
const menuItems = [
  {
    category: "Manajemen Umum",
    items: [
      { name: "Dashboard", id: "dashboard", icon: LayoutDashboard },
      { name: "Pengaturan Global", id: "global-settings", icon: Cog },
    ]
  },
  {
    category: "Manajemen Pengguna",
    items: [
      { name: "Daftar Pengguna", id: "user-list", icon: Users },
      // { name: "Buat Pengguna Baru", id: "create-user", icon: UserPlus }, // Akan di handle di UserManagementContent
    ]
  },
  // Anda bisa menambahkan kategori dan item lain di sini
  // {
  //   category: "Laporan & Statistik",
  //   items: [
  //     { name: "Laporan Aplikasi", id: "app-reports", icon: FileText },
  //   ]
  // },
];

const Sidebar = ({ activeMenu, setActiveMenu }) => (
  <div className="w-[280px] bg-gray-100 p-6 pt-8 flex-shrink-0 border-r border-gray-200">
    <h2 className="text-lg font-bold text-gray-800 mb-6">Manajemen Aplikasi</h2>
    <div className="space-y-4">
      {menuItems.map(group => (
        <div key={group.category}>
          <h3 className="px-2 pb-2 text-xs font-semibold uppercase text-gray-500">{group.category}</h3>
          <ul className="space-y-1">
            {group.items.map(item => (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full justify-start text-left flex items-center px-3 py-2 text-sm font-medium rounded-md 
                    ${activeMenu === item.id ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const PlaceholderContent = ({ title }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    <p className="text-gray-600 mt-2">Konten untuk {title.toLowerCase()} akan ditampilkan di sini.</p>
  </div>
);

// Ini adalah komponen yang akan Anda buat di langkah selanjutnya
import UserManagementContent from '@/components/organisms/AppManagement/UserManagementContent'; 

export default function AppManagementPage() {
  const [activeMenu, setActiveMenu] = useState('user-list'); // Default ke user list

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <PlaceholderContent title="Dashboard" />;
      case 'global-settings':
        return <PlaceholderContent title="Global Settings" />;
      case 'user-list':
        return <UserManagementContent />; // Akan diaktifkan nanti
        // return <PlaceholderContent title="User List (Implementasi Selanjutnya)" />;
      // case 'create-user':
      //   return <PlaceholderContent title="Create User" />;
      // case 'app-reports':
      //   return <PlaceholderContent title="App Reports" />;
      default:
        return <PlaceholderContent title="Selamat Datang di Manajemen Aplikasi" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-white">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
