"use client"

import { useState, useEffect } from "react"
import {
    ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/Shadcn/button"
import { getChannelIcon } from "@/lib/utils";
import ChatChannel from "@/components/organisms/Discord/ChatChannel"
import VoiceChannel from "@/components/organisms/Discord/VoiceChannel"
import DrawChannel from "@/components/organisms/Discord/DrawChannel"
import DocumentChannel from "@/components/organisms/Discord/DocumentChannel"
import DatabaseChannel from "@/components/organisms/Discord/DatabaseChannel"
import ReportChannel from "@/components/organisms/Discord/ReportChannel"
import UserProfileCard from "@/components/organisms/Discord/userProfileCard"
import BusinessServers from "@/components/organisms/Discord/BusinessServers"
import MobileSidebarView from "@/components/organisms/Discord/mobile/MobileSidebarView"


export default function MobileChannelView({ selectedBusiness, selectedChannel, currentChannel, setShowChannelView, renderChannelContent, channels, groupedChannels, businessList, showChannelView }) {
    if (!currentChannel && showChannelView) {
        return (
            <div className="flex flex-col h-full items-center justify-center text-muted-foreground">
                <p>No channel selected for this business or channel data not available.</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background">
            {!showChannelView ? (
                <MobileSidebarView
                    selectedBusiness={selectedBusiness}
                    selectedChannel={selectedChannel}
                    groupedChannels={groupedChannels}
                    channels={channels}
                    businessData={businessList}
                    setShowChannelView={setShowChannelView}
                />
            ) : (
                <div className="flex flex-col flex-1">
                    {/* Mobile Header */}
                    <div className="h-12 border-b bg-background/95 backdrop-blur flex items-center px-4">
                        <Button variant="ghost" size="icon" className="w-8 h-8 mr-2" onClick={() => setShowChannelView(false)}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center space-x-2">
                            {currentChannel && (
                                <>
                                    {(() => {
                                        const IconComponent = getChannelIcon(currentChannel.type)
                                        return <IconComponent className="w-5 h-5 text-muted-foreground" />
                                    })()}
                                    <h1 className="font-semibold">{currentChannel.name}</h1>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Channel Content */}
                    <div className="flex-1 overflow-hidden">{renderChannelContent(currentChannel)}</div>
                </div>
            )}
        </div>
    )
}