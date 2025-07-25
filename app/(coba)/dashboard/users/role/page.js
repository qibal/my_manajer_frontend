"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/Shadcn/card";
import { Button } from '@/components/Shadcn/button';
import { Input } from '@/components/Shadcn/input';
import { Label } from '@/components/Shadcn/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Shadcn/select';
import { toast } from 'sonner';
import { PlusCircle, Trash2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

// Import data dummy
import allRoles from '@/data_dummy/dashboard/role.json';
import allPermissions from '@/data_dummy/dashboard/menu_permission.json';

// Definisikan semua menu yang bisa diatur izinnya
const ALL_MENUS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'users', label: 'User & Role Management' },
    { id: 'projects', label: 'Projects' },
    { id: 'finance', label: 'Financial Tracking' },
    { id: 'analytics', label: 'Business Analytics' },
    { id: 'asset', label: 'Asset Management' },
    { id: 'settings', label: 'Settings' },
    { id: 'project_overview', label: 'Project: Overview' },
    { id: 'project_research', label: 'Project: Research' },
    { id: 'project_pre_production', label: 'Project: Pre-Production' },
    { id: 'project_production', label: 'Project: Production' },
    { id: 'project_post_production', label: 'Project: Post-Production' },
    { id: 'project_final', label: 'Project: Final' },
    { id: 'project_management', label: 'Project: Management' },
];

const ACCESS_LEVELS = [
    { id: 'full_access', label: 'Full Access' },
    { id: 'edit', label: 'Can Edit' },
    { id: 'read_only', label: 'Read Only' },
];

export default function RoleManagementPage() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentPermissions, setCurrentPermissions] = useState({});

  useEffect(() => {
    // In a real app, this would be a fetch call to your API
    setRoles(allRoles);
    setPermissions(allPermissions);
    // Select the first role by default
    if (allRoles.length > 0) {
        handleRoleSelect(allRoles[0]);
    }
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setCurrentPermissions(permissions[role.id] || {});
  };

  const handlePermissionChange = (menuId, accessLevel) => {
    if (accessLevel === 'none') {
        handleRemovePermission(menuId)
    } else {
        setCurrentPermissions(prev => ({
          ...prev,
          [menuId]: accessLevel,
        }));
    }
  };
  
  const handleRemovePermission = (menuId) => {
    const newPermissions = { ...currentPermissions };
    delete newPermissions[menuId];
    setCurrentPermissions(newPermissions);
  };


  const handleSaveChanges = () => {
    // In a real app, you would send this data to your backend API
    console.log('Saving changes for role:', selectedRole.id);
    console.log('New permissions:', currentPermissions);

    // Update the local state to simulate saving
    const updatedPermissions = {
      ...permissions,
      [selectedRole.id]: currentPermissions,
    };
    setPermissions(updatedPermissions);
    toast.success(`Permissions for "${selectedRole.name}" have been updated.`);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/users">
                <ChevronLeft className="h-4 w-4" />
            </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold">Role & Permission Management</h1>
            <p className="text-muted-foreground">Kelola hak akses untuk setiap peran dalam sistem.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Daftar Peran */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Daftar Peran</CardTitle>
            <Button variant="outline" size="sm" className="mt-2">
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Peran
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {roles.map((role) => (
                <Button
                  key={role.id}
                  variant={selectedRole?.id === role.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => handleRoleSelect(role)}
                >
                  {role.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Kolom Editor Izin */}
        {selectedRole ? (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Edit Izin untuk: {selectedRole.name}</CardTitle>
              <CardDescription>{selectedRole.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {ALL_MENUS.map((menu) => (
                    <div key={menu.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border">
                        <Label htmlFor={`perm-${menu.id}`} className="mb-2 sm:mb-0 font-semibold">{menu.label}</Label>
                        <div className="flex items-center gap-2">
                            <Select
                                value={currentPermissions[menu.id] || 'none'}
                                onValueChange={(value) => handlePermissionChange(menu.id, value)}
                                disabled={selectedRole.id === 'super_admin'}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Pilih Akses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Tidak Ada Akses</SelectItem>
                                    {ACCESS_LEVELS.map(level => (
                                        <SelectItem key={level.id} value={level.id}>{level.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleRemovePermission(menu.id)}
                                disabled={selectedRole.id === 'super_admin' || !currentPermissions[menu.id]}
                            >
                                <Trash2 className="h-4 w-4 text-red-500"/>
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveChanges} disabled={selectedRole.id === 'super_admin'}>
                Simpan Perubahan
              </Button>
            </CardFooter>
          </Card>
        ) : (
            <Card className="lg:col-span-2 flex items-center justify-center h-full">
                <p className="text-muted-foreground">Pilih sebuah peran untuk mulai mengelola izin.</p>
            </Card>
        )}
      </div>
    </div>
  );
}
