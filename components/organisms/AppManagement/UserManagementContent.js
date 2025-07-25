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
  DropdownMenuLabel,
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


// Skema validasi untuk form create user
const createUserFormSchema = z.object({
    username: z.string().min(3, { message: 'Username minimal 3 karakter.' }),
    email: z.string().email({ message: 'Email tidak valid.' }).optional().or(z.literal('')),
    password: z.string().min(8, { message: 'Password minimal 8 karakter.' })
        .refine(value => /[a-z]/.test(value), { message: 'Password harus mengandung huruf kecil.' })
        .refine(value => /[A-Z]/.test(value), { message: 'Password harus mengandung huruf besar.' })
        .refine(value => /[0-9]/.test(value), { message: 'Password harus mengandung angka.' }),
    avatar: z.any().optional(),
});

// Skema validasi untuk form edit user
const editUserFormSchema = z.object({
    username: z.string().min(3, { message: 'Username minimal 3 karakter.' }),
    email: z.string().email({ message: 'Email tidak valid.' }).optional().or(z.literal('')),
    isActive: z.boolean(),
    avatar: z.any().optional(),
});


// Komponen untuk validasi password
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
            <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`transition-all duration-300 ${strengthColor}`} style={{ width: `${(strength / 4) * 100}%` }}></div>
            </div>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                <li className={checks.length ? 'text-green-600' : ''}>Minimal 8 karakter</li>
                <li className={checks.lowercase ? 'text-green-600' : ''}>Satu huruf kecil</li>
                <li className={checks.uppercase ? 'text-green-600' : ''}>Satu huruf besar</li>
                <li className={checks.digit ? 'text-green-600' : ''}>Satu angka</li>
            </ul>
        </div>
    );
};


export default function UserManagementContent() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // States for dialogs
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    const [selectedUser, setSelectedUser] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    // Form hooks
    const createForm = useForm({
        resolver: zodResolver(createUserFormSchema),
        defaultValues: { username: '', email: '', password: '', avatar: null },
    });
    
    const editForm = useForm({
        resolver: zodResolver(editUserFormSchema),
        defaultValues: { username: '', email: '', isActive: true, avatar: null },
    });
    
    const passwordToWatch = createForm.watch('password', '');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Gagal memuat pengguna.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (values) => {
        try {
            await userService.createUser({
                username: values.username,
                email: values.email,
                password: values.password,
                avatar: values.avatar,
            });
            toast.success('Pengguna berhasil dibuat!');
            setIsCreateDialogOpen(false);
            fetchUsers();
        } catch (err) {
            createForm.setError('root', { message: err.message || 'Gagal membuat pengguna.' });
        }
    };

    const handleUpdateUser = async (values) => {
        if (!selectedUser) return;
        try {
            await userService.updateUser(selectedUser.id, {
                username: values.username,
                email: values.email,
                isActive: values.isActive,
                avatar: values.avatar,
            });
            toast.success('Pengguna berhasil diperbarui!');
            setIsEditDialogOpen(false);
            fetchUsers();
        } catch (err) {
            editForm.setError('root', { message: err.message || 'Gagal memperbarui pengguna.' });
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        try {
            await userService.deleteUser(selectedUser.id);
            toast.success('Pengguna berhasil dihapus.');
            setIsDeleteDialogOpen(false);
            fetchUsers();
        } catch (err) {
            toast.error(err.message || 'Gagal menghapus pengguna.');
            setIsDeleteDialogOpen(false);
        }
    };

    const handleToggleActive = async (user) => {
        try {
            await userService.updateUser(user.id, { isActive: !user.isActive });
            toast.success(`Pengguna ${user.username} berhasil ${user.isActive ? 'nonaktifkan' : 'aktifkan'}!`);
            fetchUsers();
        } catch (err) {
            toast.error(err.message || `Gagal ${user.isActive ? 'nonaktifkan' : 'aktifkan'} pengguna.`);
        }
    };

    const openEditDialog = (user) => {
        setSelectedUser(user);
        editForm.reset({
            username: user.username,
            email: user.email,
            isActive: user.isActive,
            avatar: null,
        });
        setAvatarPreview(user.avatar || null);
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
                    <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
                    <p className="text-gray-600 mt-1">Kelola semua pengguna aplikasi Anda di sini.</p>
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
                               <FormField
                                    control={createForm.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="cth: john.doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={createForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email (Opsional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="cth: john.doe@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                               <FormField
                                    control={createForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            <PasswordStrengthIndicator password={passwordToWatch} />
                                        </FormItem>
                                    )}
                                />
                                {createForm.formState.errors.root && (
                                    <p className="text-sm font-medium text-destructive">{createForm.formState.errors.root.message}</p>
                                )}
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
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pengguna</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal Dibuat</TableHead>
                            <TableHead><span className="sr-only">Aksi</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-10 w-10">
                                            <Image
                                                src={user.profilePictureUrl || '/default-avatar.png'}
                                                alt={`${user.name}'s profile picture`}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-full"
                                            />
                                        </div>
                                        <div className="font-medium">{user.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                                <TableCell>
                                    {Object.entries(user.roles || {}).flatMap(([system, roleList]) => 
                                        roleList.map(role => (
                                            <Badge key={`${system}-${role}`} variant="secondary">{role}</Badge>
                                        ))
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.isActive ? 'default' : 'destructive'}>
                                        {user.isActive ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{formatIndonesianDate(user.createdAt)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)}>
                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 ml-2">
                                                <span className="sr-only">Buka menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align="end" className="w-auto p-2">
                                            <div className="flex flex-col space-y-1">
                                                <Button variant="ghost" size="sm" className="justify-start" onClick={() => handleToggleActive(user)}>
                                                    {user.isActive ? <PowerOff className="mr-2 h-4 w-4" /> : <Power className="mr-2 h-4 w-4" />}
                                                    {user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                                                </Button>
                                                <Button variant="ghost" size="sm" className="justify-start text-red-600 hover:text-red-700" onClick={() => openDeleteDialog(user)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Edit User Dialog */}
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
                           <FormField
                                control={editForm.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="cth: john.doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="cth: john.doe@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Status Akun</FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                Aktifkan atau nonaktifkan akun pengguna ini.
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="avatar"
                                render={({ field }) => (
                                     <FormItem>
                                        <FormLabel>Avatar</FormLabel>
                                        <FormControl>
                                            <Input type="file" accept="image/*" onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    field.onChange(file);
                                                    setAvatarPreview(URL.createObjectURL(file));
                                                }
                                            }} />
                                        </FormControl>
                                         {avatarPreview && <Image src={avatarPreview} alt="Avatar Preview" className="mt-2 h-20 w-20 rounded-full object-cover" />}
                                    </FormItem>
                                )}
                            />
                            {editForm.formState.errors.root && (
                                <p className="text-sm font-medium text-destructive">{editForm.formState.errors.root.message}</p>
                            )}
                            <DialogFooter>
                                <Button type="submit" disabled={editForm.formState.isSubmitting}>
                                    {editForm.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Dialog Konfirmasi Hapus */}
             <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Anda yakin ingin menghapus pengguna ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Aksi ini tidak dapat dibatalkan. Ini akan menghapus pengguna secara permanen.
                            <br/>
                            <strong>{selectedUser?.username}</strong>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
