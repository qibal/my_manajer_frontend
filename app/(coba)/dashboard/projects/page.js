"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  PlusCircle,
  ChevronDown,
  ArrowUpDown,
  LayoutList,
  TableProperties,
  CalendarDays,
  MoreHorizontal,
  Eye
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Shadcn/dropdown-menu";
import { Checkbox } from "@/components/Shadcn/checkbox";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/Shadcn/sheet";
import { Progress } from "@/components/Shadcn/progress";
import { Badge } from "@/components/Shadcn/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Shadcn/avatar";

import projectsData from '@/data_dummy/dashboard/projects.json';
import researchData from '@/data_dummy/projects/research.json';
import scriptsData from '@/data_dummy/projects/script.json';
import storyboardsData from '@/data_dummy/projects/pre_production.json';

const ITEMS_PER_PAGE_OPTIONS = [20, 50, 100];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByStatus, setSortByStatus] = useState('All');
  const [sortByDate, setSortByDate] = useState('latest'); // 'latest', 'oldest'
  const [viewMode, setViewMode] = useState('table'); // 'table', 'kanban', 'calendar'
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetContent, setSheetContent] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    // This combines all project-related data into one structure.
    const combinedProjects = projectsData.map(project => {
      const research = researchData.filter(r => r.projectId === project.id);
      const script = scriptsData.find(s => s.projectId === project.id);
      const storyboard = storyboardsData.find(s => s.projectId === project.id);
      
      return {
        ...project,
        research,
        script: script ? script : null,
        storyboard: storyboard ? storyboard : null,
      };
    });
    setProjects(combinedProjects);
  }, []);

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.assigned_to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.created_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (sortByStatus !== 'All') {
      filtered = filtered.filter(project => project.status === sortByStatus);
    }

    // Sorting
    filtered.sort((a, b) => {
      const dateA = parseISO(a.created_at);
      const dateB = parseISO(b.created_at);
      if (sortByDate === 'latest') {
        return dateB.getTime() - dateA.getTime();
      } else {
        return dateA.getTime() - dateB.getTime();
      }
    });

    return filtered;
  }, [projects, searchTerm, sortByStatus, sortByDate]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProjects.slice(startIndex, endIndex);
  }, [filteredProjects, currentPage, itemsPerPage]);

  const handleSelectAll = (checked) => {
    if (checked) {
      const allProjectIds = new Set(paginatedProjects.map(p => p.id));
      setSelectedRows(allProjectIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (projectId) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(projectId)) {
      newSelection.delete(projectId);
    } else {
      newSelection.add(projectId);
    }
    setSelectedRows(newSelection);
  };

  const isAllSelected = selectedRows.size > 0 && selectedRows.size === paginatedProjects.length;
  const isSomeSelected = selectedRows.size > 0 && selectedRows.size < paginatedProjects.length;

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const openDescriptionSheet = (title, description) => {
    setSheetContent({ title, description });
    setIsSheetOpen(true);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Planning':
        return "secondary";
      case 'Research':
        return "outline";
      case 'Production':
        return "default";
      case 'Review':
        return "info";
      case 'Completed':
        return "success";
      case 'Uploaded':
        return "success"; // Assuming uploaded is a final state like completed
      default:
        return "default";
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'Low':
        return "secondary";
      case 'Medium':
        return "outline";
      case 'High':
        return "default";
      case 'Urgent':
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Project List</h1>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button><PlusCircle className="mr-2 h-4 w-4" />Add Project</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
                <DialogDescription>Fill in the form below to add a new project.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="project-title" className="text-right">Title</Label>
                  <Input id="project-title" defaultValue="New Project" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit">Save Project</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Kelola Prioritas</Button>
            </DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>Kelola Prioritas</DialogTitle></DialogHeader><p>UI Kelola Prioritas di sini.</p></DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Kelola Status</Button>
            </DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>Kelola Status</DialogTitle></DialogHeader><p>UI Kelola Status di sini.</p></DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tools */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{sortByStatus === 'All' ? 'Filter by Status' : sortByStatus} <ChevronDown className="ml-2 h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => { setSortByStatus('All'); setCurrentPage(1); }}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setSortByStatus('Planning'); setCurrentPage(1); }}>Planning</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setSortByStatus('Research'); setCurrentPage(1); }}>Research</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setSortByStatus('Production'); setCurrentPage(1); }}>Production</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setSortByStatus('Review'); setCurrentPage(1); }}>Review</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setSortByStatus('Completed'); setCurrentPage(1); }}>Completed</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setSortByStatus('Uploaded'); setCurrentPage(1); }}>Uploaded</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{sortByDate === 'latest' ? 'Terbaru' : 'Terlama'} <ChevronDown className="ml-2 h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => { setSortByDate('latest'); setCurrentPage(1); }}>Terbaru</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { setSortByDate('oldest'); setCurrentPage(1); }}>Terlama</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <Button variant="outline" onClick={() => setViewMode('table')}>
            <TableProperties className="h-4 w-4" />
            <span className="ml-2 hidden md:inline-block">Tabel View</span>
          </Button>
          <Button variant="outline" onClick={() => setViewMode('kanban')}>
            <LayoutList className="h-4 w-4" />
            <span className="ml-2 hidden md:inline-block">Kanban View</span>
          </Button>
          <Button variant="outline" onClick={() => setViewMode('calendar')}>
            <CalendarDays className="h-4 w-4" />
            <span className="ml-2 hidden md:inline-block">Calendar View</span>
          </Button>
        </div>
      </div>

      {/* Content based on viewMode */}
      {viewMode === 'table' && (
        <div className="border rounded-lg overflow-hidden">
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
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead className="w-[200px]">Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[120px]">Research</TableHead>
                <TableHead className="w-[120px]">Script</TableHead>
                <TableHead className="w-[120px]">Storyboard</TableHead>
                <TableHead className="w-[100px]">Priority</TableHead>
                <TableHead className="w-[120px]">Start Date</TableHead>
                <TableHead className="w-[120px]">Due Date</TableHead>
                <TableHead className="w-[100px]">Progress</TableHead>
                <TableHead className="w-[120px]">Budget</TableHead>
                <TableHead className="w-[120px]">Actual Cost</TableHead>
                <TableHead className="w-[150px]">Assigned To</TableHead>
                <TableHead className="w-[150px]">Created By</TableHead>
                <TableHead className="w-[150px]">Tags</TableHead>
                <TableHead className="w-[150px]">Created At</TableHead>
                <TableHead className="w-[150px]">Updated At</TableHead>
                
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProjects.length > 0 ? (
                paginatedProjects.map((project, index) => (
                  <TableRow key={project.id} data-state={selectedRows.has(project.id) && "selected"}>
                    <TableCell>
                      <Checkbox
                        onCheckedChange={() => handleSelectRow(project.id)}
                        checked={selectedRows.has(project.id)}
                        aria-label="Select row"
                      />
                    </TableCell>
                    <TableCell>{currentPage * itemsPerPage - itemsPerPage + index + 1}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={project.image} alt={project.title} />
                          <AvatarFallback>{project.title.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Link href={`/projects/${project.id}`} className="hover:underline">{project.title}</Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => openDescriptionSheet(project.title, project.description)}>
                        <Eye className="h-4 w-4 mr-2" /> View Description
                      </Button>
                    </TableCell>
                    <TableCell><Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={project.research && project.research.length > 0 ? "success" : "secondary"}>
                        {project.research && project.research.length > 0 ? "Started" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={project.script ? "success" : "secondary"}>
                        {project.script ? "Started" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={project.storyboard ? "success" : "secondary"}>
                        {project.storyboard ? "Started" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell><Badge variant={getPriorityBadgeVariant(project.priority)}>{project.priority}</Badge></TableCell>
                    <TableCell>{format(parseISO(project.start_date), 'PPP', { locale: id })}</TableCell>
                    <TableCell>{format(parseISO(project.due_date), 'PPP', { locale: id })}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="w-[100px]" />
                        <span>{project.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(project.budget)}</TableCell>
                    <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(project.actual_cost)}</TableCell>
                    <TableCell>{project.assigned_to}</TableCell>
                    <TableCell>{project.created_by}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map(tag => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{format(parseISO(project.created_at), 'PPP', { locale: id })}</TableCell>
                    <TableCell>{format(parseISO(project.updated_at), 'PPP', { locale: id })}</TableCell>
                    
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={23} className="h-24 text-center">
                    No projects found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Kanban View (Placeholder) */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <p className="text-center col-span-full h-40 flex items-center justify-center border rounded-lg">Kanban View coming soon...</p>
        </div>
      )}

      {/* Calendar View (Placeholder) */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1">
          <p className="text-center col-span-full h-40 flex items-center justify-center border rounded-lg">Calendar View coming soon...</p>
        </div>
      )}

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

      {/* Description Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{sheetContent.title}</SheetTitle>
            <SheetDescription>
              {sheetContent.description}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
