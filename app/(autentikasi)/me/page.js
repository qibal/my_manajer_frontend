// my_manajer/app/(autentikasi)/me/page.js
"use client"

import { useState } from "react"
import {
    Maximize2,
    Minimize2,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Shadcn/avatar"
import { Button } from "@/components/Shadcn/button"
import { ScrollArea } from "@/components/Shadcn/scroll-area"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/Shadcn/resizable"
import ChannelSidebar from "@/components/organisms/Discord/desktop/ChannelSidebar"
import MainContent from "@/components/organisms/Discord/desktop/MainContent"
import { onlineUsers, getStatusColor } from "@/discord_data_dummy/discordData";
import { useAuth } from '@/hooks/use-auth';
import { useBusinessData } from '@/hooks/use-business-data';
import BusinessServers from '@/components/organisms/Discord/BusinessServers';
import { TooltipProvider } from "@/components/Shadcn/tooltip";
import { Loader2 } from "lucide-react";

export default function MePage() {
    const { user, isSuperAdmin, loading: authLoading } = useAuth();
    const { businessList, channels, selectedBusiness, setSelectedBusiness, loading: businessLoading } = useBusinessData(null);

    const [rightSidebarSize, setRightSidebarSize] = useState(20)
    const [isRightSidebarMaximized, setIsRightSidebarMaximized] = useState(false)

    const toggleRightSidebar = () => {
        if (isRightSidebarMaximized) {
            setRightSidebarSize(20)
            setIsRightSidebarMaximized(false)
        } else {
            setRightSidebarSize(35)
            setIsRightSidebarMaximized(true)
        }
    }

    const renderWelcomeContent = (isAdmin) => (
        <div className="flex flex-col h-full items-center justify-center text-muted-foreground bg-background">
            <h2 className="text-2xl font-semibold">{isAdmin ? "Selamat Datang, Super Admin!" : "Selamat Datang!"}</h2>
            <p className="mt-2 text-center">{isAdmin ? "Anda memiliki akses penuh untuk mengelola semua bisnis." : "Anda belum menjadi anggota bisnis manapun."}</p>
            <p className="mt-1 text-sm text-center">{isAdmin ? "Silakan buat bisnis baru untuk memulai." : "Silakan buat bisnis baru atau terima undangan untuk memulai."}</p>
        </div>
    );

    // --- Loading State ---
    if (authLoading || businessLoading) {
        return (
            <div className="flex min-h-svh w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Memuat data...</p>
            </div>
        );
    }

    // --- Super Admin View ---
    // Selalu merender tata letak penuh, meskipun tidak ada bisnis.
    if (isSuperAdmin) {
        return (
            <TooltipProvider>
                <div className="flex h-screen bg-background overflow-hidden">
                    <BusinessServers
                        businessData={businessList || []}
                        selectedBusiness={selectedBusiness} // null jika tidak ada
                        setSelectedBusiness={setSelectedBusiness}
                        onBusinessAdded={(newBusiness) => setSelectedBusiness(newBusiness.id)}
                        channels={channels || []}
                    />
                    <ResizablePanelGroup direction="horizontal" className="flex-1">
                        <ChannelSidebar
                            selectedBusiness={selectedBusiness}
                            selectedChannel={null}
                            groupedChannels={{}}
                            channels={channels || []}
                            businessList={businessList || []}
                            onChannelOrCategoryCreated={() => { }}
                        />
                        <ResizableHandle />
                        <MainContent
                            currentChannel={null}
                            renderChannelContent={() => renderWelcomeContent(true)}
                        />
                         <ResizableHandle />
                        <ResizablePanel
                            defaultSize={rightSidebarSize}
                            minSize={15}
                            maxSize={40}
                            onResize={(size) => setRightSidebarSize(size)}
                        >
                            {/* Panel Pengguna Online (Contoh) */}
                            <div className="h-full bg-muted/20 flex flex-col">
                                <div className="p-4 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-sm">
                                        Online — {onlineUsers.filter((u) => u.status === "online").length}
                                    </h3>
                                    <Button variant="ghost" size="icon" className="w-6 h-6" onClick={toggleRightSidebar}>
                                        {isRightSidebarMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                    </Button>
                                </div>
                                </div>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </TooltipProvider>
        );
    }

    // --- Regular User View ---
    // Pada titik ini, user BUKAN super admin.
    // Jika mereka punya bisnis, `useBusinessData` sudah akan me-redirect mereka.
    // Jadi, jika kita sampai di sini, artinya mereka tidak punya bisnis.
    return (
        <div className="flex min-h-svh w-full items-center justify-center bg-background text-center">
            <div>
                <h2 className="text-2xl font-semibold">Selamat Datang!</h2>
                <p className="mt-2">Anda belum menjadi anggota bisnis manapun.</p>
                <p className="mt-1 text-sm text-muted-foreground">Silakan buat bisnis baru atau terima undangan untuk memulai.</p>
            </div>
        </div>
    );
} 