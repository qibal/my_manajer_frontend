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
            <p className="text-xl font-semibold text-muted-foreground">Masih di kembangkan</p>
        </div>
    )
}