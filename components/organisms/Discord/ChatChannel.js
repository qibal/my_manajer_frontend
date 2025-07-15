// Chat Channel Component

import { useState, useEffect } from "react"
import {
    Pin,
    Send,
    Paperclip,
    Smile,
    ChevronLeft,
    ChevronRight,
    Reply,
    Forward,
    Copy,
    Trash2,
    ThumbsUp,
    Flame,
    Heart,
    Pencil,
    MoreVertical,
    X,
    SmilePlus,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Shadcn/avatar"
import { Button } from "@/components/Shadcn/button"
import { Input } from "@/components/Shadcn/input"
import { ScrollArea } from "@/components/Shadcn/scroll-area"
import { Badge } from "@/components/Shadcn/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/Shadcn/tooltip"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/Shadcn/hover-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Shadcn/tabs"
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from "@/components/Shadcn/context-menu"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/Shadcn/dropdown-menu"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/Shadcn/popover"
import { chatMessages, currentUser } from "@/discord_data_dummy/discordData";
import { formatTime, formatDate } from "@/lib/utils";
import ReadReceipt from "@/components/atoms/ReadReceipt";
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/Shadcn/collapsible";
import ExcalidrawWrapper from '@/components/Excalidraw/excalidraw';
// Updated mock chat messages with new fields

export default function ChatChannel({ channel }) {
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

    const currentUserName = currentUser.name;

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
                                                            ${msg.user === currentUserName ? 'bg-white border-blue-200 text-black' : 'bg-muted border-muted text-foreground'}`}
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
                                                                        {["😀", "😂", "😍", "😎", "😢", "👍", "❤️", "😯", "😢", "🙏"].map(emj => (
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



