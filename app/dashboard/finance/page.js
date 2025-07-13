"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusCircle, 
  CalendarIcon, 
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
  CardHeader,
  CardTitle,
} from "@/components/Shadcn/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Shadcn/popover";
import { Calendar } from "@/components/Shadcn/calendar";
import { cn } from "@/lib/utils";

import financeData from '@/data_dummy/dashboard/finance.json';

const ITEMS_PER_PAGE_OPTIONS = [20, 50, 100, 200];

export default function FinancePage() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBookmark, setFilterBookmark] = useState(false);
  const [filterType, setFilterType] = useState('All'); // 'All', 'Pemasukan', 'Pengeluaran'
  const [filterTimeRange, setFilterTimeRange] = useState('All Time');
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setTransactions(financeData);
  }, []);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

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

    if (filterTimeRange !== 'All Time') {
      const now = new Date();
      let startDate;
      switch (filterTimeRange) {
        case '1 Week':
          startDate = subDays(now, 7);
          break;
        case '1 Month':
          startDate = subMonths(now, 1);
          break;
        case '3 Months':
          startDate = subMonths(now, 3);
          break;
        case '6 Months':
          startDate = subMonths(now, 6);
          break;
        case '1 Year':
          startDate = subYears(now, 1);
          break;
        default:
          startDate = null;
      }
      if (startDate) {
        filtered = filtered.filter(tx =>
          isWithinInterval(parseISO(tx.date), { start: startDate, end: now })
        );
      }
    }

    if (dateRange.from && dateRange.to) {
        filtered = filtered.filter(tx =>
            isWithinInterval(parseISO(tx.date), { start: dateRange.from, end: dateRange.to })
        )
    }

    return filtered;
  }, [transactions, searchTerm, filterBookmark, filterType, filterTimeRange, dateRange]);

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

  // Summary calculations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthTransactions = transactions.filter(tx => {
    const txDate = parseISO(tx.date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });

  const pemasukanBulanIni = currentMonthTransactions
    .filter(tx => tx.type === 'Pemasukan')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const pengeluaranBulanIni = currentMonthTransactions
    .filter(tx => tx.type === 'Pengeluaran')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalTransaksi = transactions.length;

  const totalSaldoSemuaRekening = transactions.reduce((sum, tx) => {
    if (tx.type === 'Pemasukan') return sum + tx.amount;
    if (tx.type === 'Pengeluaran') return sum - tx.amount;
    return sum;
  }, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pemasukan Bulan Ini</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pemasukanBulanIni)}</div>
            <p className="text-xs text-muted-foreground">Berdasarkan transaksi bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengeluaran Bulan Ini</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pengeluaranBulanIni)}</div>
            <p className="text-xs text-muted-foreground">Berdasarkan transaksi bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransaksi}</div>
            <p className="text-xs text-muted-foreground">Total catatan keuangan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saldo Semua Rekening</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSaldoSemuaRekening)}</div>
            <p className="text-xs text-muted-foreground">Jumlah saldo dari semua rekening</p>
          </CardContent>
        </Card>
      </div>

      {/* Header with action buttons */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Finance Overview</h1>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Kelola Rekening</Button>
            </DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>Kelola Rekening</DialogTitle></DialogHeader><p>UI Kelola Rekening di sini.</p></DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button><PlusCircle className="mr-2 h-4 w-4" />Catat Keuangan</Button>
            </DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>Catat Keuangan</DialogTitle></DialogHeader><p>Form Catat Keuangan di sini.</p></DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Kelola Kategori</Button>
            </DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>Kelola Kategori</DialogTitle></DialogHeader><p>UI Kelola Kategori di sini.</p></DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export to CSV</DropdownMenuItem>
              <DropdownMenuItem>Export to PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">Analisis</Button>
        </div>
      </div>

      {/* Tools Section */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-sm"
          />
          <Button 
            variant={filterBookmark ? "default" : "outline"} 
            onClick={() => {
              setFilterBookmark(prev => !prev);
              setCurrentPage(1);
            }}
          >
            <Bookmark className="h-4 w-4 mr-2" /> Bookmark
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{filterType === 'All' ? 'Filter by Type' : filterType} <ChevronDown className="ml-2 h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => { setFilterType('All'); setCurrentPage(1); }}>All Types</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setFilterType('Pemasukan'); setCurrentPage(1); }}>Pemasukan</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setFilterType('Pengeluaran'); setCurrentPage(1); }}>Pengeluaran</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{filterTimeRange} <ChevronDown className="ml-2 h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => { setFilterTimeRange('All Time'); setDateRange({from: undefined, to: undefined}); setCurrentPage(1); }}>All Time</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setFilterTimeRange('1 Week'); setDateRange({from: undefined, to: undefined}); setCurrentPage(1); }}>1 Minggu Terakhir</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setFilterTimeRange('1 Month'); setDateRange({from: undefined, to: undefined}); setCurrentPage(1); }}>1 Bulan Terakhir</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setFilterTimeRange('3 Months'); setDateRange({from: undefined, to: undefined}); setCurrentPage(1); }}>3 Bulan Terakhir</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setFilterTimeRange('6 Months'); setDateRange({from: undefined, to: undefined}); setCurrentPage(1); }}>6 Bulan Terakhir</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setFilterTimeRange('1 Year'); setDateRange({from: undefined, to: undefined}); setCurrentPage(1); }}>1 Tahun Terakhir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "PPP", { locale: id })} - {format(dateRange.to, "PPP", { locale: id })}
                    </>
                  ) : (
                    format(dateRange.from, "PPP", { locale: id })
                  )
                ) : (
                  <span>Pilih Rentang Tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => {
                    setDateRange(range);
                    setFilterTimeRange('Custom'); // Indicate custom range
                    setCurrentPage(1);
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{itemsPerPage} Data Per Halaman <ChevronDown className="ml-2 h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {ITEMS_PER_PAGE_OPTIONS.map(option => (
                <DropdownMenuItem key={option} onSelect={() => { setItemsPerPage(option); setCurrentPage(1); }}>
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Transactions Timeline/Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px">Tanggal & Waktu</TableHead>
              <TableHead className="w-[150px">Kategori</TableHead>
              <TableHead className="w-[150px">Rekening</TableHead>
              <TableHead>Judul & Deskripsi</TableHead>
              <TableHead className="text-right w-[150px">Uang</TableHead>
              <TableHead className="text-right w-[50px">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx) => (
                <TableRow key={tx.id} className="group">
                  <TableCell className="font-medium">
                    <div>{format(parseISO(tx.date), 'PPP', { locale: id })}</div>
                    <div className="text-sm text-muted-foreground">{tx.time}</div>
                  </TableCell>
                  <TableCell>{tx.category}</TableCell>
                  <TableCell>{tx.account}</TableCell>
                  <TableCell>
                    <div className="font-medium">{tx.title}</div>
                    <div className="text-sm text-muted-foreground">{tx.description}</div>
                  </TableCell>
                  <TableCell className={`text-right font-medium ${tx.type === 'Pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'Pemasukan' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">Hapus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
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
  );
}
