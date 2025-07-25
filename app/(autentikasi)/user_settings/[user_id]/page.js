'use client';

import { useState } from 'react';
import { Button } from '@/components/Shadcn/button';
import { Input } from '@/components/Shadcn/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Shadcn/avatar';
import { X, Shield, Users, VenetianMask, FileText, Bot, BarChart2, MessageSquare, Paintbrush } from 'lucide-react';

// Import dummy data
import businessesData from '@/discord_data_dummy/businesses.json';
import usersData from '@/discord_data_dummy/users.json';
import rolesData from '@/discord_data_dummy/roles.json';
import channelsData from '@/discord_data_dummy/channels.json';

const menuItems = [
  {
    category: "Pinwin Studio",
    items: [
      { name: "Business Profile", id: "profile", icon: Shield },
      { name: "Channels", id: "channels", icon: VenetianMask },
    ]
  },
  {
    category: "People",
    items: [
      { name: "Members", id: "members", icon: Users },
      { name: "Roles", id: "roles", icon: Bot },
    ]
  },
  {
    category: "Content Management",
    items: [
        { name: "Documents", id: "documents", icon: FileText },
        { name: "Drawings", id: "drawings", icon: Paintbrush },
        { name: "Databases", id: "databases", icon: BarChart2 },
        { name: "Reports", id: "reports", icon: BarChart2 },
        { name: "Messages", id: "messages", icon: MessageSquare },
    ]
  },
];

const Sidebar = ({ activeMenu, setActiveMenu }) => (
  <div className="w-[280px] bg-[#2B2D31] p-6 pt-14 flex-shrink-0">
    <div className="space-y-4">
      {menuItems.map(group => (
        <div key={group.category}>
          <h3 className="px-2 pb-2 text-xs font-bold uppercase text-gray-400">{group.category}</h3>
          <ul className="space-y-1">
            {group.items.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full text-left flex items-center px-2 py-1.5 text-sm font-medium rounded-md ${
                    activeMenu === item.id ? 'bg-[#404249] text-white' : 'text-gray-300 hover:bg-[#36373D] hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const BusinessProfile = () => {
    const business = businessesData[0];
    const onlineUsers = usersData.filter(u => u.status === 'online').length;
    const totalUsers = usersData.length;

    return (
        <div>
            <h1 className="text-xl font-bold">Business Profile</h1>
            <p className="text-gray-400 text-sm mt-1">Customize how your business appears in invite links and elsewhere.</p>

            <div className="mt-8 flex gap-8">
                <div className="flex-grow space-y-8">
                    <div>
                        <label htmlFor="name" className="text-xs font-bold uppercase text-gray-400">Name</label>
                        <Input id="name" defaultValue={business.name} className="mt-2 bg-[#1E1F22] border-none text-white" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase text-gray-400">Icon</h3>
                        <p className="text-xs text-gray-400 mt-1">We recommend an image of at least 512x512.</p>
                        <div className="mt-3 flex items-center gap-4">
                             <Avatar className="h-20 w-20">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>PS</AvatarFallback>
                            </Avatar>
                            <Button className="bg-[#4E5058] hover:bg-[#585b63]">Change Icon</Button>
                            <Button variant="link" className="text-red-500 hover:no-underline">Remove Icon</Button>
                        </div>
                    </div>
                </div>
                <div className="w-[300px] flex-shrink-0">
                    <div className="bg-[#1E1F22] rounded-lg overflow-hidden">
                         <div className="h-24 bg-gray-500 bg-cover" style={{backgroundImage: "url('https://i.pravatar.cc/400?u=banner')"}}></div>
                        <div className="p-4">
                            <Avatar className="-mt-12 h-20 w-20 border-4 border-[#1E1F22]">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>PS</AvatarFallback>
                            </Avatar>
                            <h3 className="font-bold text-lg mt-2">{business.name}</h3>
                            <div className="flex items-center text-sm text-gray-400 mt-2">
                                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                                {onlineUsers} Online
                                <span className="h-2 w-2 bg-gray-500 rounded-full mx-2"></span>
                                {totalUsers} Members
                            </div>
                             <p className="text-xs text-gray-400 mt-2">Est. {new Date(business.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PlaceholderContent = ({ title }) => (
  <div>
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="text-gray-400 mt-2">Management interface for {title.toLowerCase()} will be displayed here.</p>
  </div>
);


export default function BusinessSettingsPage() {
  const [activeMenu, setActiveMenu] = useState('profile');

  const renderContent = () => {
    switch (activeMenu) {
      case 'profile':
        return <BusinessProfile />;
      case 'channels':
        return <PlaceholderContent title="Channels" />;
       case 'members':
        return <PlaceholderContent title="Members" />;
      case 'roles':
        return <PlaceholderContent title="Roles" />;
       case 'documents':
        return <PlaceholderContent title="Documents" />;
      case 'drawings':
        return <PlaceholderContent title="Drawings" />;
       case 'databases':
        return <PlaceholderContent title="Databases" />;
      case 'reports':
        return <PlaceholderContent title="Reports" />;
       case 'messages':
        return <PlaceholderContent title="Messages" />;
      default:
        return <BusinessProfile />;
    }
  };

  return (
    <div className="flex h-screen bg-[#313338] text-gray-200">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-8 overflow-y-auto">
            {renderContent()}
        </main>
      </div>
      <div className="p-6 pt-14">
        <button className="flex items-center justify-center w-12 h-12 border-2 border-gray-500 rounded-full text-gray-400 hover:border-gray-300">
            <X size={20} />
        </button>
        <p className="text-center text-xs font-bold text-gray-400 mt-1">ESC</p>
      </div>
    </div>
  );
}
