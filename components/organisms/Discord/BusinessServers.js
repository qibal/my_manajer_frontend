
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
import businessService from "@/service/business_service";
import channelData from "@/discord_data_dummy/channels.json";
import { AddBusinessDialog } from "./AddBusinessDialog";
import { useRouter } from 'next/navigation';

export default function BusinessServers({ businessData, selectedBusiness, setSelectedBusiness, onBusinessAdded, channels }) {
    const router = useRouter();
    console.log("BusinessServers: Render - businessData prop", businessData);
    console.log("BusinessServers: Render - channels prop", channels);

    // Defensive checks to ensure props are arrays
    const safeBusinessData = Array.isArray(businessData) ? businessData : [];
    const safeChannels = Array.isArray(channels) ? channels : [];
    console.log("BusinessServers: Render - safeBusinessData", safeBusinessData);
    console.log("BusinessServers: Render - safeChannels", safeChannels);

    return (
        <div className="w-16 bg-muted/30 flex flex-col items-center py-3 border-r ">
        <ScrollArea className="flex-1 w-full">
            <div className="flex flex-col items-center space-y-2 px-2">
                {safeBusinessData.map((business, idx) => {
                    console.log("BusinessServers: Mapping business", business);
                    // Ensure business.id is defined before using it in find
                    const firstChannelForBusiness = business.id ? safeChannels.find(channel => {
                        console.log(`BusinessServers: Looking for channel with businessId ${business.id} in channel`, channel);
                        return channel.businessId === business.id;
                    }) : undefined;
                    console.log(`BusinessServers: firstChannelForBusiness for ${business.id}`, firstChannelForBusiness);
                    return (
                        <Tooltip key={business.id || idx}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={selectedBusiness === business.id ? "default" : "ghost"}
                                    size="icon"
                                    className={`w-12 h-12 rounded-2xl transition-all duration-200 ${selectedBusiness === business.id ? "rounded-xl" : "hover:rounded-xl"
                                        }`}
                                    onClick={() => {
                                        setSelectedBusiness(business.id)
                                    }}
                                >
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={business.avatar || "/placeholder.svg"} />
                                        <AvatarFallback>{business.name.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>{business.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
                <Separator className="w-8 my-2" />
                <AddBusinessDialog onBusinessAdded={onBusinessAdded} />
            </div>
        </ScrollArea>


    </div>
    )
}