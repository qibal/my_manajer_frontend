// app/[business_server]/page.js
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from 'next/navigation'
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
import MobileBusinessServers from "@/components/organisms/Discord/mobile/MobileSidebarView"
// MobileChannelView is now only used within this file for mobile view, not a separate page
import MobileChannelView from "@/components/organisms/Discord/mobile/MobileChannelView"
import { onlineUsers, getStatusColor } from "@/discord_data_dummy/discordData";
import channelService from "@/service/channel_service";
import ChatChannel from "@/components/organisms/Discord/ChatChannel"
import VoiceChannel from "@/components/organisms/Discord/VoiceChannel"
import DrawChannel from "@/components/organisms/Discord/DrawChannel"
import DocumentChannel from "@/components/organisms/Discord/DocumentChannel"
import DatabaseChannel from "@/components/organisms/Discord/DatabaseChannel"
import ReportChannel from "@/components/organisms/Discord/ReportChannel"


const renderChannelContent = (channel) => {
  if (!channel) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-muted-foreground">
        <p>No channel selected or channel data not available.</p>
      </div>
    );
  }
  switch (channel?.type) {
    case "messages":
      return <ChatChannel channel={channel} />
    case "voices":
      return <VoiceChannel channel={channel} />
    case "drawings":
      return <DrawChannel channel={channel} />
    case "documents":
      return <DocumentChannel channel={channel} />
    case "databases":
      return <DatabaseChannel channel={channel} />
    case "reports":
      return <ReportChannel channel={channel} />
    default:
      return <ChatChannel channel={channel} />
  }
}

export default function BusinessServerPage({ selectedBusiness, businessList, channels: initialChannels }) {
  const params = useParams();
  const router = useRouter();
  // Now also destructure chanels_id from params
  const { business_server: selectedBusinessId, chanels_id: selectedChannelIdFromUrl } = params; 

  console.log("BusinessServerPage: businessList prop received", businessList);

  const [channels, setChannels] = useState(initialChannels || []);
  const [refreshChannelsTrigger, setRefreshChannelsTrigger] = useState(0);
  const [rightSidebarSize, setRightSidebarSize] = useState(20)
  const [isRightSidebarMaximized, setIsRightSidebarMaximized] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (selectedBusinessId === 'me') {
      router.push('/me');
      return;
    }

    if (selectedBusinessId) {
      channelService.getByBusinessId(selectedBusinessId).then((res) => {
        if (res && res.data) {
          setChannels(res.data);
          // If channels exist for this business and no channelId is in URL, redirect to first channel
          if (res.data.length > 0 && !selectedChannelIdFromUrl) {
            router.replace(`/${selectedBusinessId}/${res.data[0].id}`);
          } else if (selectedChannelIdFromUrl && !res.data.some(c => c.id === selectedChannelIdFromUrl)) {
            // If channelId in URL is invalid for this business, redirect to first channel
            router.replace(`/${selectedBusinessId}/${res.data[0].id}`);
          }
        } else {
          setChannels([]);
        }
      }).catch(error => {
        console.error("Error fetching channels:", error);
        setChannels([]);
      });
    }
  }, [selectedBusinessId, selectedChannelIdFromUrl, router, refreshChannelsTrigger]); // Added refreshChannelsTrigger

  // Logic to group channels by category
  const currentChannels = channels.filter(channel => channel.businessId === selectedBusinessId);
  const currentChannel = currentChannels.find((c) => c.id === selectedChannelIdFromUrl); // Get current channel from URL

  const groupedChannels = currentChannels.reduce((acc, channel) => {
    const category = channel.categoryId || '__NO_CATEGORY__';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(channel);
    return acc;
  }, {});

  const orderedGroupedChannels = {};
  if (groupedChannels['__NO_CATEGORY__']) {
    orderedGroupedChannels['__NO_CATEGORY__'] = groupedChannels['__NO_CATEGORY__'];
    delete groupedChannels['__NO_CATEGORY__'];
  }
  Object.keys(groupedChannels).sort().forEach(key => {
    orderedGroupedChannels[key] = groupedChannels[key];
  });

  const toggleRightSidebar = () => {
    if (isRightSidebarMaximized) {
      setRightSidebarSize(20)
      setIsRightSidebarMaximized(false)
    } else {
      setRightSidebarSize(35)
      setIsRightSidebarMaximized(true)
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

  // Mobile View
  if (isMobile) {
    // If a channel is selected, show MobileChannelView
    if (selectedChannelIdFromUrl) {
        return (
            <MobileChannelView 
                selectedBusiness={selectedBusinessId}
                selectedChannel={selectedChannelIdFromUrl}
                currentChannel={currentChannel}
                setShowChannelView={() => router.push(`/${selectedBusinessId}`)} // Navigate back to business page
                renderChannelContent={renderChannelContent}
            />
        );
    } else {
        // Otherwise, show MobileBusinessServers (sidebar view)
        return (
            <MobileBusinessServers 
                selectedBusiness={selectedBusinessId}
                setSelectedBusiness={() => {}} // Handled by layout for routing
                selectedChannel={selectedChannelIdFromUrl} // Pass from URL
                setSelectedChannel={() => {}} // Not used to set local state anymore
                groupedChannels={orderedGroupedChannels}
                businessData={businessList} 
                channels={channels}
            />
        );
    }
  }

  // Desktop View
  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1">
      <ChannelSidebar
        selectedBusiness={selectedBusinessId}
        selectedChannel={selectedChannelIdFromUrl} // Pass from URL
        setSelectedChannel={() => {}} // Not used to set local state anymore
        groupedChannels={orderedGroupedChannels}
        channels={channels}
        businessList={businessList}
        onChannelOrCategoryCreated={() => setRefreshChannelsTrigger(prev => prev + 1)}
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
  )
}