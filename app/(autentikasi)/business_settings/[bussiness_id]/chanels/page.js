'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/Shadcn/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Shadcn/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from '@/components/Shadcn/dialog';
import { Input } from '@/components/Shadcn/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Shadcn/select';
import { PlusCircle, MoreHorizontal, Edit, Trash } from 'lucide-react';
import channelService from '@/service/channel_service';
import channelCategoryService from '@/service/channel_category_service';
import { getChannelIcon } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/Shadcn/dropdown-menu"
import { toast } from 'sonner';

const ChannelManagementPage = () => {
    const params = useParams();
    const { bussiness_id } = params;

    const [channels, setChannels] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [editingChannel, setEditingChannel] = useState(null);
    const [channelToDelete, setChannelToDelete] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [channelsRes, categoriesRes] = await Promise.all([
                channelService.getByBusinessId(bussiness_id),
                channelCategoryService.getByBusinessId(bussiness_id)
            ]);

            setChannels(channelsRes.data || []);
            setCategories(categoriesRes.data || []);
        } catch (err) {
            setError(err.message);
            toast.error("Failed to fetch data", { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bussiness_id) {
            fetchData();
        }
    }, [bussiness_id]);

    const handleOpenForm = (channel = null) => {
        setEditingChannel(channel);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setEditingChannel(null);
        setIsFormOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            type: formData.get('type'),
            categoryId: formData.get('categoryId') || null,
            businessId: bussiness_id,
        };

        const promise = editingChannel 
            ? channelService.update(editingChannel.id, data) 
            : channelService.create(data);

        toast.promise(promise, {
            loading: `Saving channel...`,
            success: () => {
                fetchData(); // Re-fetch data to get the latest state
                handleCloseForm();
                return `Channel ${editingChannel ? 'updated' : 'created'} successfully!`;
            },
            error: (err) => `Error: ${err.message}`,
        });
    };

    const openDeleteConfirm = (channel) => {
        setChannelToDelete(channel);
        setIsDeleteConfirmOpen(true);
    };
    
    const handleDelete = async () => {
        if (!channelToDelete) return;

        const promise = channelService.remove(channelToDelete.id);

        toast.promise(promise, {
             loading: `Deleting ${channelToDelete.name}...`,
             success: () => {
                fetchData(); // Re-fetch
                setIsDeleteConfirmOpen(false);
                setChannelToDelete(null);
                return `Channel deleted successfully!`;
             },
             error: (err) => `Error: ${err.message}`,
        });
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Uncategorized';
    };

    if (loading) return <div className="text-center p-8">Loading channels...</div>;
    if (error) return <div className="text-center p-8 text-destructive">Error: {error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Channels</h1>
                <Button onClick={() => handleOpenForm()}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Channel
                </Button>
            </div>
            
            <div className="bg-card rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[400px]">Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {channels.length > 0 ? channels.map((channel) => {
                            const Icon = getChannelIcon(channel.type);
                            return (
                                <TableRow key={channel.id} className="border-t">
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Icon className="h-5 w-5 text-muted-foreground" />
                                        {channel.name}
                                    </TableCell>
                                    <TableCell>{channel.type}</TableCell>
                                    <TableCell>{getCategoryName(channel.categoryId)}</TableCell>
                                    <TableCell className="text-right">
                                       <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenForm(channel)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openDeleteConfirm(channel)} className="text-red-500 focus:text-red-400">
                                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        }) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">No channels found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            
            {/* Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="bg-card text-foreground border-border">
                    <DialogHeader>
                        <DialogTitle>{editingChannel ? 'Edit Channel' : 'Create Channel'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">Channel Name</label>
                            <Input id="name" name="name" defaultValue={editingChannel?.name || ''} className="bg-background" required />
                        </div>
                        <div>
                           <label htmlFor="type" className="block text-sm font-medium mb-1">Channel Type</label>
                           <Select name="type" defaultValue={editingChannel?.type || 'messages'}>
                                <SelectTrigger className="w-full bg-background">
                                    <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["messages", "voices", "documents", "drawings", "databases", "reports"].map(type => (
                                        <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div>
                            <label htmlFor="categoryId" className="block text-sm font-medium mb-1">Category (Optional)</label>
                           <Select name="categoryId" defaultValue={editingChannel?.categoryId || ''}>
                                <SelectTrigger className="w-full bg-background">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Uncategorized</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={handleCloseForm}>Cancel</Button>
                            <Button type="submit">{editingChannel ? 'Save Changes' : 'Create'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="bg-card text-foreground border-border">
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This will permanently delete the channel <span className="font-bold">{channelToDelete?.name}</span>. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ChannelManagementPage;
