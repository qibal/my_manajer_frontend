'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/Shadcn/button';
import { Input } from '@/components/Shadcn/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Shadcn/avatar';
import businessService from '@/service/business_service';
import { useAuth } from '@/hooks/use-auth';
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/Shadcn/alert-dialog";

const BusinessProfile = () => {
    const params = useParams();
    const router = useRouter();
    const { bussiness_id } = params;
    const { user } = useAuth();

    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (!bussiness_id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const businessRes = await businessService.getById(bussiness_id);
                if (businessRes.success) {
                    setBusiness(businessRes.data);
                } else {
                    throw new Error(businessRes.message || "Failed to fetch business data.");
                }
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [bussiness_id]);

    const handleUpdateBusiness = async (e) => {
        e.preventDefault();
        const newName = e.target.name.value;
        if (!business || newName === business.name) return;

        const promise = businessService.update(bussiness_id, { name: newName });

        toast.promise(promise, {
            loading: 'Updating business profile...',
            success: (updatedBusiness) => {
                if(updatedBusiness.success) {
                    setBusiness(updatedBusiness.data);
                    return 'Business profile updated successfully!';
                } else {
                     throw new Error(updatedBusiness.message || "Failed to update business.");
                }
            },
            error: (err) => `Error: ${err.message}`,
        });
    };

    const handleDeleteBusiness = async () => {
        if (!business) return;

        const promise = businessService.remove(bussiness_id);

        toast.promise(promise, {
            loading: `Deleting ${business.name}...`,
            success: () => {
                // After deletion, fetch the remaining businesses to decide the redirect path.
                businessService.getAll().then(res => {
                    const remainingBusinesses = res.data || [];
                    if (remainingBusinesses.length > 0) {
                        router.push(`/${remainingBusinesses[0].id}`);
                    } else {
                        router.push('/me');
                    }
                });
                return 'Business deleted successfully!';
            },
            error: (err) => `Error: ${err.message || 'Failed to delete business.'}`,
        });
    };
    
    if (loading) return <div className="text-center p-8">Loading business profile...</div>;
    if (error) return <div className="text-center p-8 text-destructive">Error: {error}</div>;
    if (!business) return <div className="text-center p-8">No business data found.</div>;

    return (
        <>
            <form onSubmit={handleUpdateBusiness}>
                <h1 className="text-xl font-bold">Business Profile</h1>
                <p className="text-muted-foreground text-sm mt-1">Customize how your business appears in invite links and elsewhere.</p>

                <div className="mt-8 flex flex-col lg:flex-row gap-8">
                    <div className="flex-grow space-y-8">
                        <div>
                            <label htmlFor="name" className="text-xs font-bold uppercase text-muted-foreground">Name</label>
                            <Input id="name" name="name" defaultValue={business.name} className="mt-2 bg-card border-border text-foreground" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase text-muted-foreground">Icon</h3>
                            <p className="text-xs text-muted-foreground mt-1">We recommend an image of at least 512x512.</p>
                            <div className="mt-3 flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={business.avatar || ""} alt={business.name} />
                                    <AvatarFallback>{business.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <Button type="button" variant="secondary">Change Icon</Button>
                                <Button type="button" variant="destructive" className="text-destructive-foreground">Remove Icon</Button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-[300px] flex-shrink-0">
                        <div className="bg-card rounded-lg overflow-hidden border border-border">
                            <div className="h-24 bg-muted bg-cover"></div>
                            <div className="p-4">
                                <Avatar className="-mt-12 h-20 w-20 border-4 border-card">
                                    <AvatarImage src={business.avatar || ""} alt={business.name} />
                                    <AvatarFallback>{business.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <h3 className="font-bold text-lg mt-2">{business.name}</h3>
                                <div className="text-sm text-muted-foreground mt-2">
                                    <p className="text-xs">Owned by: {user?.username}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Est. {new Date(business.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-border flex justify-end">
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>

            <div className="mt-12 pt-6 border-t border-destructive">
                <h2 className="text-lg font-bold text-destructive">Danger Zone</h2>
                <p className="text-muted-foreground text-sm mt-1">
                    Deleting your business is a permanent action and cannot be undone.
                </p>
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="mt-4">
                            Delete this Business
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                <strong className="mx-1">{business.name}</strong>
                                business and all associated data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteBusiness} className="bg-destructive hover:bg-destructive/90">
                                Yes, delete business
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
};

export default function BusinessSettingsPage() {
  return <BusinessProfile />;
}
