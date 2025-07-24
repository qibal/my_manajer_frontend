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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/Shadcn/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/form";
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/Shadcn/collapsible";
import ExcalidrawWrapper from '@/components/Excalidraw/excalidraw';
import ChatChannel from "@/components/organisms/Discord/ChatChannel"
import VoiceChannel from "@/components/organisms/Discord/VoiceChannel"
import DrawChannel from "@/components/organisms/Discord/DrawChannel"
import DocumentChannel from "@/components/organisms/Discord/DocumentChannel"
import DatabaseChannel from "@/components/organisms/Discord/DatabaseChannel"
import ReportChannel from "@/components/organisms/Discord/ReportChannel"
import UserProfileCard from "@/components/organisms/Discord/userProfileCard"
import businessData from "@/discord_data_dummy/businesses.json";
// Menghapus import 'channels' dan 'getChannelIcon' dari discordData
import { getChannelIcon } from "@/lib/utils";
import channelCategoryService from "@/service/channel_category_service";
import channelService from "@/service/channel_service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
    name: z.string().min(1, { message: "Nama channel wajib diisi." }),
    type: z.enum(["messages", "voices", "drawings", "documents", "databases", "reports"], { message: "Tipe channel wajib dipilih." }),
    categoryId: z.string().optional().nullable(), // Tambahkan .nullable()
});

const categoryFormSchema = z.object({
    name: z.string().min(1, { message: "Nama kategori wajib diisi." }),
});

// Komponen terpisah untuk modal Create Channel
function CreateChannelDialog({ businessId, channelCategories, initialCategoryId, onClose, onChannelOrCategoryCreated }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "messages",
            categoryId: initialCategoryId || null, // Ubah menjadi null
        },
        mode: "onChange", // Tambahkan ini
    });

    useEffect(() => {
        form.setValue("categoryId", initialCategoryId || null); // Ubah menjadi null
    }, [initialCategoryId, form]);

    async function onCreateChannelSubmit(values) {
        console.log("🚀 ~ onCreateChannelSubmit ~ values:", values)
        try {
            // Pastikan categoryId dikirim sebagai null jika tidak dipilih
            const payload = { ...values, businessId };
            if (payload.categoryId === "") {
                payload.categoryId = null;
            }
            const newChannel = await channelService.create(payload);
            console.log("Channel baru berhasil ditambahkan:", newChannel);
            onClose(); // Tutup dialog
            form.reset(); // Reset form
            if (onChannelOrCategoryCreated) {
                onChannelOrCategoryCreated();
            }
        } catch (error) {
            console.error("Gagal menambahkan channel:", error);
            form.setError("root.serverError", {
                type: "manual",
                message: "Gagal menambahkan channel. Silakan coba lagi.",
            });
        }
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Buat Channel Baru</DialogTitle>
                <DialogDescription>
                    Isi detail channel baru di sini.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onCreateChannelSubmit)} className="grid gap-4 py-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Channel</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nama Channel Anda" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipe Channel</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih tipe channel" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {["messages", "voices", "drawings", "documents", "databases", "reports"].map(type => {
                                            const Icon = getChannelIcon(type);
                                            return (
                                                <SelectItem key={type} value={type}>
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="w-4 h-4" />
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kategori Channel (Opsional)</FormLabel>
                                {channelCategories.length > 0 ? (
                                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={null}>Tidak Ada Kategori</SelectItem> {/* Ubah value menjadi null */}
                                            {channelCategories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="text-muted-foreground text-sm flex items-center gap-2">
                                        Belum ada kategori. 
                                        <DialogTrigger asChild>
                                            <Button variant="link" className="p-0 h-auto text-primary">
                                                Buat kategori baru?
                                            </Button>
                                        </DialogTrigger>
                                    </div>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {form.formState.errors.root?.serverError && (
                        <p className="text-destructive text-sm text-center">
                            {form.formState.errors.root.serverError.message}
                        </p>
                    )}
                    <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid}>
                        {form.formState.isSubmitting ? "Membuat..." : "Buat Channel"}
                    </Button>
                </form>
            </Form>
        </DialogContent>
    );
}

// Komponen terpisah untuk modal Create Category
function CreateCategoryDialog({ businessId, fetchChannelCategories, onClose, onChannelOrCategoryCreated }) {
    const categoryForm = useForm({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: "",
        },
    });

    async function onCreateCategorySubmit(values) {
        console.log("🚀 ~ onCreateCategorySubmit ~ values:", values)
        try {
            const newCategory = await channelCategoryService.create({ ...values, businessId });
            console.log("Kategori channel baru berhasil ditambahkan:", newCategory);
            await fetchChannelCategories(); // Re-fetch categories after creation
            onClose(); // Tutup dialog
            categoryForm.reset(); // Reset form
            if (onChannelOrCategoryCreated) {
                onChannelOrCategoryCreated();
            }
        } catch (error) {
            console.error("Gagal menambahkan kategori channel:", error);
            categoryForm.setError("root.serverError", {
                type: "manual",
                message: "Gagal menambahkan kategori channel. Silakan coba lagi.",
            });
        }
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Buat Kategori Channel Baru</DialogTitle>
                <DialogDescription>
                    Isi detail kategori channel baru di sini.
                </DialogDescription>
            </DialogHeader>
            <Form {...categoryForm}>
                <form onSubmit={categoryForm.handleSubmit(onCreateCategorySubmit)} className="grid gap-4 py-4">
                    <FormField
                        control={categoryForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Kategori</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nama Kategori Anda" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {categoryForm.formState.errors.root?.serverError && (
                        <p className="text-destructive text-sm text-center">
                            {categoryForm.formState.errors.root.serverError.message}
                        </p>
                    )}
                    <Button type="submit" disabled={categoryForm.formState.isSubmitting}>
                        {categoryForm.formState.isSubmitting ? "Membuat..." : "Buat Kategori"}
                    </Button>
                </form>
            </Form>
        </DialogContent>
    );
}

export default function ChannelSidebar({ selectedBusiness, selectedChannel, setSelectedChannel, groupedChannels, channels, businessList, onChannelOrCategoryCreated }) {
    console.log("ChannelSidebar: businessList prop received", businessList);
    const [channelCategories, setChannelCategories] = useState([]);
    const [isCreateChannelDialogOpen, setIsCreateChannelDialogOpen] = useState(false);
    const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] = useState(false);
    const router = useRouter(); // Initialize useRouter

    const fetchChannelCategories = async () => {
        try {
            const res = await channelCategoryService.getByBusinessId(selectedBusiness);
            if (res && res.data) {
                setChannelCategories(res.data);
            } else {
                setChannelCategories([]);
            }
        } catch (error) {
            console.error("Error fetching channel categories:", error);
            setChannelCategories([]);
        }
    };

    useEffect(() => {
        if (selectedBusiness) {
            fetchChannelCategories();
        } else {
            setChannelCategories([]);
        }
    }, [selectedBusiness]);

    const currentBusinessName = (Array.isArray(businessList) && businessList.length > 0 && selectedBusiness) 
        ? businessList.find((b) => b.id === selectedBusiness)?.name 
        : "Pilih Bisnis";

    // handleChannelClick is no longer needed as Link handles navigation directly
    // const handleChannelClick = (channelId) => {
    //     router.push(`/${selectedBusiness}/${channelId}`); // Navigate to the new channel route
    // };

    return (

        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full bg-muted/20 flex flex-col">
                {/* Business Header */}
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-lg">{currentBusinessName}</h2>
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
                                    <Link href={`/business_settings/${selectedBusiness}`} passHref>
                                        <Button variant="ghost" className="w-full justify-start font-normal">
                                            <Cog className="mr-2 h-4 w-4" />
                                            Business Settings
                                        </Button>
                                    </Link>
                                    <Dialog open={isCreateChannelDialogOpen} onOpenChange={setIsCreateChannelDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start font-normal"
                                            >
                                                <Hash className="mr-2 h-4 w-4" />
                                                Create Channel
                                            </Button>
                                        </DialogTrigger>
                                        <CreateChannelDialog
                                            businessId={selectedBusiness}
                                            channelCategories={channelCategories}
                                            initialCategoryId={null}
                                            onClose={() => setIsCreateChannelDialogOpen(false)}
                                            onChannelOrCategoryCreated={onChannelOrCategoryCreated}
                                        />
                                    </Dialog>
                                    <Dialog open={isCreateCategoryDialogOpen} onOpenChange={setIsCreateCategoryDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start font-normal"
                                            >
                                                <ListTree className="mr-2 h-4 w-4" />
                                                Create Category
                                            </Button>
                                        </DialogTrigger>
                                        <CreateCategoryDialog
                                            businessId={selectedBusiness}
                                            fetchChannelCategories={fetchChannelCategories}
                                            onClose={() => setIsCreateCategoryDialogOpen(false)}
                                            onChannelOrCategoryCreated={onChannelOrCategoryCreated}
                                        />
                                    </Dialog>
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
                        {Object.entries(groupedChannels).length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                <p className="text-muted-foreground text-sm mb-4">Anda belum membuat channel di bisnis ini.</p>
                                <Dialog open={isCreateChannelDialogOpen} onOpenChange={setIsCreateChannelDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="mt-2"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Buat Channel Baru
                                        </Button>
                                    </DialogTrigger>
                                    <CreateChannelDialog
                                        businessId={selectedBusiness}
                                        channelCategories={channelCategories}
                                        initialCategoryId={null}
                                        onClose={() => setIsCreateChannelDialogOpen(false)}
                                        onChannelOrCategoryCreated={onChannelOrCategoryCreated}
                                    />
                                </Dialog>
                            </div>
                        ) : (
                            Object.entries(groupedChannels).map(([category, channelsInCategory]) => (
                                <Collapsible key={category} defaultOpen={true} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs font-bold uppercase text-muted-foreground hover:text-foreground px-1">
                                        <CollapsibleTrigger className="flex items-center flex-1 gap-1 py-1">
                                            <ChevronDown className="h-3 w-3 transition-transform duration-200 data-[state=closed]:-rotate-90" />
                                            <span className="flex-1 text-left">{category === '__NO_CATEGORY__' ? '' : category}</span>
                                        </CollapsibleTrigger>
                                        {category !== '__NO_CATEGORY__' && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-5 w-5"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <CreateChannelDialog
                                                            businessId={selectedBusiness}
                                                            channelCategories={channelCategories}
                                                            initialCategoryId={channelsInCategory[0]?.categoryId || null}
                                                            onClose={() => setIsCreateChannelDialogOpen(false)}
                                                            onChannelOrCategoryCreated={onChannelOrCategoryCreated}
                                                        />
                                                    </Dialog>
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="p-1.5 text-xs"><p>Create Channel</p></TooltipContent>
                                            </Tooltip>
                                        )}
                                    </div>
                                    <CollapsibleContent className="space-y-0.5 pl-2">
                                        {channelsInCategory.map((channel) => {
                                            const Icon = getChannelIcon(channel.type);
                                            const isActive = selectedChannel === channel.id;
                                            return (
                                                <Link 
                                                    key={channel.id} 
                                                    href={`/${selectedBusiness}/${channel.id}`} 
                                                    passHref
                                                    className={`group w-full flex justify-start items-center p-1.5 rounded-md cursor-pointer ${isActive
                                                        ? "bg-accent text-accent-foreground"
                                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                    }`}
                                                >
                                                    <Icon className="w-5 h-5 mx-1" />
                                                    <span className="truncate flex-1 text-left font-medium text-sm">{channel.name}</span>
                                                    <div className={`flex items-center ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Link href={`/${selectedBusiness}/settings/channel/${channel.id}`} passHref>
                                                                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted"><Cog className="h-4 w-4" /></Button>
                                                                </Link>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top" className="p-1.5 text-xs"><p>Edit Channel</p></TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </CollapsibleContent>
                                </Collapsible>
                            ))
                        )}
                    </div>
                </ScrollArea>

                <UserProfileCard />
            </div>
        </ResizablePanel>

    )
}