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

export default function MePage() {
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

    const renderEmptyContent = () => (
        <div className="flex flex-col h-full items-center justify-center text-muted-foreground bg-background">
            <h2 className="text-2xl font-semibold">Selamat Datang!</h2>
            <p className="mt-2 text-center">Anda belum menjadi anggota bisnis manapun.</p>
            <p className="mt-1 text-sm text-center">Silakan buat bisnis baru atau terima undangan untuk memulai.</p>
        </div>
    );

    return (
        <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ChannelSidebar
                selectedBusiness={null}
                selectedChannel={null}
                groupedChannels={{}}
                channels={[]}
                businessList={[]}
                onChannelOrCategoryCreated={() => {}}
            />
            <ResizableHandle />
            <MainContent
                currentChannel={null}
                renderChannelContent={renderEmptyContent}
            />
            <ResizableHandle />
            <ResizablePanel
                defaultSize={rightSidebarSize}
                minSize={15}
                maxSize={40}
                onResize={(size) => setRightSidebarSize(size)}
            >
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
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {onlineUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                                >
                                    <div className="relative">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                            <AvatarFallback>
                                                {user.name.split(" ").map((n) => n[0]).join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div
                                            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{user.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
} 