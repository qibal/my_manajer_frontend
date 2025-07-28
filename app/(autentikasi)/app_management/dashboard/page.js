'use client';

import { useEffect, useState } from 'react';
import { Users, Shield, Server, Hash } from 'lucide-react';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/Shadcn/card';
import { Skeleton } from '@/components/Shadcn/skeleton';

import userService from '@/service/user_service';
import roleService from '@/service/role_service';
import businessService from '@/service/business_service';
import channelService from '@/service/channel_service';

const StatCard = ({ title, value, icon: Icon, loading }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            {loading ? (
                <Skeleton className="h-8 w-1/2" />
            ) : (
                <div className="text-2xl font-bold">{value}</div>
            )}
        </CardContent>
    </Card>
);

export default function DashboardPage() {
    const [stats, setStats] = useState({
        users: 0,
        roles: 0,
        businesses: 0,
        channels: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const [usersData, rolesData, businessesData, channelsData] = await Promise.all([
                    userService.getUsers(),
                    roleService.getAll(),
                    businessService.getAll(),
                    channelService.getAll(),
                ]);

                setStats({
                    users: usersData?.length || 0,
                    roles: rolesData?.data?.length || 0,
                    businesses: businessesData?.data?.length || 0,
                    channels: channelsData?.data?.length || 0,
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-foreground mb-6">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Users" value={stats.users} icon={Users} loading={loading} />
                <StatCard title="Total Roles" value={stats.roles} icon={Shield} loading={loading} />
                <StatCard title="Total Businesses" value={stats.businesses} icon={Server} loading={loading} />
                <StatCard title="Total Channels" value={stats.channels} icon={Hash} loading={loading} />
            </div>
        </div>
    );
}
