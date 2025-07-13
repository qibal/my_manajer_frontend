"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { MoreHorizontal, ChevronDown, PlusCircle, LayoutList, TableProperties } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/Shadcn/button';
import { Input } from '@/components/Shadcn/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/Shadcn/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Shadcn/dropdown-menu";
import { Checkbox } from "@/components/Shadcn/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Shadcn/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/Shadcn/dialog";
import { Label } from "@/components/Shadcn/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/Shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Shadcn/select';

import usersData from '@/data_dummy/dashboard/user.json';
import rolesData from '@/data_dummy/dashboard/role.json';

const USERS_PER_PAGE = 5;

// Component for User Card
const UserCard = ({ user, columnVisibility }) => (
    <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-2">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>@{user.username}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
            {columnVisibility.email && <p className="mb-1"><strong>Email:</strong> {user.email}</p>}
            {columnVisibility.phoneNumber && <p className="mb-1"><strong>Phone:</strong> {user.phoneNumber}</p>}
            {columnVisibility.status && <p className="mb-1"><strong>Status:</strong> {user.status}</p>}
            {columnVisibility.role && <p className="mb-1"><strong>Role:</strong> {user.roleName}</p>}
        </CardContent>
        <CardFooter className="flex justify-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                        Actions <MoreHorizontal className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </CardFooter>
    </Card>
);


export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [columnVisibility, setColumnVisibility] = useState({
    email: true,
    phoneNumber: true,
    status: true,
    role: true,
    actions: true,
  });

  useEffect(() => {
    // Create a map of roleId to role name for easy lookup
    const rolesMap = new Map(rolesData.map(role => [role.id, role.name]));
    // Add roleName to each user
    const usersWithRoles = usersData.map(user => ({
      ...user,
      roleName: rolesMap.get(user.roleId) || 'Unknown Role'
    }));
    setUsers(usersWithRoles);
    setRoles(rolesData);
  }, []);

  const filteredUsers = useMemo(() => {
    return users
      .filter(user =>
        (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .filter(user => statusFilter === 'All' || user.status === statusFilter)
      .filter(user => roleFilter === 'All' || user.roleId === roleFilter);
  }, [users, searchTerm, statusFilter, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage]);

  const handleSelectAll = (checked) => {
    if (checked) {
      const allUserIds = new Set(paginatedUsers.map(u => u.id));
      setSelectedRows(allUserIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (userId) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedRows(newSelection);
  };

  const isAllSelected = selectedRows.size > 0 && selectedRows.size === paginatedUsers.length;
  const isSomeSelected = selectedRows.size > 0 && selectedRows.size < paginatedUsers.length;

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  // Helper to get column visibility (adjusted for card view as well)
  const getVisibleTableColumns = () => {
      const columns = ['checkbox', 'user', 'email', 'phoneNumber', 'status', 'role', 'actions'];
      return columns.filter(col => {
          if(col === 'checkbox' || col === 'user' || col === 'actions') return true;
          return columnVisibility[col];
      })
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">User List</h1>
        <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
                <Link href="/dashboard/users/role">
                    Manage Roles
                </Link>
            </Button>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Fill in the form below to add a new user.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" placeholder="e.g., John Doe" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">Username</Label>
                            <Input id="username" placeholder="e.g., johndoe" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" type="email" placeholder="e.g., john@example.com" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">Phone</Label>
                            <Input id="phone" placeholder="e.g., 08123456789" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">Role</Label>
                             <Select>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map(role => (
                                        <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                             <Button type="button" variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create User</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      {/* Tools */}
      <div className="flex items-center justify-between gap-2 py-4">
        <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search user..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
              className="max-w-sm"
            />
            {/* Filter by Status */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Status: {statusFilter} <ChevronDown className="ml-2 h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setStatusFilter('All')}>All</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setStatusFilter('Active')}>Active</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setStatusFilter('Inactive')}>Inactive</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setStatusFilter('Pending')}>Pending</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {/* Filter by Role */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Role: {roleFilter === 'All' ? 'All' : roles.find(r => r.id === roleFilter)?.name} <ChevronDown className="ml-2 h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setRoleFilter('All')}>All</DropdownMenuItem>
                     {roles.map(role => (
                        <DropdownMenuItem key={role.id} onSelect={() => setRoleFilter(role.id)}>{role.name}</DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2">
            {/* Toggle columns */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.keys(columnVisibility).filter(key => key !== 'permission').map(key => (
                        <DropdownMenuCheckboxItem
                            key={key}
                            className="capitalize"
                            checked={columnVisibility[key]}
                            onCheckedChange={value =>
                                setColumnVisibility(prev => ({ ...prev, [key]: value }))
                            }
                        >
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            {/* Toggle view */}
            <Button variant="outline" onClick={() => setViewMode(prev => prev === 'table' ? 'card' : 'table')}>
                {viewMode === 'table' ? <LayoutList className="h-4 w-4" /> : <TableProperties className="h-4 w-4" />}
                <span className="ml-2 hidden md:inline-block">{viewMode === 'table' ? 'Card View' : 'Table View'}</span>
            </Button>
        </div>
      </div>

      {/* Content based on viewMode */}
      {viewMode === 'table' ? (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
                <TableHead>
                    <Checkbox 
                        onCheckedChange={handleSelectAll}
                        checked={isAllSelected || isSomeSelected}
                        indeterminate={isSomeSelected ? true : undefined}
                        aria-label="Select all"
                    />
                </TableHead>
                <TableHead>User</TableHead>
                {columnVisibility.email && <TableHead>Email</TableHead>}
                {columnVisibility.phoneNumber && <TableHead>Phone Number</TableHead>}
                {columnVisibility.status && <TableHead>Status</TableHead>}
                {columnVisibility.role && <TableHead>Role</TableHead>}
                {columnVisibility.actions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                    <TableRow key={user.id} data-state={selectedRows.has(user.id) && "selected"}>
                    <TableCell>
                        <Checkbox
                            onCheckedChange={() => handleSelectRow(user.id)}
                            checked={selectedRows.has(user.id)}
                            aria-label="Select row"
                        />
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-sm text-muted-foreground">{user.username}</span>
                            </div>
                        </div>
                    </TableCell>
                    {columnVisibility.email && <TableCell>{user.email}</TableCell>}
                    {columnVisibility.phoneNumber && <TableCell>{user.phoneNumber}</TableCell>}
                    {columnVisibility.status && <TableCell>{user.status}</TableCell>}
                    {columnVisibility.role && <TableCell>{user.roleName}</TableCell>}
                    {columnVisibility.actions && <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View details</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>}
                </TableRow>
              ))
            ) : (
              <TableRow>
                    <TableCell colSpan={getVisibleTableColumns().length} className="text-center h-24">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                    <UserCard key={user.id} user={user} columnVisibility={columnVisibility} />
                ))
            ) : (
                <p className="text-center col-span-full">No users found.</p>
            )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
            {selectedRows.size} of {filteredUsers.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
          Page {totalPages > 0 ? currentPage : 0} of {totalPages}
        </span>
        <Button
            variant="outline"
            size="sm"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
            variant="outline"
            size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </Button>
        </div>
      </div>
    </div>
  );
}