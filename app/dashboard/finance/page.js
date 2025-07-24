"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusCircle, 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  Bookmark, 
  ArrowUpDown, 
  Download,
  ChevronDown,
  MoreHorizontal,
  Briefcase,
  User
} from 'lucide-react';
import { format, subDays, subMonths, subYears, isWithinInterval, parseISO, startOfMonth, getMonth, getYear } from 'date-fns';
import { id } from 'date-fns/locale';

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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Shadcn/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Shadcn/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/Shadcn/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Shadcn/popover";
import { Calendar } from "@/components/Shadcn/calendar";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/Shadcn/tabs";

import financeData from '@/data_dummy/dashboard/finance.json';
import projectsData from '@/data_dummy/dashboard/projects.json';

const ITEMS_PER_PAGE_OPTIONS = [20, 50, 100, 200];

export default function FinancePage() {
  const [transactions, setTransactions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [viewContext, setViewContext] = useState('business'); // 'business' or 'personal'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBookmark, setFilterBookmark] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [filterProjectId, setFilterProjectId] = useState('All');
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setTransactions(financeData);
    setProjects(projectsData);
  }, []);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(tx => tx.context === viewContext);

    if (searchTerm) {
      filtered = filtered.filter(tx =>
        tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.account.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterBookmark) {
      filtered = filtered.filter(tx => tx.bookmark);
    }
    
    if (filterType !== 'All') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }

    if (viewContext === 'business' && filterProjectId !== 'All') {
        filtered = filtered.filter(tx => String(tx.projectId) === filterProjectId);
    }

    if (dateRange.from && dateRange.to) {
        filtered = filtered.filter(tx =>
            isWithinInterval(parseISO(tx.date), { start: dateRange.from, end: dateRange.to })
        )
    }

    return filtered;
  }, [transactions, viewContext, searchTerm, filterBookmark, filterType, filterProjectId, dateRange]);

  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce((acc, tx) => {
        const monthYear = format(parseISO(tx.date), 'MMMM yyyy', { locale: id });
        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(tx);
        return acc;
    }, {});
  }, [filteredTransactions]);

  // Summary calculations
  const summaryTransactions = viewContext === 'business' 
    ? transactions.filter(tx => tx.context === 'business')
    : transactions.filter(tx => tx.context === 'personal');

  const pemasukanBulanIni = summaryTransactions
    .filter(tx => {
        const txDate = parseISO(tx.date);
        return tx.type === 'Pemasukan' && txDate.getMonth() === new Date().getMonth() && txDate.getFullYear() === new Date().getFullYear();
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const pengeluaranBulanIni = summaryTransactions
    .filter(tx => {
        const txDate = parseISO(tx.date);
        return tx.type === 'Pengeluaran' && txDate.getMonth() === new Date().getMonth() && txDate.getFullYear() === new Date().getFullYear();
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalSaldo = summaryTransactions.reduce((sum, tx) => {
    if (tx.type === 'Pemasukan') return sum + tx.amount;
    if (tx.type === 'Pengeluaran') return sum - tx.amount;
    return sum;
  }, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Finance Overview</h1>
        <div className="flex items-center gap-2">
            <Dialog><DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" />Catat Keuangan</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Catat Keuangan</DialogTitle></DialogHeader><p>Form Catat Keuangan di sini.</p></DialogContent></Dialog>
        </div>
      </div>

      {/* View Context Toggle */}
       <div className="mb-6 flex justify-center">
            <Tabs value={viewContext} onValueChange={setViewContext} className="w-auto">
                <TabsList>
                    <TabsTrigger value="business"><Briefcase className="mr-2 h-4 w-4" /> Bisnis</TabsTrigger>
                    <TabsTrigger value="personal"><User className="mr-2 h-4 w-4" /> Personal</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
        
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pemasukan Bulan Ini</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatCurrency(pemasukanBulanIni)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pengeluaran Bulan Ini</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatCurrency(pengeluaranBulanIni)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Saldo</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatCurrency(totalSaldo)}</div></CardContent>
        </Card>
      </div>

      {/* Tools Section */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Input
            type="text"
            placeholder="Cari transaksi..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="max-w-sm"
          />
          <Button variant={filterBookmark ? "default" : "outline"} onClick={() => { setFilterBookmark(prev => !prev); setCurrentPage(1); }}>
            <Bookmark className="h-4 w-4 mr-2" /> Bookmark
          </Button>
          {viewContext === 'business' && (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        {filterProjectId === 'All' ? 'Semua Proyek' : projects.find(p => String(p.id) === filterProjectId)?.title}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => { setFilterProjectId('All'); setCurrentPage(1); }}>Semua Proyek</DropdownMenuItem>
                    {projects.map(p => (
                        <DropdownMenuItem key={p.id} onSelect={() => { setFilterProjectId(String(p.id)); setCurrentPage(1); }}>{p.title}</DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn("w-[280px] justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (dateRange.to ? (<>{format(dateRange.from, "PPP", { locale: id })} - {format(dateRange.to, "PPP", { locale: id })}</>) : (format(dateRange.from, "PPP", { locale: id }))) : (<span>Pilih Rentang Tanggal</span>)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus mode="range" defaultMonth={dateRange.from} selected={dateRange}
                onSelect={(range) => { setDateRange(range); setCurrentPage(1); }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Transactions Grouped by Month */}
      <div className="space-y-8">
        {Object.keys(groupedTransactions).length > 0 ? (
            Object.entries(groupedTransactions).map(([monthYear, txs]) => (
                <div key={monthYear}>
                    <h2 className="text-xl font-bold mb-3">{monthYear}</h2>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[150px]">Tanggal</TableHead>
                            {viewContext === 'business' && <TableHead className="w-[200px]">Proyek</TableHead>}
                            <TableHead>Judul & Deskripsi</TableHead>
                            <TableHead className="text-right w-[150px]">Jumlah</TableHead>
                            <TableHead className="text-right w-[50px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {txs.map((tx) => (
                                <TableRow key={tx.id}>
                                <TableCell className="font-medium">{format(parseISO(tx.date), 'd LLL', { locale: id })}</TableCell>
                                {viewContext === 'business' && <TableCell>{tx.projectName}</TableCell>}
                                <TableCell>
                                    <div className="font-medium">{tx.title}</div>
                                    <div className="text-sm text-muted-foreground">{tx.description}</div>
                                </TableCell>
                                <TableCell className={`text-right font-medium ${tx.type === 'Pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.type === 'Pemasukan' ? '+' : '-'}{formatCurrency(tx.amount)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-500">Hapus</DropdownMenuItem>
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>
                </div>
            ))
        ) : (
            <div className="text-center py-16 border rounded-lg">
                <h3 className="text-lg font-medium">Tidak ada transaksi ditemukan.</h3>
                <p className="text-muted-foreground">Coba ubah filter atau tambahkan transaksi baru.</p>
            </div>
        )}
      </div>
    </div>
  );
}
