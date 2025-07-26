'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/Shadcn/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Shadcn/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/Shadcn/dialog';
import { Input } from '@/components/Shadcn/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Shadcn/avatar';
import { MoreHorizontal, Trash, UserPlus, ShieldPlus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/Shadcn/dropdown-menu"
import userService from '@/service/user_service';
import roleService from '@/service/role_service';
import { toast } from 'sonner';
import { Checkbox } from '@/components/Shadcn/checkbox';

const MemberManagementPage = () => {
    const params = useParams();
    const { bussiness_id } = params;

    const [members, setMembers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isManageRolesOpen, setIsManageRolesOpen] = useState(false);
    
    const [memberToManage, setMemberToManage] = useState(null);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState(new Set());
    
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, rolesRes] = await Promise.all([
                userService.getUsers(),
                roleService.getAll()
            ]);

            const fetchedUsers = usersRes || [];
            setAllUsers(fetchedUsers);
            
            const businessMembers = fetchedUsers.filter(u => u.businessIds?.includes(bussiness_id));
            setMembers(businessMembers);

            // Safely access data, defaulting to an empty array.
            const allRoles = rolesRes?.data || [];
            const businessRoles = allRoles.filter(r => r.businessId === bussiness_id);
            setRoles(businessRoles);

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

    const potentialMembers = useMemo(() => {
        const memberIds = new Set(members.map(m => m.id));
        return allUsers.filter(user => !memberIds.has(user.id));
    }, [allUsers, members]);

    const filteredPotentialMembers = useMemo(() => {
        if (!searchTerm) return potentialMembers;
        return potentialMembers.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, potentialMembers]);
    
    const handleAddMember = async (userToAdd) => {
        const updatedBusinessIds = [...(userToAdd.businessIds || []), bussiness_id];
        const promise = userService.updateUser(userToAdd.id, { businessIds: updatedBusinessIds });
        
        toast.promise(promise, {
            loading: `Adding ${userToAdd.username}...`,
            success: (res) => {
                fetchData();
                return `${userToAdd.username} has been added to the business.`;
            },
            error: (err) => `Error: ${err.message}`,
        });
    };
    
    const openDeleteConfirm = (member) => {
        setMemberToDelete(member);
        setIsDeleteConfirmOpen(true);
    };

    const handleRemoveMember = async () => {
        if (!memberToDelete) return;

        const updatedBusinessIds = memberToDelete.businessIds.filter(id => id !== bussiness_id);
        const promise = userService.updateUser(memberToDelete.id, { businessIds: updatedBusinessIds });

        toast.promise(promise, {
            loading: `Removing ${memberToDelete.username}...`,
            success: (res) => {
                fetchData();
                setIsDeleteConfirmOpen(false);
                setMemberToDelete(null);
                return `${memberToDelete.username} has been removed.`;
            },
            error: (err) => `Error: ${err.message}`,
        });
    };

    const openManageRoles = (member) => {
        setMemberToManage(member);
        const currentRoles = new Set(member.roles?.[bussiness_id] || []);
        setSelectedRoles(currentRoles);
        setIsManageRolesOpen(true);
    };

    const handleRoleSelection = (roleId) => {
        setSelectedRoles(prev => {
            const newRoles = new Set(prev);
            if (newRoles.has(roleId)) {
                newRoles.delete(roleId);
            } else {
                newRoles.add(roleId);
            }
            return newRoles;
        });
    };

    const handleSaveRoles = async () => {
        if (!memberToManage) return;

        const updatedRoles = {
            ...memberToManage.roles,
            [bussiness_id]: Array.from(selectedRoles),
        };
        
        const promise = userService.updateUser(memberToManage.id, { roles: updatedRoles });

        toast.promise(promise, {
            loading: `Updating roles for ${memberToManage.username}...`,
            success: () => {
                fetchData();
                setIsManageRolesOpen(false);
                setMemberToManage(null);
                return `Roles updated successfully!`;
            },
            error: (err) => `Error: ${err.message}`,
        });
    };

    const getMemberRoles = (member) => {
        const memberRoleIds = member.roles?.[bussiness_id];
        if (!memberRoleIds || memberRoleIds.length === 0) return "No roles";
        
        const roleNames = memberRoleIds
            .map(roleId => roles.find(r => r.id === roleId)?.name)
            .filter(Boolean);
            
        return roleNames.length > 0 ? roleNames.join(', ') : "No roles";
    }

    if (loading) return <div className="text-center p-8">Loading members...</div>;
    if (error) return <div className="text-center p-8 text-destructive">Error: {error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Members ({members.length})</h1>
                <Button onClick={() => setIsAddMemberOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Member
                </Button>
            </div>

            <div className="bg-card rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.length > 0 ? members.map((member) => (
                            <TableRow key={member.id} className="border-t">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={member.avatar || ''} />
                                            <AvatarFallback>{member.username.substring(0,2)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{member.username}</p>
                                            <p className="text-sm text-muted-foreground">{member.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-muted-foreground">{getMemberRoles(member)}</span> 
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => openManageRoles(member)}>
                                                <ShieldPlus className="mr-2 h-4 w-4"/> Manage Roles
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => openDeleteConfirm(member)} className="text-destructive focus:text-destructive-foreground">
                                                <Trash className="mr-2 h-4 w-4"/> Remove Member
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )) : (
                             <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">No members found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add Member Dialog */}
            <Dialog open={isAddMemberOpen} onOpenChange={(isOpen) => {
                setIsAddMemberOpen(isOpen);
                if (!isOpen) setSearchTerm('');
            }}>
                <DialogContent className="bg-card text-foreground border-border">
                    <DialogHeader><DialogTitle>Add New Member</DialogTitle></DialogHeader>
                    <Input 
                        placeholder="Filter users by username or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-background"
                    />
                    <div className="mt-4 max-h-60 overflow-y-auto space-y-2 p-1">
                        {filteredPotentialMembers.length > 0 ? filteredPotentialMembers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={user.avatar || ''} />
                                        <AvatarFallback>{user.username.substring(0,2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p>{user.username}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                                <Button size="sm" onClick={() => handleAddMember(user)}>Add</Button>
                            </div>
                        )) : (
                            <p className="text-center text-muted-foreground p-4">No users available to add.</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            
            {/* Manage Roles Dialog */}
            <Dialog open={isManageRolesOpen} onOpenChange={setIsManageRolesOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Roles for {memberToManage?.username}</DialogTitle>
                        <DialogDescription>Select the roles to assign to this member.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-4">
                        {roles.map(role => (
                            <div key={role.id} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={role.id}
                                    checked={selectedRoles.has(role.id)}
                                    onCheckedChange={() => handleRoleSelection(role.id)}
                                />
                                <label htmlFor={role.id} className="text-sm font-medium leading-none">
                                    {role.name}
                                </label>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsManageRolesOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveRoles}>Save Roles</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                 <DialogContent className="bg-card text-foreground border-border">
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                             This will remove <span className="font-bold">{memberToDelete?.username}</span> from the business. They will lose access.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleRemoveMember}>Remove Member</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MemberManagementPage;
