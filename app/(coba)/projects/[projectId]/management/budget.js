"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { 
  PlusCircle, 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  Bookmark, 
  ArrowUpDown, 
  Download,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';
import { format, subDays, subMonths, subYears, isWithinInterval, parseISO } from 'date-fns';
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
  DialogTrigger
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

import financeData from '@/data_dummy/dashboard/finance.json';
import projectsData from '@/data_dummy/dashboard/projects.json';


export default function ProjectBudgetPage() {
  const params = useParams();
  const projectId = params.projectId;

  const [transactions, setTransactions] = useState([]);
  const [project, setProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBookmark, setFilterBookmark] = useState(false);
  const [filterType, setFilterType] = useState('All'); // 'All', 'Pemasukan', 'Pengeluaran'
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const projectTransactions = financeData.filter(
      (tx) => tx.context === 'business' && String(tx.projectId) === projectId
    );
    const currentProject = projectsData.find(p => String(p.id) === projectId);

    setTransactions(projectTransactions);
    setProject(currentProject);
  }, [projectId]);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(tx =>
        tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterBookmark) {
      filtered = filtered.filter(tx => tx.bookmark);
    }

    if (filterType !== 'All') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }

    if (dateRange.from && dateRange.to) {
        filtered = filtered.filter(tx =>
            isWithinInterval(parseISO(tx.date), { start: dateRange.from, end: dateRange.to })
        )
    }

    return filtered;
  }, [transactions, searchTerm, filterBookmark, filterType, dateRange]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  // Summary calculations for the project
  const totalPemasukan = transactions
    .filter(tx => tx.type === 'Pemasukan')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalPengeluaran = transactions
    .filter(tx => tx.type === 'Pengeluaran')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const sisaBudget = (project?.budget || 0) - totalPengeluaran;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  if (!project) {
    return <div>Loading project data...</div>;
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Budget: {project.title}</h1>
          <p className="text-muted-foreground">Kelola semua transaksi keuangan untuk proyek ini.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button><PlusCircle className="mr-2 h-4 w-4" />Catat Transaksi</Button>
            </DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>Catat Transaksi Baru</DialogTitle></DialogHeader><p>Form Catat Keuangan untuk Proyek &quot;{project.title}&quot; di sini.</p></DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Anggaran Proyek</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatCurrency(project.budget)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{formatCurrency(totalPemasukan)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">{formatCurrency(totalPengeluaran)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Sisa Anggaran</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatCurrency(sisaBudget)}</div></CardContent>
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
          <Button 
            variant={filterBookmark ? "default" : "outline"} 
            onClick={() => { setFilterBookmark(prev => !prev); setCurrentPage(1); }}
          >
            <Bookmark className="h-4 w-4 mr-2" /> Bookmark
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{filterType === 'All' ? 'Filter Tipe' : filterType} <ChevronDown className="ml-2 h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => { setFilterType('All'); setCurrentPage(1); }}>Semua Tipe</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setFilterType('Pemasukan'); setCurrentPage(1); }}>Pemasukan</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setFilterType('Pengeluaran'); setCurrentPage(1); }}>Pengeluaran</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[280px] justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (dateRange.to ? (<>{format(dateRange.from, "PPP", { locale: id })} - {format(dateRange.to, "PPP", { locale: id })}</>) : (format(dateRange.from, "PPP", { locale: id }))) : (<span>Pilih Rentang Tanggal</span>)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => { setDateRange(range); setCurrentPage(1); }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px">Tanggal</TableHead>
              <TableHead className="w-[150px">Kategori</TableHead>
              <TableHead>Judul & Deskripsi</TableHead>
              <TableHead className="text-right w-[150px">Jumlah</TableHead>
              <TableHead className="text-right w-[50px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{format(parseISO(tx.date), 'PPP', { locale: id })}</TableCell>
                  <TableCell>{tx.category}</TableCell>
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
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Hapus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Belum ada transaksi untuk proyek ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <span className="text-sm text-muted-foreground">
          Halaman {totalPages > 0 ? currentPage : 0} dari {totalPages}
        </span>
        <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>Previous</Button>
        <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0}>Next</Button>
      </div>
    </div>
  );
}
