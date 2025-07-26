'use client';

import { useEffect, useState } from 'react';
import activityLogService from '@/service/activity_log_service';
import { formatIndonesianDate } from "@/lib/utils";

// Shadcn UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/Shadcn/table';
import { Badge } from '@/components/Shadcn/badge';
import { Skeleton } from '@/components/Shadcn/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Shadcn/avatar"


const getColorForMethod = (method) => {
    switch (method.toUpperCase()) {
        case 'POST': return 'bg-green-500 hover:bg-green-600';
        case 'GET': return 'bg-blue-500 hover:bg-blue-600';
        case 'PUT': return 'bg-yellow-500 hover:bg-yellow-600';
        case 'DELETE': return 'bg-red-500 hover:bg-red-600';
        default: return 'bg-gray-500 hover:bg-gray-600';
    }
};

const LogActivitiesPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            const data = await activityLogService.getAll();
            if (data) {
                // Sort logs by date descending
                const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setLogs(sortedData);
            }
            setLoading(false);
        };
        fetchLogs();
    }, []);

    const renderSkeleton = () => (
        Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            </TableRow>
        ))
    );

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Log Aktivitas</h1>
                    <p className="text-muted-foreground mt-1">Lacak semua aktivitas yang terjadi di aplikasi Anda.</p>
                </div>
            </div>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>IP Address</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        renderSkeleton()
                    ) : logs.length > 0 ? (
                        logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="text-muted-foreground">{formatIndonesianDate(log.created_at)}</TableCell>
                                <TableCell>
                                     <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={''} />
                                            <AvatarFallback>{log.user_id.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-muted-foreground">{log.user_id}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell className="text-muted-foreground">{log.endpoint}</TableCell>
                                <TableCell>
                                    <Badge className={`${getColorForMethod(log.method)} text-white`}>{log.method}</Badge>
                                </TableCell>
                                <TableCell>{log.status_code}</TableCell>
                                <TableCell className="text-muted-foreground">{log.ip_address}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan="7" className="text-center h-24">
                                Tidak ada log aktivitas yang ditemukan.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default LogActivitiesPage;
