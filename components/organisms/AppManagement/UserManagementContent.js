'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { formatIndonesianDate } from "@/lib/utils";
import { toast } from "sonner";
import Image from 'next/image';

import userService from '@/service/user_service';
import roleService from '@/service/role_service'; // Import role service

// Shadcn UI Components
import { Button } from '@/components/Shadcn/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/Shadcn/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/Shadcn/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Shadcn/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/Shadcn/alert-dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/Shadcn/form"
import { Input } from '@/components/Shadcn/input';
import { Switch } from '@/components/Shadcn/switch';
import { Badge } from '@/components/Shadcn/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Shadcn/avatar"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Shadcn/popover';

const createUserFormSchema = z.object({
    username: z.string().min(3, { message: 'Username minimal 3 karakter.' }),
    email: z.string().email({ message: 'Email tidak valid.' }).optional().or(z.literal('')),
    password: z.string().min(8, { message: 'Password minimal 8 karakter.' })
        .refine(value => /[a-z]/.test(value), { message: 'Password harus mengandung huruf kecil.' })
        .refine(value => /[A-Z]/.test(value), { message: 'Password harus mengandung huruf besar.' })
        .refine(value => /[0-9]/.test(value), { message: 'Password harus mengandung angka.' }),
});

const editUserFormSchema = z.object({
    username: z.string().min(3, { message: 'Username minimal 3 karakter.' }),
    email: z.string().email({ message: 'Email tidak valid.' }).optional().or(z.literal('')),
    isActive: z.boolean(),
});

const PasswordStrengthIndicator = ({ password }) => {
    const checks = useMemo(() => ({
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        digit: /[0-9]/.test(password),
    }), [password]);

    const strength = Object.values(checks).filter(Boolean).length;
    const strengthColor = ['bg-gray-300', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'][strength];

    return (
        <div className="mt-2">
            <div className="flex w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className={`transition-all duration-300 ${strengthColor}`} style={{ width: `${(strength / 4) * 100}%` }}></div>
            </div>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                <li className={checks.length ? 'text-primary' : ''}>Minimal 8 karakter</li>
                <li className={checks.lowercase ? 'text-primary' : ''}>Satu huruf kecil</li>
                <li className={checks.uppercase ? 'text-primary' : ''}>Satu huruf besar</li>
                <li className={checks.digit ? 'text-primary' : ''}>Satu angka</li>
            </ul>
        </div>
    );
};

export default function UserManagementContent() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]); // State for roles
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    const [selectedUser, setSelectedUser] = useState(null);

    const createForm = useForm({
        resolver: zodResolver(createUserFormSchema),
        defaultValues: { username: '', email: '', password: '' },
    });
    
    const editForm = useForm({
        resolver: zodResolver(editUserFormSchema),
        defaultValues: { username: '', email: '', isActive: true },
    });
    
    const passwordToWatch = createForm.watch('password', '');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersData, rolesData] = await Promise.all([
                userService.getUsers(),
                roleService.getAll()
            ]);
            setUsers(usersData || []);
            setRoles(rolesData || []);
            setError(null);
        } catch (err) {
            setError(err.message || 'Gagal memuat data.');
            toast.error("Gagal memuat data", { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateUser = async (values) => {
        const promise = userService.createUser(values);
        toast.promise(promise, {
            loading: 'Membuat pengguna baru...',
            success: () => {
                fetchData();
                setIsCreateDialogOpen(false);
                return 'Pengguna berhasil dibuat!';
            },
            error: (err) => `Error: ${err.message}`,
        });
    };

    const handleUpdateUser = async (values) => {
        if (!selectedUser) return;
        const promise = userService.updateUser(selectedUser.id, values);
        toast.promise(promise, {
            loading: 'Memperbarui pengguna...',
            success: () => {
                fetchData();
                setIsEditDialogOpen(false);
                return 'Pengguna berhasil diperbarui!';
            },
            error: (err) => `Error: ${err.message}`,
        });
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        const promise = userService.deleteUser(selectedUser.id);
        toast.promise(promise, {
            loading: `Menghapus ${selectedUser.username}...`,
            success: () => {
                fetchData();
                setIsDeleteDialogOpen(false);
                return 'Pengguna berhasil dihapus.';
            },
            error: (err) => `Error: ${err.message}`,
        });
    };

    const handleToggleActive = async (user) => {
        const promise = userService.updateUser(user.id, { isActive: !user.isActive });
        toast.promise(promise, {
            loading: `Mengubah status ${user.username}...`,
            success: () => {
                fetchData();
                return `Status ${user.username} berhasil diubah.`;
            },
            error: (err) => `Error: ${err.message}`,
        });
    };

    const openEditDialog = (user) => {
        setSelectedUser(user);
        editForm.reset({
            username: user.username,
            email: user.email,
            isActive: user.isActive,
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (user) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Manajemen Pengguna</h1>
                    <p className="text-muted-foreground mt-1">Kelola semua pengguna aplikasi Anda di sini.</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => createForm.reset()}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Buat Pengguna Baru
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Buat Pengguna Baru</DialogTitle>
                            <DialogDescription>
                                Isi detail di bawah ini untuk membuat akun pengguna baru.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...createForm}>
                            <form onSubmit={createForm.handleSubmit(handleCreateUser)} className="space-y-4">
                               <FormField control={createForm.control} name="username" render={({ field }) => (
                                    <FormItem><FormLabel>Username</FormLabel><FormControl><Input placeholder="cth: john.doe" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={createForm.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Email (Opsional)</FormLabel><FormControl><Input placeholder="cth: john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                               <FormField control={createForm.control} name="password" render={({ field }) => (
                                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /><PasswordStrengthIndicator password={passwordToWatch} /></FormItem>
                                )}/>
                                <DialogFooter>
                                    <Button type="submit" disabled={createForm.formState.isSubmitting}>
                                        {createForm.formState.isSubmitting ? 'Menyimpan...' : 'Simpan'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading && <p>Memuat data pengguna...</p>}
            {error && <p className="text-destructive">{error}</p>}
            {!loading && !error && (
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal Dibuat</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => {
                            const userRoles = Object.values(user.roles || {}).flat();
                            const roleNames = userRoles.map(roleId => {
                                const role = roles.find(r => r.id === roleId);
                                return role ? role.name : roleId;
                            });

                            return (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.avatar || ''} />
                                                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.username}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{user.email || '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {roleNames.length > 0 ? (
                                                roleNames.map(name => (
                                                    <Badge key={name} variant="secondary">{name.replace(/_/g, ' ')}</Badge>
                                                ))
                                            ) : (
                                                <span className="text-xs text-muted-foreground">No roles</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                    <Badge variant={user.isActive ? 'default' : 'destructive'}>
                                        {user.isActive ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{formatIndonesianDate(user.createdAt)}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Buka menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                             <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                             <DropdownMenuItem onClick={() => handleToggleActive(user)}>
                                                {user.isActive ? <PowerOff className="mr-2 h-4 w-4" /> : <Power className="mr-2 h-4 w-4" />}
                                                {user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                                            </DropdownMenuItem>
                                             <DropdownMenuItem onClick={() => openDeleteDialog(user)} className="text-destructive focus:text-destructive-foreground">
                                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
            )}

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Pengguna: {selectedUser?.username}</DialogTitle>
                        <DialogDescription>
                            Perbarui detail pengguna di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                     <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(handleUpdateUser)} className="space-y-4">
                           <FormField control={editForm.control} name="username" render={({ field }) => (
                                <FormItem><FormLabel>Username</FormLabel><FormControl><Input placeholder="cth: john.doe" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={editForm.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="cth: john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={editForm.control} name="isActive" render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5"><FormLabel>Status Akun</FormLabel><p className="text-sm text-muted-foreground">Aktifkan atau nonaktifkan akun.</p></div>
                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </FormItem>
                            )}/>
                            <DialogFooter>
                                <Button type="submit" disabled={editForm.formState.isSubmitting}>
                                    {editForm.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

             <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Anda yakin ingin menghapus pengguna ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Aksi ini tidak dapat dibatalkan. Ini akan menghapus pengguna <strong>{selectedUser?.username}</strong> secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
