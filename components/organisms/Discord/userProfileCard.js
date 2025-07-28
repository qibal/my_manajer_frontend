"use client"
import Link from 'next/link';
import { Mic, Headphones, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Shadcn/avatar";
import { Button } from "@/components/Shadcn/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Shadcn/tooltip";
import { useAuth } from '@/hooks/use-auth';

const getStatusColor = (status) => {
    switch (status) {
        case "active":
            return "bg-green-500";
        case "offline":
            return "bg-gray-500";
        default:
            return "bg-gray-500";
    }
};

export default function UserProfileCard() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="p-2 border-t mt-auto bg-muted/30">
                <div className="flex items-center animate-pulse">
                    <div className="w-9 h-9 bg-gray-700 rounded-full"></div>
                    <div className="ml-2 flex-1 space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-2 border-t mt-auto bg-muted/30">
            <div className="flex items-center">
                <div className="relative">
                    <Avatar className="w-9 h-9">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`}
                    />
                </div>
                <div className="ml-2 flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{user.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
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
                            <Link href={`/user_settings/${user.id}/userprofile`} passHref>
                                <Button variant="ghost" size="icon" className="w-7 h-7">
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </Link>
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