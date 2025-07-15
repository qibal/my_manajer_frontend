"use client"

import { useState, useEffect } from "react"

import {
    Hash,
    Volume2,
    Users,
    Settings,
    Plus,
    Search,
    MoreVertical,
    Pin,
    Maximize2,
    Minimize2,
    Send,
    Paperclip,
    Smile,
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
    Edit3,
    FileText,
    Database,
    BarChart3,
    ArrowLeft,
    Headphones,
    Reply,
    Forward,
    Copy,
    Trash2,
    ThumbsUp,
    Flame,
    Heart,
    Pencil,
    Check,
    CheckCheck,
    SmilePlus,
    X,
    ChevronLeft,
    ChevronRight,
    UserPlus,
    Cog,
    ListTree,
    Bell,
    ChevronDown
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Shadcn/avatar"
import { Button } from "@/components/Shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/card"
import { Input } from "@/components/Shadcn/input"
import { ScrollArea } from "@/components/Shadcn/scroll-area"
import { Separator } from "@/components/Shadcn/separator"
import { Badge } from "@/components/Shadcn/badge"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/Shadcn/resizable"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/Shadcn/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/select"
import { Label } from "@/components/Shadcn/label"
import { Switch } from "@/components/Shadcn/switch"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/Shadcn/hover-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Shadcn/tabs"
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from "@/components/Shadcn/context-menu"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/Shadcn/dropdown-menu"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/Shadcn/popover"
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/Shadcn/collapsible";
import ExcalidrawWrapper from '@/components/Excalidraw/excalidraw';
import ChatChannel from "@/components/organisms/Discord/ChatChannel"
import VoiceChannel from "@/components/organisms/Discord/VoiceChannel"
import DrawChannel from "@/components/organisms/Discord/DrawChannel"
import DocumentChannel from "@/components/organisms/Discord/DocumentChannel"
import DatabaseChannel from "@/components/organisms/Discord/DatabaseChannel"
import ReportChannel from "@/components/organisms/Discord/ReportChannel"
import UserProfileCard from "@/components/organisms/Discord/userProfileCard"
import { businesses, channels, getChannelIcon } from "@/discord_data_dummy/discordData";

export default function ChannelSidebar({ selectedBusiness, selectedChannel, setSelectedChannel, groupedChannels }) {
    return (

        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full bg-muted/20 flex flex-col">
                {/* Business Header */}
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-lg">{businesses.find((b) => b.id === selectedBusiness)?.name}</h2>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-6 h-6">
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-2">
                                <div className="flex flex-col space-y-1">
                                    <Button variant="ghost" className="w-full justify-start font-normal">
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Invite People
                                    </Button>
                                    <Link href="/discord/bussines_settings">
                                        <Button variant="ghost" className="w-full justify-start font-normal">
                                            <Cog className="mr-2 h-4 w-4" />
                                            Business Settings
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" className="w-full justify-start font-normal">
                                        <Hash className="mr-2 h-4 w-4" />
                                        Create Channel
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start font-normal">
                                        <ListTree className="mr-2 h-4 w-4" />
                                        Create Category
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start font-normal">
                                        <Bell className="mr-2 h-4 w-4" />
                                        Notification Settings
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
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
                                                className={`group w-full flex justify-start items-center p-1.5 rounded-md cursor-pointer ${isActive
                                                        ? "bg-accent text-accent-foreground"
                                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                    }`}
                                                onClick={() => setSelectedChannel(channel.id)}
                                            >
                                                <Icon className="w-5 h-5 mx-1" />
                                                <span className="truncate flex-1 text-left font-medium text-sm">{channel.name}</span>
                                                <div className={`flex items-center ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Link href={`/discord/settings/channel/${channel.id}`} passHref>
                                                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted"><Cog className="h-4 w-4" /></Button>
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
        </ResizablePanel>

    )
}