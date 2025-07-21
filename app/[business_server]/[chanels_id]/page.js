"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from 'next/navigation'
import MainContent from "@/components/organisms/Discord/desktop/MainContent"
import MobileChannelView from "@/components/organisms/Discord/mobile/MobileChannelView"
import ChannelSidebar from "@/components/organisms/Discord/desktop/ChannelSidebar"
import businessService from "@/service/business_service";
import channelService from "@/service/channel_service"
import ChatChannel from "@/components/organisms/Discord/ChatChannel"
import VoiceChannel from "@/components/organisms/Discord/VoiceChannel"
import DrawChannel from "@/components/organisms/Discord/DrawChannel"
import DocumentChannel from "@/components/organisms/Discord/DocumentChannel"
import DatabaseChannel from "@/components/organisms/Discord/DatabaseChannel"
import ReportChannel from "@/components/organisms/Discord/ReportChannel"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/Shadcn/resizable"

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

export default function ChannelPage() {
    const router = useRouter();
    const params = useParams();
    const { business_server: selectedBusinessId, chanels_id: selectedChannelId } = params;

    const [currentChannel, setCurrentChannel] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [channels, setChannels] = useState([]);
    const [groupedChannels, setGroupedChannels] = useState({});
    const [businessList, setBusinessList] = useState([]);
    const [showChannelView, setShowChannelView] = useState(false);

    useEffect(() => {
        if (selectedBusinessId) {
            // Fetch channels
            channelService.getByBusinessId(selectedBusinessId).then((res) => {
                if (res && res.data) {
                    const foundChannel = res.data.find(c => c.id === selectedChannelId);
                    setCurrentChannel(foundChannel);
                    setChannels(res.data);

                    // Group channels by category
                    const grouped = res.data.reduce((acc, channel) => {
                        const category = channel.category || "Uncategorized";
                        if (!acc[category]) {
                            acc[category] = [];
                        }
                        acc[category].push(channel);
                        return acc;
                    }, {});
                    setGroupedChannels(grouped);
                } else {
                    setCurrentChannel(null);
                    setChannels([]);
                    setGroupedChannels({});
                }
            }).catch(error => {
                console.error("Error fetching channels:", error);
                setCurrentChannel(null);
                setChannels([]);
                setGroupedChannels({});
            });

            // Fetch business list
            businessService.getAll().then((res) => {
                if (res && res.data) {
                    setBusinessList(res.data);
                } else {
                    setBusinessList([]);
                }
            }).catch(error => {
                console.error("Error fetching business list:", error);
                setBusinessList([]);
            });
        }
    }, [selectedBusinessId, selectedChannelId]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);


    // Mobile Channel View
    if (isMobile) {
        return (
               <MobileChannelView
                    selectedBusiness={selectedBusinessId}
                    selectedChannel={selectedChannelId}
                    currentChannel={currentChannel}
                    setShowChannelView={setShowChannelView}
                    renderChannelContent={renderChannelContent}
                    channels={channels}
                    groupedChannels={groupedChannels}
                    businessList={businessList}
                    showChannelView={showChannelView}
                />
        )
    }

    return (
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ChannelSidebar
            selectedBusiness={selectedBusinessId}
            selectedChannel={selectedChannelId}
            setSelectedChannel={() => {}}
            groupedChannels={groupedChannels}
            channels={channels}
            businessList={businessList}
            onChannelOrCategoryCreated={() => {}} // Not implemented yet
        />
        <ResizableHandle />
            <MainContent
                currentChannel={currentChannel}
                renderChannelContent={renderChannelContent}
            />
        </ResizablePanelGroup>
    );
}
