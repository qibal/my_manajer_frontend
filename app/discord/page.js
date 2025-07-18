"use client"

import { useState, useEffect } from "react"

import {
  Maximize2,
  Minimize2,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Shadcn/avatar"
import { Button } from "@/components/Shadcn/button"
import { ScrollArea } from "@/components/Shadcn/scroll-area"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/Shadcn/resizable"
import { TooltipProvider } from "@/components/Shadcn/tooltip"
import ChatChannel from "@/components/organisms/Discord/ChatChannel"
import VoiceChannel from "@/components/organisms/Discord/VoiceChannel"
import DrawChannel from "@/components/organisms/Discord/DrawChannel"
import DocumentChannel from "@/components/organisms/Discord/DocumentChannel"
import DatabaseChannel from "@/components/organisms/Discord/DatabaseChannel"
import ReportChannel from "@/components/organisms/Discord/ReportChannel"
import BusinessServers from "@/components/organisms/Discord/BusinessServers"
import MobileBusinessServers from "@/components/organisms/Discord/mobile/MobileSidebarView"
import MobileChannelView from "@/components/organisms/Discord/mobile/MobileChannelView"
import ChannelSidebar from "@/components/organisms/Discord/desktop/ChannelSidebar"
import MainContent from "@/components/organisms/Discord/desktop/MainContent"
import channelData from "@/discord_data_dummy/channels.json";
import { onlineUsers, getStatusColor } from "@/discord_data_dummy/discordData";
import businessService from "@/service/business_service";

const renderChannelContent = (channel) => {
  if (!channel) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-muted-foreground">
        <p>No channel selected or channel data not available.</p>
      </div>
    );
  }
  switch (channel?.type) {
    case "text":
    case "messages":
      return <ChatChannel channel={channel} />
    case "voice":
      return <VoiceChannel channel={channel} />
    case "draw":
    case "drawings":
      return <DrawChannel channel={channel} />
    case "document":
    case "documents":
      return <DocumentChannel channel={channel} />
    case "database":
    case "databases":
      return <DatabaseChannel channel={channel} />
    case "report":
    case "reports":
      return <ReportChannel channel={channel} />
    default:
      return <ChatChannel channel={channel} />
  }
}

export default function DiscordDashboard() {
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [rightSidebarSize, setRightSidebarSize] = useState(20)
  const [isRightSidebarMaximized, setIsRightSidebarMaximized] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showChannelView, setShowChannelView] = useState(false)
  const [businessList, setBusinessList] = useState([]);

  const currentChannels = channelData.filter(channel => channel.businessId === selectedBusiness);
  const currentChannel = currentChannels.find((c) => c._id === selectedChannel)

    const groupedChannels = currentChannels.reduce((acc, channel) => {
        const category = channel.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(channel);
        return acc;
    }, {});

  const toggleRightSidebar = () => {
    if (isRightSidebarMaximized) {
      setRightSidebarSize(20)
      setIsRightSidebarMaximized(false)
    } else {
      setRightSidebarSize(35)
      setIsRightSidebarMaximized(true)
    }
  }

  const handleChannelClick = (channelId) => {
    setSelectedChannel(channelId)
    if (window.innerWidth < 768) {
      setShowChannelView(true)
    }
  }

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // Ambil data bisnis dari backend
    businessService.getAll().then((res) => {
      if (res && res.data && res.data.length > 0) {
        setBusinessList(res.data);
        setSelectedBusiness(res.data[0]._id);
        // Otomatis pilih channel pertama dari bisnis pertama, untuk sementara set ke null untuk isolasi masalah
        // const firstChannel = channelData.find(channel => channel.businessId === res.data[0]._id);
        setSelectedChannel(null); // Atau bisa set ke ID channel dummy jika diperlukan untuk rendering
      }
    });
  }, []);

  // Mobile Channel View
  if (isMobile && showChannelView) {
    return (
           <MobileChannelView 
                selectedBusiness={selectedBusiness}
                selectedChannel={selectedChannel}
                currentChannel={currentChannel}
                setShowChannelView={setShowChannelView}
                renderChannelContent={renderChannelContent}
            />
    )
  }

  // Mobile Sidebar View
  if (isMobile) {
    return (
           <MobileBusinessServers 
                selectedBusiness={selectedBusiness}
                setSelectedBusiness={setSelectedBusiness}
                selectedChannel={selectedChannel}
                setSelectedChannel={setSelectedChannel}
                groupedChannels={groupedChannels}
           />
    )
  }

  // Desktop View
  return (
    <TooltipProvider>
            <div className="flex h-screen bg-background overflow-hidden">
        {/* Left Sidebar - Business Servers */}
                <BusinessServers 
                    businessData={businessList}
                    selectedBusiness={selectedBusiness}
                    setSelectedBusiness={setSelectedBusiness}
                    setSelectedChannel={setSelectedChannel}
                    onBusinessAdded={(newBusiness) => setBusinessList((prevList) => [...prevList, newBusiness])}
                />

        {/* Main Content Area */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
                    <ChannelSidebar 
                        selectedBusiness={selectedBusiness}
                        selectedChannel={selectedChannel}
                        setSelectedChannel={setSelectedChannel}
                        groupedChannels={groupedChannels}
                    />

          <ResizableHandle />

          {/* Main Content */}
                    <MainContent 
                        currentChannel={currentChannel}
                        renderChannelContent={renderChannelContent}
                    />

          <ResizableHandle />

          {/* Right Sidebar - Online Users */}
          <ResizablePanel
            defaultSize={rightSidebarSize}
            minSize={15}
            maxSize={40}
            onResize={(size) => setRightSidebarSize(size)}
          >
            <div className="h-full bg-muted/20 flex flex-col">
              {/* Header */}
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

              {/* Users List */}
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
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
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
      </div>
    </TooltipProvider>
  )
}
