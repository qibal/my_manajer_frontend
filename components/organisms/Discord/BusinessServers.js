
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
import { businesses, channels } from "@/discord_data_dummy/discordData";

export default function BusinessServers({ selectedBusiness, setSelectedBusiness, setSelectedChannel }) {
    return (
        <div className="w-16 bg-muted/30 flex flex-col items-center py-3 border-r ">
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
                <Separator className="w-8 my-2" />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-12 h-12 rounded-2xl hover:rounded-xl transition-all duration-200"
                        >
                            <Plus className="w-6 h-6" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>Add Business</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </ScrollArea>


    </div>
    )
}