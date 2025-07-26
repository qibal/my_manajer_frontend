'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/Shadcn/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Shadcn/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/Shadcn/dialog';
import { Input } from '@/components/Shadcn/input';
import { PlusCircle, MoreHorizontal, Edit, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/Shadcn/dropdown-menu"
import roleService from '@/service/role_service';
import { Checkbox } from '@/components/Shadcn/checkbox';
import { toast } from 'sonner';

const availablePermissions = {
    channels: ["create", "read", "update", "delete"],
    members: ["invite", "kick", "ban"],
    roles: ["create", "update", "delete", "assign"],
    messages: ["read_history", "send", "delete_own", "delete_any"],
};

const RoleManagementPage = () => {
    const params = useParams();
    const { bussiness_id } = params;

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [currentPermissions, setCurrentPermissions] = useState({});
    
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await roleService.getAll();
            // Safely access data, defaulting to an empty array if res is falsy or res.data is falsy.
            const allRoles = res?.data || [];
            const businessRoles = allRoles.filter(role => role.businessId === bussiness_id);
            setRoles(businessRoles);
        } catch (err) {
            setError(err.message);
            toast.error("Failed to fetch roles", { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bussiness_id) {
           fetchData();
        }
    }, [bussiness_id]);

    const handlePermissionChange = (category, permission) => {
        setCurrentPermissions(prev => {
            const categoryPermissions = prev[category] || [];
            const newPermissions = categoryPermissions.includes(permission)
                ? categoryPermissions.filter(p => p !== permission)
                : [...categoryPermissions, permission];
            return { ...prev, [category]: newPermissions };
        });
    };
    
    const handleOpenForm = (role = null) => {
        setEditingRole(role);
        setCurrentPermissions(role?.permissions || {});
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setEditingRole(null);
        setIsFormOpen(false);
        setCurrentPermissions({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const roleName = e.target.name.value;
        const data = { name: roleName, businessId: bussiness_id, permissions: currentPermissions };

        const promise = editingRole ? roleService.update(editingRole.id, data) : roleService.create(data);

        toast.promise(promise, {
            loading: `Saving role...`,
            success: () => {
                fetchData();
                handleCloseForm();
                return `Role ${editingRole ? 'updated' : 'created'} successfully!`;
            },
            error: (err) => `Error: ${err.message}`,
        });
    };
    
    const openDeleteConfirm = (role) => {
        setRoleToDelete(role);
        setIsDeleteConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!roleToDelete) return;

        const promise = roleService.remove(roleToDelete.id);

        toast.promise(promise, {
            loading: `Deleting ${roleToDelete.name}...`,
            success: () => {
                fetchData();
                setIsDeleteConfirmOpen(false);
                setRoleToDelete(null);
                return 'Role deleted successfully!';
            },
            error: (err) => `Error: ${err.message}`,
        });
    };

    if (loading) return <div className="text-center p-8">Loading roles...</div>;
    if (error) return <div className="text-center p-8 text-destructive">Error: {error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Roles</h1>
                <Button onClick={() => handleOpenForm()}><PlusCircle className="mr-2 h-4 w-4" />Create Role</Button>
            </div>
            <div className="bg-card rounded-lg border">
                <Table>
                    <TableHeader><TableRow><TableHead>Role Name</TableHead><TableHead>Permissions Summary</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {roles.length > 0 ? roles.map(role => (
                            <TableRow key={role.id} className="border-t">
                                <TableCell className="font-medium">{role.name}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {Object.values(role.permissions || {}).flat().length} permissions granted
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleOpenForm(role)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => openDeleteConfirm(role)} className="text-destructive focus:text-destructive-foreground"><Trash className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">No roles created yet.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="bg-card text-foreground border-border max-w-2xl">
                    <DialogHeader><DialogTitle>{editingRole ? 'Edit Role' : 'Create Role'}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium mb-1">Role Name</label>
                            <Input id="name" name="name" defaultValue={editingRole?.name} required className="bg-background"/>
                        </div>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                            <h3 className="font-semibold">Permissions</h3>
                            {Object.entries(availablePermissions).map(([category, perms]) => (
                                <div key={category}>
                                    <h4 className="font-medium capitalize mb-2 border-b border-border pb-1">{category}</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                        {perms.map(perm => (
                                            <div key={perm} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`${category}-${perm}`}
                                                    checked={currentPermissions[category]?.includes(perm) || false}
                                                    onCheckedChange={() => handlePermissionChange(category, perm)}
                                                />
                                                <label htmlFor={`${category}-${perm}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    {perm.replace(/_/g, ' ')}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <DialogFooter className="pt-6">
                            <Button type="button" variant="ghost" onClick={handleCloseForm}>Cancel</Button>
                            <Button type="submit">{editingRole ? 'Save Changes' : 'Create'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="bg-card text-foreground border-border">
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This will permanently delete the role <span className="font-bold">{roleToDelete?.name}</span>. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete Role</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RoleManagementPage;
