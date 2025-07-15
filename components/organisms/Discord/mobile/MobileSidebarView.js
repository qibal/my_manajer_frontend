"use client"

import { useState, useEffect } from "react"
import {
    Search,
    Plus,
    ChevronDown,
    Cog,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Shadcn/avatar"
import { Button } from "@/components/Shadcn/button"
import { Input } from "@/components/Shadcn/input"
import { ScrollArea } from "@/components/Shadcn/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/Shadcn/tooltip"
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/Shadcn/collapsible";
import UserProfileCard from "@/components/organisms/Discord/userProfileCard"
import { businesses, channels, getChannelIcon } from "@/discord_data_dummy/discordData";

export default function MobileSidebarView({ selectedBusiness, setSelectedBusiness, selectedChannel, setSelectedChannel, groupedChannels }) {
    return (
        <div className="flex h-screen bg-background ">
                {/* Left Sidebar - Business Servers */}
                <div className="w-16 bg-muted/30 flex flex-col items-center py-3 border-r">
                    <ScrollArea className="flex-1 w-full">
                        <div className="flex flex-col items-center space-y-2 px-2">
                            {businesses.map((business) => (
                                <Tooltip key={business.id}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant={selectedBusiness === business.id ? "default" : "ghost"}
                                            size="icon"
                                            className={`w-12 h-12 rounded-2xl transition-all duration-200 ${selectedBusiness === business.id ? "rounded-xl" : "hover:rounded-xl"
                                                }`}
                                            onClick={() => {
                                                setSelectedBusiness(business.id)
                                                setSelectedChannel(channels[business.id]?.[0]?.id || 1)
                                            }}
                                        >
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={business.avatar || "/placeholder.svg"} />
                                                <AvatarFallback className={business.color}>{business.initials}</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>{business.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    </ScrollArea>


                </div>

                {/* Channel Sidebar */}
                <div className="flex-1 bg-muted/20 flex flex-col">
                    {/* Business Header */}
                    <div className="p-4 border-b">
                        <h2 className="font-semibold text-lg">{businesses.find((b) => b.id === selectedBusiness)?.name}</h2>
                    </div>

                    {/* Search */}
                    <div className="p-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search channels..." className="pl-9 h-8 bg-background/50" />
                        </div>
                    </div>

                    {/* Channels List */}
                    <ScrollArea className="flex-1 px-2">
                        <div className="mt-4 space-y-4">
                            {Object.entries(groupedChannels).map(([category, channelsInCategory]) => (
                                <Collapsible key={category} defaultOpen={true} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs font-bold uppercase text-muted-foreground hover:text-foreground px-1">
                                        <CollapsibleTrigger className="flex items-center flex-1 gap-1 py-1">
                                            <ChevronDown className="h-3 w-3 transition-transform duration-200 data-[state=closed]:-rotate-90" />
                                            <span className="flex-1 text-left">{category}</span>
                                        </CollapsibleTrigger>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-5 w-5"><Plus className="h-4 w-4" /></Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="top" className="p-1.5 text-xs"><p>Create Channel</p></TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <CollapsibleContent className="space-y-0.5 pl-2">
                                        {channelsInCategory.map((channel) => {
                                            const Icon = getChannelIcon(channel.type);
                                            const isActive = selectedChannel === channel.id;
                                            return (
                                                <div
                                                    key={channel.id}
                                                    className={`group w-full flex justify-start items-center p-1.5 rounded-md cursor-pointer ${
                                                        isActive
                                                            ? "bg-accent text-accent-foreground"
                                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                    }`}
                                                    onClick={() => setSelectedChannel(channel.id)}
                                                >
                                                    <Icon className="w-5 h-5 mx-1" />
                                                    <span className="truncate flex-1 text-left font-medium text-sm">{channel.name}</span>
                                                    <div className={`flex items-center ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                        <Tooltip disableHoverableContent={true}>
                                                            <TooltipTrigger asChild>
                                                                <Link href={`/discord/settings/channel/${channel.id}`} passHref>
                                                                    <Button variant="ghost" size="icon" className="h-6 w-6"><Cog className="h-4 w-4" /></Button>
                                                                </Link>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top" className="p-1.5 text-xs"><p>Edit Channel</p></TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </CollapsibleContent>
                                </Collapsible>
                            ))}
                        </div>
                    </ScrollArea>

                    <UserProfileCard />
                </div>
            </div>
    )
}