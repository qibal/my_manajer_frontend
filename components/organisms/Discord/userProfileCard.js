"use client"
import { useState, useEffect } from "react"
import {
    Mic,
    Headphones,
    Settings,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Shadcn/avatar"
import { Button } from "@/components/Shadcn/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/Shadcn/tooltip"
import { currentUser, getStatusColor } from "@/discord_data_dummy/discordData";

export default function UserProfileCard() {
    return (
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
}