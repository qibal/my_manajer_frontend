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
    ChevronRight
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

// Mock data with more businesses (20 data)
const businesses = [
    { id: 1, name: "TechCorp", avatar: "/placeholder.svg?height=48&width=48", initials: "TC", color: "bg-blue-500" },
    { id: 2, name: "DesignStudio", avatar: "/placeholder.svg?height=48&width=48", initials: "DS", color: "bg-purple-500" },
    { id: 3, name: "MarketingPro", avatar: "/placeholder.svg?height=48&width=48", initials: "MP", color: "bg-green-500" },
    { id: 4, name: "DataAnalytics", avatar: "/placeholder.svg?height=48&width=48", initials: "DA", color: "bg-orange-500" },
    { id: 5, name: "StartupHub", avatar: "/placeholder.svg?height=48&width=48", initials: "SH", color: "bg-red-500" },
    { id: 6, name: "ConsultingFirm", avatar: "/placeholder.svg?height=48&width=48", initials: "CF", color: "bg-indigo-500" },
    { id: 7, name: "FinanceGroup", avatar: "/placeholder.svg?height=48&width=48", initials: "FG", color: "bg-yellow-500" },
    { id: 8, name: "HealthTech", avatar: "/placeholder.svg?height=48&width=48", initials: "HT", color: "bg-pink-500" },
    { id: 9, name: "EduWorld", avatar: "/placeholder.svg?height=48&width=48", initials: "EW", color: "bg-teal-500" },
    { id: 10, name: "RetailGiant", avatar: "/placeholder.svg?height=48&width=48", initials: "RG", color: "bg-lime-500" },
    { id: 11, name: "AgroBiz", avatar: "/placeholder.svg?height=48&width=48", initials: "AB", color: "bg-green-700" },
    { id: 12, name: "TravelEase", avatar: "/placeholder.svg?height=48&width=48", initials: "TE", color: "bg-cyan-500" },
    { id: 13, name: "Foodies", avatar: "/placeholder.svg?height=48&width=48", initials: "FD", color: "bg-orange-700" },
    { id: 14, name: "AutoMotive", avatar: "/placeholder.svg?height=48&width=48", initials: "AM", color: "bg-gray-700" },
    { id: 15, name: "MediaWorks", avatar: "/placeholder.svg?height=48&width=48", initials: "MW", color: "bg-fuchsia-500" },
    { id: 16, name: "GreenEnergy", avatar: "/placeholder.svg?height=48&width=48", initials: "GE", color: "bg-emerald-500" },
    { id: 17, name: "LogiTech", avatar: "/placeholder.svg?height=48&width=48", initials: "LT", color: "bg-blue-700" },
    { id: 18, name: "BuildRight", avatar: "/placeholder.svg?height=48&width=48", initials: "BR", color: "bg-yellow-700" },
    { id: 19, name: "LegalEase", avatar: "/placeholder.svg?height=48&width=48", initials: "LE", color: "bg-red-700" },
    { id: 20, name: "CloudNet", avatar: "/placeholder.svg?height=48&width=48", initials: "CN", color: "bg-sky-500" },
]

// Updated channels with new types (20 data per business)
const channels = {
    1: [
        { id: 1, name: "general", type: "text", unread: 3 },
        { id: 2, name: "development", type: "text", unread: 0 },
        { id: 3, name: "design-review", type: "text", unread: 1 },
        { id: 4, name: "team-meeting", type: "voice", unread: 0 },
        { id: 5, name: "project-alpha", type: "text", unread: 5 },
        { id: 6, name: "whiteboard", type: "draw", unread: 0 },
        { id: 7, name: "documentation", type: "document", unread: 2 },
        { id: 8, name: "project-db", type: "database", unread: 0 },
        { id: 9, name: "weekly-report", type: "report", unread: 1 },
        { id: 10, name: "brainstorm", type: "draw", unread: 0 },
        { id: 11, name: "random", type: "text", unread: 2 },
        { id: 12, name: "support", type: "text", unread: 0 },
        { id: 13, name: "announcements", type: "text", unread: 1 },
        { id: 14, name: "off-topic", type: "text", unread: 0 },
        { id: 15, name: "qa", type: "text", unread: 0 },
        { id: 16, name: "marketing", type: "text", unread: 3 },
        { id: 17, name: "sales", type: "voice", unread: 0 },
        { id: 18, name: "finance", type: "document", unread: 1 },
        { id: 19, name: "hr", type: "text", unread: 0 },
        { id: 20, name: "legal", type: "text", unread: 0 },
        { id: 21, name: "general", type: "text", unread: 3 },
        { id: 22, name: "development", type: "text", unread: 0 },
        { id: 23, name: "design-review", type: "text", unread: 1 },
        { id: 24, name: "team-meeting", type: "voice", unread: 0 },
        { id: 25, name: "project-alpha", type: "text", unread: 5 },
        { id: 26, name: "whiteboard", type: "draw", unread: 0 },
        { id: 27, name: "documentation", type: "document", unread: 2 },
        { id: 28, name: "project-db", type: "database", unread: 0 },
        { id: 29, name: "weekly-report", type: "report", unread: 1 },
        { id: 30, name: "brainstorm", type: "draw", unread: 0 },
        { id: 31, name: "random", type: "text", unread: 2 },
        { id: 32, name: "support", type: "text", unread: 0 },
        { id: 33, name: "announcements", type: "text", unread: 1 },
        { id: 34, name: "off-topic", type: "text", unread: 0 },
        { id: 35, name: "qa", type: "text", unread: 0 },
        { id: 36, name: "marketing", type: "text", unread: 3 },
        { id: 37, name: "sales", type: "voice", unread: 0 },
        { id: 38, name: "finance", type: "document", unread: 1 },
        { id: 39, name: "hr", type: "text", unread: 0 },
        { id: 40, name: "legal", type: "text", unread: 0 },
    ],
    2: [
        { id: 21, name: "creative-brief", type: "text", unread: 2 },
        { id: 22, name: "client-feedback", type: "text", unread: 0 },
        { id: 23, name: "design-showcase", type: "voice", unread: 0 },
        { id: 24, name: "mood-board", type: "draw", unread: 1 },
        { id: 25, name: "brand-guide", type: "document", unread: 0 },
        { id: 26, name: "project-x", type: "text", unread: 2 },
        { id: 27, name: "project-y", type: "text", unread: 0 },
        { id: 28, name: "project-z", type: "text", unread: 1 },
        { id: 29, name: "team-sync", type: "voice", unread: 0 },
        { id: 30, name: "client-calls", type: "voice", unread: 0 },
        { id: 31, name: "assets", type: "document", unread: 0 },
        { id: 32, name: "references", type: "document", unread: 0 },
        { id: 33, name: "ideas", type: "draw", unread: 0 },
        { id: 34, name: "wireframes", type: "draw", unread: 1 },
        { id: 35, name: "prototypes", type: "draw", unread: 0 },
        { id: 36, name: "testing", type: "text", unread: 0 },
        { id: 37, name: "qa", type: "text", unread: 0 },
        { id: 38, name: "handoff", type: "text", unread: 0 },
        { id: 39, name: "archive", type: "document", unread: 0 },
        { id: 40, name: "feedback", type: "text", unread: 1 },
    ],
}

// More online users (20 data)
const onlineUsers = [
    { id: 1, name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Admin" },
    { id: 2, name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Developer" },
    { id: 3, name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", status: "away", role: "Designer" },
    { id: 4, name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Manager" },
    { id: 5, name: "Tom Brown", avatar: "/placeholder.svg?height=32&width=32", status: "busy", role: "Analyst" },
    { id: 6, name: "Lisa Davis", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Marketing" },
    { id: 7, name: "Alex Chen", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Developer" },
    { id: 8, name: "Emma Wilson", avatar: "/placeholder.svg?height=32&width=32", status: "away", role: "Designer" },
    { id: 9, name: "David Lee", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Product Manager" },
    { id: 10, name: "Sophie Turner", avatar: "/placeholder.svg?height=32&width=32", status: "busy", role: "QA Engineer" },
    { id: 11, name: "Chris Evans", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Support" },
    { id: 12, name: "Natalie Portman", avatar: "/placeholder.svg?height=32&width=32", status: "away", role: "Designer" },
    { id: 13, name: "Robert Downey", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Lead Dev" },
    { id: 14, name: "Scarlett Johansson", avatar: "/placeholder.svg?height=32&width=32", status: "busy", role: "HR" },
    { id: 15, name: "Mark Ruffalo", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Finance" },
    { id: 16, name: "Jeremy Renner", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Sales" },
    { id: 17, name: "Elizabeth Olsen", avatar: "/placeholder.svg?height=32&width=32", status: "away", role: "Marketing" },
    { id: 18, name: "Paul Bettany", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Support" },
    { id: 19, name: "Tom Hiddleston", avatar: "/placeholder.svg?height=32&width=32", status: "busy", role: "Legal" },
    { id: 20, name: "Benedict Cumberbatch", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "DevOps" },
]

// Updated mock chat messages with new fields
const chatMessages = [
    // Day 1
    { id: 1, user: "John Doe", message: "Hey everyone! How's the project going?", timestamp: "2025-02-18T10:30:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [{emoji: "👍", count: 3}], readStatus: null, pinned: false },
    { id: 2, user: "Jane Smith", message: "Making good progress on the frontend. Should be ready for review by tomorrow.", timestamp: "2025-02-18T10:32:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: true, reactions: [], readStatus: null, pinned: true },
    { id: 3, user: "Iqbal", message: "Great! I'll check it out first thing in the morning.", timestamp: "2025-02-18T10:35:00Z", avatar: "https://github.com/shadcn.png", edited: false, reactions: [{emoji: "🔥", count: 1}], readStatus: 'read', pinned: false },
    { id: 4, user: "Alex Chen", message: "Backend API is deployed and documented. Let me know if you find any issues.", timestamp: "2025-02-18T11:00:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [{emoji: "✅", count: 2}], readStatus: null, pinned: false },

    // Day 2
    { id: 5, user: "Sarah Wilson", message: "Perfect timing. Let's schedule a review meeting for Thursday.", timestamp: "2025-02-19T09:00:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [], readStatus: null, pinned: true },
    { id: 6, user: "Iqbal", message: "Sounds good to me!", timestamp: "2025-02-19T09:05:00Z", avatar: "https://github.com/shadcn.png", edited: false, reactions: [], readStatus: 'delivered', pinned: false },
    { id: 7, user: "David Lee", message: "I've updated the product roadmap with the new timeline.", timestamp: "2025-02-19T10:15:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [{emoji: "🗺️", count: 1}], readStatus: null, pinned: false },
    { id: 8, user: "Iqbal", message: "Thanks, David. I've pushed the latest frontend updates.", timestamp: "2025-02-19T11:42:00Z", avatar: "https://github.com/shadcn.png", edited: true, reactions: [], readStatus: 'sent', pinned: false },
    { id: 9, user: "Emma Wilson", message: "The design assets for the new feature are now available in Figma.", timestamp: "2025-02-19T14:20:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [{emoji: "🎨", count: 4}], readStatus: null, pinned: true },

    // Day 3
    { id: 10, user: "Tom Brown", message: "Here's the weekly analytics report. We're seeing a great trend in user engagement.", timestamp: "2025-02-20T16:00:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [{emoji: "📈", count: 5}], readStatus: null, pinned: false },
    { id: 11, user: "Iqbal", message: "Awesome numbers! Keep up the great work, team.", timestamp: "2025-02-20T16:05:00Z", avatar: "https://github.com/shadcn.png", edited: false, reactions: [{emoji: "🎉", count: 10}], readStatus: 'read', pinned: false },
    { id: 12, user: "Lisa Davis", message: "The new marketing campaign is ready to launch tomorrow morning.", timestamp: "2025-02-20T17:30:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [], readStatus: null, pinned: false },
    { id: 13, user: "Iqbal", message: "Let's do it!", timestamp: "2025-02-20T17:31:00Z", avatar: "https://github.com/shadcn.png", edited: false, reactions: [], readStatus: 'read', pinned: false },
    { id: 14, user: "Sophie Turner", message: "QA testing for the mobile app is complete. No major blockers found.", timestamp: "2025-02-20T18:00:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [{emoji: "👍", count: 2}], readStatus: null, pinned: false },

    // Day 4
    { id: 15, user: "Chris Evans", message: "I've cleared all the critical support tickets from the queue.", timestamp: "2025-02-21T10:00:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [], readStatus: null, pinned: false },
    { id: 16, user: "Iqbal", message: "Great job, Chris!", timestamp: "2025-02-21T10:02:00Z", avatar: "https://github.com/shadcn.png", edited: false, reactions: [], readStatus: 'read', pinned: false },
    { id: 17, user: "Robert Downey", message: "Code review for the payment module is scheduled for this afternoon.", timestamp: "2025-02-21T11:00:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [], readStatus: null, pinned: false },
    { id: 18, user: "Mark Ruffalo", message: "Just submitted the finance report for Q1.", timestamp: "2025-02-21T11:30:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: true, reactions: [{emoji: "📄", count: 1}], readStatus: null, pinned: false },
    { id: 19, user: "Scarlett Johansson", message: "A reminder about the new HR policies, please review them by the end of the week.", timestamp: "2025-02-21T15:00:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [], readStatus: null, pinned: false },
    { id: 20, user: "Iqbal", message: "Will do, thanks for the reminder.", timestamp: "2025-02-21T15:05:00Z", avatar: "https://github.com/shadcn.png", edited: false, reactions: [], readStatus: 'delivered', pinned: false }
];

const currentUser = {
    name: "Iqbal",
    email: "iqbal@example.com",
    avatar: "https://github.com/shadcn.png",
    status: "online",
}
const currentUserName = currentUser.name;

const getChannelIcon = (type) => {
    switch (type) {
        case "text":
            return Hash
        case "voice":
            return Volume2
        case "draw":
            return Edit3
        case "document":
            return FileText
        case "database":
            return Database
        case "report":
            return BarChart3
        default:
            return Hash
    }
}

const getStatusColor = (status) => {
    switch (status) {
        case "online":
            return "bg-green-500"
        case "away":
            return "bg-yellow-500"
        case "busy":
            return "bg-red-500"
        default:
            return "bg-gray-500"
    }
}

const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const ReadReceipt = ({ status }) => {
    if (status === 'read') return <CheckCheck className="w-4 h-4 text-blue-500" />;
    if (status === 'delivered') return <CheckCheck className="w-4 h-4 text-muted-foreground" />;
    if (status === 'sent') return <Check className="w-4 h-4 text-muted-foreground" />;
    return null;
};

// Chat Channel Component
const ChatChannel = ({ channel }) => {
    const [message, setMessage] = useState("")
    const [showPinned, setShowPinned] = useState(true);
    const [pinnedIndex, setPinnedIndex] = useState(0);
    let lastMessageDate = null;

    const pinnedMessages = chatMessages.filter(msg => msg.pinned);

    const scrollToMessage = (messageId) => {
        const messageEl = document.getElementById(`message-${messageId}`);
        if (messageEl) {
            messageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const bubbleEl = messageEl.querySelector('.message-bubble');
            if (bubbleEl) {
                bubbleEl.classList.add('highlight-scroll');
                setTimeout(() => {
                    bubbleEl.classList.remove('highlight-scroll');
                }, 1500);
            }
        }
    };

    useEffect(() => {
        if (showPinned && pinnedMessages.length > 0) {
            const messageId = pinnedMessages[pinnedIndex].id;
            // We don't auto-scroll on first load, only on navigation.
            // But for this demo, we can scroll on index change.
            scrollToMessage(messageId);
        }
    }, [pinnedIndex]);

    const handleNextPinned = () => {
        setPinnedIndex((prevIndex) => (prevIndex + 1) % pinnedMessages.length);
    };

    const handlePrevPinned = () => {
        setPinnedIndex((prevIndex) => (prevIndex - 1 + pinnedMessages.length) % pinnedMessages.length);
    };

    return (
        <div className="flex flex-col h-full bg-background">
            {showPinned && pinnedMessages.length > 0 && (
                <div className="flex items-center p-2 border-b bg-muted/50 text-sm flex-shrink-0">
                    <Pin className="w-4 h-4 mr-3 text-yellow-500" />
                    <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => scrollToMessage(pinnedMessages[pinnedIndex].id)}
                    >
                        <span className="font-semibold">{pinnedMessages[pinnedIndex].user}: </span>
                        <span className="text-muted-foreground truncate">{pinnedMessages[pinnedIndex].message}</span>
                    </div>
                    <div className="flex items-center ml-4">
                        <span className="text-xs text-muted-foreground">{pinnedIndex + 1} of {pinnedMessages.length}</span>
                        <Button variant="ghost" size="icon" className="w-6 h-6 ml-2" onClick={handlePrevPinned} disabled={pinnedMessages.length <= 1}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-6 h-6" onClick={handleNextPinned} disabled={pinnedMessages.length <= 1}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                        {/* <Button variant="ghost" size="icon" className="w-6 h-6 ml-2" onClick={() => setShowPinned(false)}>
                            <X className="w-4 h-4" />
                        </Button> */}
                    </div>
                </div>
            )}
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-4">
                    <div className="space-y-2">
                        {chatMessages.map((msg) => {
                            const currentMessageDate = formatDate(msg.timestamp);
                            const showDateSeparator = currentMessageDate !== lastMessageDate;
                            lastMessageDate = currentMessageDate;

                            return (
                                <div key={msg.id} id={`message-${msg.id}`}>
                                    {showDateSeparator && (
                                        <div className="relative my-4">
                                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                <div className="w-full border-t border-border" />
                                            </div>
                                            <div className="relative flex justify-center">
                                                <span className="bg-background px-2 text-xs text-muted-foreground">{currentMessageDate}</span>
                                            </div>
                                        </div>
                                    )}
                                    <ContextMenu>
                                        <ContextMenuTrigger asChild>
                                            <div className={`flex items-start space-x-3 cursor-pointer select-text group ${msg.user === currentUserName ? 'justify-end' : ''}`}>
                                                {msg.user !== currentUserName && (
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                                                        <AvatarFallback>{msg.user.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className={`flex flex-col max-w-[75%] ${msg.user === currentUserName ? 'items-end' : 'items-start'}`}>
                                                    <div
                                                        className={`message-bubble relative rounded-2xl px-3 py-2 transition-colors border group-hover:bg-accent/40
                                                            ${msg.user === currentUserName ? 'bg-white border-blue-200 text-black' : 'bg-muted border-muted text-foreground'}`
                                                        }
                                                    >
                                                        <div className="absolute -top-3 right-2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                            <HoverCard openDelay={0} closeDelay={0}><HoverCardTrigger asChild><Button variant="outline" size="icon" className="w-7 h-7 rounded-full"><Flame className="w-4 h-4 text-orange-500" /></Button></HoverCardTrigger><HoverCardContent side="top" className="px-2 py-1 text-xs">React: Fire</HoverCardContent></HoverCard>
                                                            <HoverCard openDelay={0} closeDelay={0}><HoverCardTrigger asChild><Button variant="outline" size="icon" className="w-7 h-7 rounded-full"><Heart className="w-4 h-4 text-rose-500" /></Button></HoverCardTrigger><HoverCardContent side="top" className="px-2 py-1 text-xs">React: Love</HoverCardContent></HoverCard>
                                                            <HoverCard openDelay={0} closeDelay={0}><HoverCardTrigger asChild><Button variant="outline" size="icon" className="w-7 h-7 rounded-full"><ThumbsUp className="w-4 h-4 text-yellow-500" /></Button></HoverCardTrigger><HoverCardContent side="top" className="px-2 py-1 text-xs">React: Like</HoverCardContent></HoverCard>
                                                            <HoverCard openDelay={0} closeDelay={0}><HoverCardTrigger asChild><Button variant="outline" size="icon" className="w-7 h-7 rounded-full"><Reply className="w-4 h-4" /></Button></HoverCardTrigger><HoverCardContent side="top" className="px-2 py-1 text-xs">Reply</HoverCardContent></HoverCard>
                                                            <HoverCard openDelay={0} closeDelay={0}><HoverCardTrigger asChild><Button variant="outline" size="icon" className="w-7 h-7 rounded-full"><Forward className="w-4 h-4" /></Button></HoverCardTrigger><HoverCardContent side="top" className="px-2 py-1 text-xs">Forward</HoverCardContent></HoverCard>
                                                            <DropdownMenu>
                                                                <HoverCard openDelay={0} closeDelay={0}>
                                                                    <HoverCardTrigger asChild>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="outline" size="icon" className="w-7 h-7 rounded-full">
                                                                                <MoreVertical className="w-4 h-4" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                    </HoverCardTrigger>
                                                                    <HoverCardContent side="top" className="px-2 py-1 text-xs">More</HoverCardContent>
                                                                </HoverCard>
                                                                <DropdownMenuContent align="end" sideOffset={4} className="w-40">
                                                                    <DropdownMenuItem onClick={() => {/* pin logic */ }}>
                                                                        <Pin className="w-4 h-4 mr-2" /> Pin
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(msg.message) }}>
                                                                        <Copy className="w-4 h-4 mr-2" /> Copy Text
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => {/* edit logic */ }}>
                                                                        <Pencil className="w-4 h-4 mr-2" /> Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="text-rose-600 focus:bg-rose-100" onClick={() => {/* delete logic */ }}>
                                                                        <Trash2 className="w-4 h-4 mr-2 text-rose-600" /> Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>

                                                        <div className="flex items-center space-x-2">
                                                            {msg.user !== currentUserName && <span className="font-semibold text-sm text-blue-500 ">{msg.user}</span>}
                                                            <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                                                            {msg.edited && <span className="text-xs text-muted-foreground">(edited)</span>}
                                                            {msg.user === currentUserName && <ReadReceipt status={msg.readStatus} />}
                                                        </div>
                                                        <p className="text-sm mt-1 break-words">{msg.message}</p>
                                                    </div>
                                                    {msg.reactions && msg.reactions.length > 0 && (
                                                        <div className="flex gap-1 mt-1 p-1">
                                                            {msg.reactions.map(reaction => (
                                                                <button key={reaction.emoji} className="flex items-center gap-1.5 text-xs rounded-full bg-background/80 hover:bg-muted border px-2 py-0.5">
                                                                    <span>{reaction.emoji}</span>
                                                                    <span className="font-semibold">{reaction.count}</span>
                                                                </button>
                                                            ))}
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <button className="flex items-center justify-center w-6 h-6 text-xs rounded-full bg-background/80 hover:bg-muted border"><SmilePlus className="w-3.5 h-3.5" /></button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0">
                                                                    <div className="grid grid-cols-5 gap-1 p-2">
                                                                        {["👍", "❤️", "😂", "😯", "😢", "🙏"].map(emj => (
                                                                            <button key={emj} className="text-xl hover:bg-muted rounded p-1">{emj}</button>
                                                                        ))}
                                                                    </div>
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                    )}
                                                </div>
                                                {msg.user === currentUserName && (
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarImage src={currentUser.avatar} />
                                                        <AvatarFallback>{currentUser.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                                                    </Avatar>
                                                )}
                                            </div>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuItem onClick={() => {/* reply logic */ }}>
                                                <Reply className="w-4 h-4 mr-2" /> Reply
                                            </ContextMenuItem>
                                            <ContextMenuItem onClick={() => {/* forward logic */ }}>
                                                <Forward className="w-4 h-4 mr-2" /> Forward
                                            </ContextMenuItem>
                                            <ContextMenuSeparator />
                                            <ContextMenuItem onClick={() => {/* pin logic */ }}>
                                                <Pin className="w-4 h-4 mr-2" /> Pin
                                            </ContextMenuItem>
                                            <ContextMenuItem onClick={() => { navigator.clipboard.writeText(msg.message) }}>
                                                <Copy className="w-4 h-4 mr-2" /> Copy Text
                                            </ContextMenuItem>
                                            <ContextMenuSeparator />
                                            <ContextMenuItem onClick={() => {/* edit logic */ }}>
                                                <Pencil className="w-4 h-4 mr-2" /> Edit
                                            </ContextMenuItem>
                                            <ContextMenuItem className="text-rose-600 focus:bg-rose-100" onClick={() => {/* delete logic */ }}>
                                                <Trash2 className="w-4 h-4 mr-2 text-rose-600" /> Delete
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                    <HoverCard openDelay={130} closeDelay={130}>
                        <HoverCardTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                                <Paperclip className="w-4 h-4" />
                            </Button>
                        </HoverCardTrigger>
                        <HoverCardContent side="top" align="start" sideOffset={8} className="w-40 p-2">
                            <div className="flex flex-col gap-1">
                                <Button variant="ghost" className="justify-start w-full h-8 px-2 text-sm">
                                    📷 Photo & Video
                                </Button>
                                <Button variant="ghost" className="justify-start w-full h-8 px-2 text-sm">
                                    📄 Document
                                </Button>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                    <div className="flex-1 relative">
                        <Input
                            placeholder={`Message #${channel.name}`}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="pr-20"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                            <HoverCard openDelay={130} closeDelay={130}>
                                <HoverCardTrigger asChild>
                                    <Button variant="ghost" size="icon" className="w-6 h-6">
                                        <Smile className="w-4 h-4" />
                                    </Button>
                                </HoverCardTrigger>
                                <HoverCardContent side="top" align="end" sideOffset={8} className="w-72 p-0" style={{ height: 320, maxHeight: 320 }}>
                                    <Tabs defaultValue="emoji" className="w-full h-full">
                                        <TabsList className="w-full flex">
                                            <TabsTrigger value="emoji" className="flex-1">Emoji</TabsTrigger>
                                            <TabsTrigger value="stickers" className="flex-1">Stickers</TabsTrigger>
                                            <TabsTrigger value="gifs" className="flex-1">GIFs</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="emoji">
                                            <ScrollArea className="h-[250px]">
                                                <div className="grid grid-cols-8 gap-2 p-3">
                                                    {["😀", "😂", "😍", "😎", "😢", "👍", "🔥", "🎉", "🥳", "🤔", "😡", "😭", "😇", "😱", "😴", "🤩", "😜", "😏", "😬", "😅", "😆", "😋", "😛", "😝", "😤", "😪", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👻", "💀", "👽", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"].map((emj) => (
                                                        <button key={emj} className="text-2xl hover:bg-muted rounded p-1" onClick={() => setMessage(message + emj)}>{emj}</button>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </TabsContent>
                                        <TabsContent value="stickers">
                                            <ScrollArea className="h-[250px]">
                                                <div className="grid grid-cols-4 gap-2 p-3">
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                                                        <button key={i} className="rounded overflow-hidden border hover:border-primary" onClick={() => setMessage(message + `[Sticker${i}]`)}>
                                                            <img src={`https://placekitten.com/60/60?image=${i}`} alt="sticker" className="w-12 h-12 object-cover" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </TabsContent>
                                        <TabsContent value="gifs">
                                            <ScrollArea className="h-[250px]">
                                                <div className="grid grid-cols-3 gap-2 p-3">
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                                                        <button key={i} className="rounded overflow-hidden border hover:border-primary" onClick={() => setMessage(message + `[GIF${i}]`)}>
                                                            <img src={`https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif?${i}`} alt="gif" className="w-20 h-12 object-cover" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </TabsContent>
                                    </Tabs>
                                </HoverCardContent>
                            </HoverCard>
                            <Button variant="ghost" size="icon" className="w-6 h-6">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Voice Channel Component
const VoiceChannel = ({ channel }) => {
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOn, setIsVideoOn] = useState(false)

    return (
        <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="text-center mb-8">
                <Volume2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">Voice Channel: {channel.name}</h2>
                <p className="text-muted-foreground">Connect to start talking with your team</p>
            </div>

            <div className="flex items-center space-x-4">
                <Button variant={isMuted ? "destructive" : "default"} size="lg" onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <MicOff className="w-5 h-5 mr-2" /> : <Mic className="w-5 h-5 mr-2" />}
                    {isMuted ? "Unmute" : "Mute"}
                </Button>

                <Button variant={isVideoOn ? "default" : "secondary"} size="lg" onClick={() => setIsVideoOn(!isVideoOn)}>
                    {isVideoOn ? <Video className="w-5 h-5 mr-2" /> : <VideoOff className="w-5 h-5 mr-2" />}
                    {isVideoOn ? "Stop Video" : "Start Video"}
                </Button>

                <Button variant="destructive" size="lg">
                    <PhoneOff className="w-5 h-5 mr-2" />
                    Leave
                </Button>
            </div>
        </div>
    )
}

// Draw Channel Component (Excalidraw simulation)
const DrawChannel = ({ channel }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-muted/50">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium">Drawing Board: {channel.name}</h3>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            Pen
                        </Button>
                        <Button variant="outline" size="sm">
                            Rectangle
                        </Button>
                        <Button variant="outline" size="sm">
                            Circle
                        </Button>
                        <Button variant="outline" size="sm">
                            Text
                        </Button>
                        <Button variant="outline" size="sm">
                            Clear
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white m-4 border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                    <Edit3 className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">Excalidraw Drawing Board</p>
                    <p className="text-sm">Click and drag to start drawing</p>
                </div>
            </div>
        </div>
    )
}

// Document Channel Component (Tiptap simulation)
const DocumentChannel = ({ channel }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-muted/50">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium">Document: {channel.name}</h3>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            Bold
                        </Button>
                        <Button variant="outline" size="sm">
                            Italic
                        </Button>
                        <Button variant="outline" size="sm">
                            Link
                        </Button>
                        <Button variant="outline" size="sm">
                            Save
                        </Button>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="prose max-w-none">
                    <h1>Project Documentation</h1>
                    <p>This is a rich text editor powered by Tiptap. You can write and format your documents here.</p>

                    <h2>Features</h2>
                    <ul>
                        <li>Rich text formatting</li>
                        <li>Tables and lists</li>
                        <li>Code blocks</li>
                        <li>Images and media</li>
                    </ul>

                    <div className="mt-8 p-4 border rounded-lg bg-muted/20">
                        <p className="text-muted-foreground">Start typing to edit this document...</p>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

// Database Channel Component (Notion-like)
const DatabaseChannel = ({ channel }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-muted/50">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium">Database: {channel.name}</h3>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            Add Property
                        </Button>
                        <Button variant="outline" size="sm">
                            Filter
                        </Button>
                        <Button variant="outline" size="sm">
                            Sort
                        </Button>
                        <Button size="sm">New</Button>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Custom Database Properties</CardTitle>
                            <CardDescription>Configure your database fields and views</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Property Name</Label>
                                    <Input placeholder="Enter property name" />
                                </div>
                                <div>
                                    <Label>Property Type</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="number">Number</SelectItem>
                                            <SelectItem value="date">Date</SelectItem>
                                            <SelectItem value="select">Select</SelectItem>
                                            <SelectItem value="checkbox">Checkbox</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-3 font-medium">Name</th>
                                    <th className="text-left p-3 font-medium">Status</th>
                                    <th className="text-left p-3 font-medium">Priority</th>
                                    <th className="text-left p-3 font-medium">Due Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4].map((i) => (
                                    <tr key={i} className="border-t">
                                        <td className="p-3">Task {i}</td>
                                        <td className="p-3">
                                            <Badge variant="outline">In Progress</Badge>
                                        </td>
                                        <td className="p-3">
                                            <Badge variant="destructive">High</Badge>
                                        </td>
                                        <td className="p-3">2024-01-{15 + i}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

// Report Channel Component
const ReportChannel = ({ channel }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-muted/50">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium">Report: {channel.name}</h3>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            Add Widget
                        </Button>
                        <Button variant="outline" size="sm">
                            Configure
                        </Button>
                        <Button size="sm">Export</Button>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { title: "Total Revenue", value: "$125,430", change: "+12.5%" },
                        { title: "Active Users", value: "2,847", change: "+5.2%" },
                        { title: "Conversion Rate", value: "3.24%", change: "-0.8%" },
                        { title: "Customer Satisfaction", value: "4.8/5", change: "+0.3" },
                        { title: "Response Time", value: "1.2s", change: "-0.3s" },
                        { title: "Error Rate", value: "0.05%", change: "-0.02%" },
                    ].map((metric, i) => (
                        <Card key={i}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metric.value}</div>
                                <p
                                    className={`text-xs ${metric.change.startsWith("+") ? "text-green-600" : metric.change.startsWith("-") ? "text-red-600" : "text-muted-foreground"}`}
                                >
                                    {metric.change} from last month
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Custom Data Sources</CardTitle>
                        <CardDescription>Connect and visualize data from any source</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <p className="font-medium">Project Database</p>
                                    <p className="text-sm text-muted-foreground">Connected to project-db channel</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <p className="font-medium">External API</p>
                                    <p className="text-sm text-muted-foreground">Custom endpoint integration</p>
                                </div>
                                <Switch />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ScrollArea>
        </div>
    )
}

const renderChannelContent = (channel) => {
    switch (channel?.type) {
        case "text":
            return <ChatChannel channel={channel} />
        case "voice":
            return <VoiceChannel channel={channel} />
        case "draw":
            return <DrawChannel channel={channel} />
        case "document":
            return <DocumentChannel channel={channel} />
        case "database":
            return <DatabaseChannel channel={channel} />
        case "report":
            return <ReportChannel channel={channel} />
        default:
            return <ChatChannel channel={channel} />
    }
}

export default function DiscordDashboard() {
    const [selectedBusiness, setSelectedBusiness] = useState(1)
    const [selectedChannel, setSelectedChannel] = useState(1)
    const [rightSidebarSize, setRightSidebarSize] = useState(20)
    const [isRightSidebarMaximized, setIsRightSidebarMaximized] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [showChannelView, setShowChannelView] = useState(false)

    const currentChannels = channels[selectedBusiness] || []
    const currentChannel = currentChannels.find((c) => c.id === selectedChannel)

    const userProfileCard = (
        <div className="p-2 border-t mt-auto bg-muted/30">
            <div className="flex items-center">
                <div className="relative">
                    <Avatar className="w-9 h-9">
                        <AvatarImage src={currentUser.avatar} />
                        <AvatarFallback>{currentUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(currentUser.status)}`}
                    />
                </div>
                <div className="ml-2 flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                </div>
                <div className="flex items-center">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-7 h-7">
                                <Mic className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            <p>Mute</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-7 h-7">
                                <Headphones className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            <p>Deafen</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-7 h-7">
                                <Settings className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            <p>User Settings</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    )

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
    useState(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Mobile Channel View
    if (isMobile && showChannelView) {
        return (
            <div className="flex flex-col h-screen bg-background ">
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
        )
    }

    // Mobile Sidebar View
    if (isMobile) {
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
                        <div className="space-y-1">
                            <div className="px-2 py-1">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Channels</h3>
                            </div>
                            {currentChannels.map((channel) => {
                                const IconComponent = getChannelIcon(channel.type)
                                return (
                                    <Button
                                        key={channel.id}
                                        variant={selectedChannel === channel.id ? "secondary" : "ghost"}
                                        className="w-full justify-start h-8 px-2"
                                        onClick={() => handleChannelClick(channel.id)}
                                    >
                                        <IconComponent className="w-4 h-4 mr-2" />
                                        <span className="truncate">{channel.name}</span>
                                        {channel.unread > 0 && (
                                            <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 text-xs">
                                                {channel.unread}
                                            </Badge>
                                        )}
                                    </Button>
                                )
                            })}
                        </div>
                    </ScrollArea>

                    {userProfileCard}
                </div>
            </div>
        )
    }

    // Desktop View
    return (
        <TooltipProvider>
            <div className="flex h-screen bg-background overflow-hidden">
                {/* Left Sidebar - Business Servers */}
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

                {/* Main Content Area */}
                <ResizablePanelGroup direction="horizontal" className="flex-1">
                    {/* Channel Sidebar */}
                    <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                        <div className="h-full bg-muted/20 flex flex-col">
                            {/* Business Header */}
                            <div className="p-4 border-b">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-semibold text-lg">{businesses.find((b) => b.id === selectedBusiness)?.name}</h2>
                                    <Button variant="ghost" size="icon" className="w-6 h-6">
                                        <Settings className="w-4 h-4" />
                                    </Button>
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
                                <div className="space-y-1">
                                    <div className="px-2 py-1">
                                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Channels</h3>
                                    </div>
                                    {currentChannels.map((channel) => {
                                        const IconComponent = getChannelIcon(channel.type)
                                        return (
                                            <Button
                                                key={channel.id}
                                                variant={selectedChannel === channel.id ? "secondary" : "ghost"}
                                                className="w-full justify-start h-8 px-2"
                                                onClick={() => setSelectedChannel(channel.id)}
                                            >
                                                <IconComponent className="w-4 h-4 mr-2" />
                                                <span className="truncate">{channel.name}</span>
                                                {channel.unread > 0 && (
                                                    <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 text-xs">
                                                        {channel.unread}
                                                    </Badge>
                                                )}
                                            </Button>
                                        )
                                    })}
                                </div>
                            </ScrollArea>

                            {userProfileCard}
                        </div>
                    </ResizablePanel>

                    <ResizableHandle />

                    {/* Main Content */}
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
                                    <Button variant="ghost" size="icon" className="w-8 h-8">
                                        <Pin className="w-4 h-4" />
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
