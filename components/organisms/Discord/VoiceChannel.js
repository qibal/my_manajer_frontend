// Voice Channel Component
import { useState, useEffect } from "react"
import {
    Volume2,
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
} from "lucide-react"
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

export default function VoiceChannel({ channel }) {
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