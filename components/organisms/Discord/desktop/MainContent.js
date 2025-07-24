"use client"

import { useState, useEffect } from "react"

import {
    Pin,
    Users,
    MoreVertical,
    RefreshCw,
} from "lucide-react"

import { Button } from "@/components/Shadcn/button"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/Shadcn/resizable"
import { getChannelIcon } from "@/discord_data_dummy/discordData";
import ChatChannel from "@/components/organisms/Discord/ChatChannel"
import VoiceChannel from "@/components/organisms/Discord/VoiceChannel"
import DrawChannel from "@/components/organisms/Discord/DrawChannel"
import DocumentChannel from "@/components/organisms/Discord/DocumentChannel"
import DatabaseChannel from "@/components/organisms/Discord/DatabaseChannel"
import ReportChannel from "@/components/organisms/Discord/ReportChannel"

export default function MainContent({ currentChannel, renderChannelContent, syncStatus, lastSyncedTime, onSyncStatusChange, onTriggerSync }) {
    if (!currentChannel) {
        return (
            <ResizablePanel defaultSize={60}>
                <div className="flex flex-col h-full items-center justify-center text-muted-foreground">
                    <p>No channel selected for this business or channel data not available.</p>
                </div>
            </ResizablePanel>
        );
    }

    return (
        <ResizablePanel defaultSize={60}>
                        <div className="h-full flex flex-col">
                            {/* Top Bar */}
                            <div className="h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-4">
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
                                <div className="ml-auto flex items-center space-x-2">
                                    {syncStatus === 'syncing' && (
                                        <span className="text-xs text-muted-foreground">Syncing...</span>
                                    )}
                                    {syncStatus === 'synced' && lastSyncedTime && (
                                        <span className="text-xs text-muted-foreground">Last synced: {lastSyncedTime.toLocaleTimeString()}</span>
                                    )}
                                    <Button variant="ghost" size="icon" className="w-8 h-8">
                                        <Pin className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={onTriggerSync}>
                                        <RefreshCw className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="w-8 h-8">
                                        <Users className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="w-8 h-8">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Channel Content */}
                            <div className="flex-1 overflow-hidden">{renderChannelContent(currentChannel)}</div>
                        </div>
                    </ResizablePanel>
    )
}