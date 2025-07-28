"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Hash, Database, Edit3, Trash2, Check, X, MoreHorizontal, Settings } from "lucide-react"
// import { useRouter } from 'next/navigation' // Hapus useRouter karena navigasi sidebar tidak lagi di sini

// Hapus semua import Sidebar
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarInset,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarProvider,
//   SidebarRail,
//   SidebarTrigger,
// } from "@/components/Shadcn/sidebar"

import { Calendar as CalendarIcon } from 'lucide-react';
import { Table as TableIcon } from 'lucide-react';
import { Calendar } from "@/components/Shadcn/calendar"
import { Search } from 'lucide-react';
import { SquareKanban } from 'lucide-react';
import { Button } from "@/components/Shadcn/button"
import { Input } from "@/components/Shadcn/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/Shadcn/dropdown-menu"
import { Separator } from "@/components/Shadcn/separator"
import { Badge } from "@/components/Shadcn/badge"
import { Checkbox } from "@/components/Shadcn/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Shadcn/popover"
import { ScrollArea } from "@/components/Shadcn/scroll-area"


import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/Shadcn/sheet"
import { Label } from "@/components/Shadcn/label"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/Shadcn/alert-dialog"

// Hapus useAuth dan useBusinessData karena sidebar tidak ada
// import { useAuth } from '@/hooks/use-auth'
// import { useBusinessData } from '@/hooks/use-business-data'
import databaseService from '@/service/database_service'
import { toast } from "sonner"
import { LoaderCircle } from 'lucide-react';

export default function DatabaseChannel({ channel }) {
  // const router = useRouter() // Hapus router
  const businessId = channel.businessId // Mengambil businessId dari prop channel
  const channelId = channel.id // Mengambil channelId dari prop channel

  // Hapus state dan variabel terkait auth dan business data karena sidebar dihilangkan
  // const { user, loading: authLoading } = useAuth()
  // const { businessList, channels, selectedBusiness, setSelectedBusiness, loading: businessLoading } = useBusinessData(businessId)

  const [databases, setDatabases] = useState([])
  const [columns, setColumns] = useState([])
  const [selectOptions, setSelectOptions] = useState([])
  const [rows, setRows] = useState([])

  const [selectedChannelLocal, setSelectedChannelLocal] = useState(channel) // Menggunakan state lokal untuk channel yang dipilih
  const [currentDatabase, setCurrentDatabase] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [editingCell, setEditingCell] = useState(null)
  const [editingValue, setEditingValue] = useState("")
  const [newColumnName, setNewColumnName] = useState("")
  const [newColumnType, setNewColumnType] = useState("text")
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false)
  const [selectedColumnPopover, setSelectedColumnPopover] = useState(null)
  const [editColumnName, setEditColumnName] = useState("")
  const [currentView, setCurrentView] = useState("table")
  const [isNewRowSheetOpen, setIsNewRowSheetOpen] = useState(false)
  const [newRowData, setNewRowData] = useState({})
  const [searchQuery, setSearchQuery] = useState("")

  // Select options management
  const [newOptionValue, setNewOptionValue] = useState("")
  const [editingOption, setEditingOption] = useState(null)
  const [editingOptionValue, setEditingOptionValue] = useState("")

  // Update selectedChannelLocal if channel prop changes
  useEffect(() => {
    setSelectedChannelLocal(channel);
  }, [channel]);

  // Fetch data
  useEffect(() => {
    // if (businessLoading || authLoading || !selectedChannelLocal) return // Hapus kondisi loading dari useAuth/useBusinessData
    if (!selectedChannelLocal) return // Hanya cek selectedChannelLocal

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch databases for the selected channel
        const dbRes = await databaseService.getDatabasesByChannelId(selectedChannelLocal.id);
        if (dbRes && dbRes.data && dbRes.data.length > 0) {
            setDatabases(dbRes.data);
            const primaryDb = dbRes.data[0]; // Asumsi ada satu database per channel
            setCurrentDatabase(primaryDb);
            setColumns(primaryDb.columns.sort((a, b) => a.order - b.order) || []);
            setRows(primaryDb.rows || []);

            // Aggregate select options from all columns
            const allSelectOptions = primaryDb.columns.flatMap(col => 
                col.type === 'select' && col.options ? col.options.map(opt => ({ ...opt, columnId: col.id })) : []
            );
            setSelectOptions(allSelectOptions);

        } else {
            setDatabases([]);
            setCurrentDatabase(null);
            setColumns([]);
            setRows([]);
            setSelectOptions([]);
            console.log("No database found for this channel.");
        }
      } catch (err) {
        console.error("Error fetching database data:", err)
        setError("Gagal memuat data database.")
        setDatabases([])
        setCurrentDatabase(null)
        setColumns([])
        setRows([])
        setSelectOptions([])
      } finally {
        setLoading(false)
      }
    }

    // if (selectedBusiness) { // Hapus kondisi selectedBusiness
        fetchData();
    // }
  }, [selectedChannelLocal]) // Hapus dependency businessLoading, authLoading, selectedBusiness


  // Filter channels berdasarkan server yang dipilih - TIDAK LAGI DIBUTUHKAN DI SINI
  // const filteredChannels = channels ? channels.filter((ch) => ch.businessId === selectedBusiness) : []
  // const databaseChannels = filteredChannels.filter((ch) => ch.type === "databases")

  // Get options for select columns
  const getColumnOptions = useCallback((columnId) => {
    return selectOptions.filter((opt) => opt.columnId === columnId).sort((a, b) => a.order - b.order)
  }, [selectOptions])

  // Handle select options management
  const handleAddSelectOption = useCallback(async (columnId) => {
    if (!newOptionValue.trim() || !currentDatabase) return

    try {
      const newOption = {
        value: newOptionValue,
        order: getColumnOptions(columnId).length + 1,
      }
      const updatedDatabase = await databaseService.addSelectOptionToColumn(currentDatabase.id, columnId, newOption)
      if (updatedDatabase && updatedDatabase.data) {
        setSelectOptions(updatedDatabase.data.columns.flatMap(col => 
            col.type === 'select' && col.options ? col.options.map(opt => ({ ...opt, columnId: col.id })) : []
        ));
        setNewOptionValue("")
        toast.success("Opsi berhasil ditambahkan.");
      }
    } catch (error) {
      console.error("Error adding select option:", error)
      toast.error("Gagal menambahkan opsi.");
    }
  }, [newOptionValue, currentDatabase, getColumnOptions, setSelectOptions, setNewOptionValue]);

  const handleUpdateSelectOption = useCallback(async (optionId, newValue) => {
    if (!newValue.trim() || !currentDatabase || !editingOption) return;
    const columnOfOption = columns.find(col => col.options && col.options.some(opt => opt.id === optionId));
    if (!columnOfOption) return;

    try {
        const updatedOption = { value: newValue };
        const updatedDatabase = await databaseService.updateSelectOptionInColumn(currentDatabase.id, columnOfOption.id, optionId, updatedOption);
        if (updatedDatabase && updatedDatabase.data) {
            setSelectOptions(updatedDatabase.data.columns.flatMap(col => 
                col.type === 'select' && col.options ? col.options.map(opt => ({ ...opt, columnId: col.id })) : []
            ));
            setEditingOption(null);
            setEditingOptionValue("");
            toast.success("Opsi berhasil diperbarui.");
        }
    } catch (error) {
        console.error("Error updating select option:", error);
        toast.error("Gagal memperbarui opsi.");
    }
  }, [currentDatabase, editingOption, columns, setSelectOptions, setEditingOption, setEditingOptionValue]);

  const handleDeleteSelectOption = useCallback(async (optionId) => {
    if (!currentDatabase) return;
    const columnOfOption = columns.find(col => col.options && col.options.some(opt => opt.id === optionId));
    if (!columnOfOption) return;

    try {
        const updatedDatabase = await databaseService.deleteSelectOptionFromColumn(currentDatabase.id, columnOfOption.id, optionId);
        if (updatedDatabase && updatedDatabase.data) {
            setSelectOptions(updatedDatabase.data.columns.flatMap(col => 
                col.type === 'select' && col.options ? col.options.map(opt => ({ ...opt, columnId: col.id })) : []
            ));
            toast.success("Opsi berhasil dihapus.");
        }
    } catch (error) {
        console.error("Error deleting select option:", error);
        toast.error("Gagal menghapus opsi.");
    }
  }, [currentDatabase, columns, setSelectOptions]);

  // Handle cell editing
  const handleCellClick = (rowId, columnId, currentValue) => {
    setEditingCell(`${rowId}-${columnId}`)
    setEditingValue(currentValue || "")
  }

  const handleCellSave = useCallback(async (rowId, columnId) => {
    if (!currentDatabase) return;

    const currentRow = rows.find(r => r.id === rowId);
    if (!currentRow) return;

    const updatedValues = {
        ...currentRow.values,
        [columnId]: editingValue
    };

    try {
        const updatedDbResponse = await databaseService.updateRowInDatabase(currentDatabase.id, rowId, { values: updatedValues });
        if (updatedDbResponse && updatedDbResponse.data) {
            setRows(updatedDbResponse.data.rows || []);
            setEditingCell(null);
            setEditingValue("");
            toast.success("Sel berhasil diperbarui.");
        }
    } catch (error) {
        console.error("Error updating cell:", error);
        toast.error("Gagal memperbarui sel.");
    }
  }, [currentDatabase, rows, editingValue, setRows, setEditingCell, setEditingValue]);

  const handleCellCancel = useCallback(() => {
    setEditingCell(null)
    setEditingValue("")
  }, [setEditingCell, setEditingValue]);

  // Handle column operations
  const handleAddColumn = async () => {
    if (!newColumnName.trim() || !currentDatabase) return

    try {
        const newColumn = {
            name: newColumnName,
            type: newColumnType,
            order: (columns.length > 0 ? Math.max(...columns.map(c => c.order)) : 0) + 1,
            // Tambahkan options kosong jika tipenya select untuk konsistensi
            options: newColumnType === 'select' ? [] : undefined,
        };

        // Buat salinan kolom yang ada dan tambahkan yang baru
        const updatedColumns = [...columns, newColumn];

        // Hanya kirim array kolom yang diperbarui
        const payload = { columns: updatedColumns };

        const res = await databaseService.updateDatabase(currentDatabase.id, payload);

        if (res && res.data) {
            const updatedDb = res.data;
            setCurrentDatabase(updatedDb);
            setColumns(updatedDb.columns.sort((a, b) => a.order - b.order));
            setRows(updatedDb.rows || []);
            setSelectOptions(updatedDb.columns.flatMap(col => 
                col.type === 'select' && col.options ? col.options.map(opt => ({ ...opt, columnId: col.id })) : []
            ));
            
            setNewColumnName("");
            setNewColumnType("text");
            setIsAddColumnOpen(false);
            toast.success("Kolom berhasil ditambahkan.");
        }
    } catch (error) {
        console.error("Error adding column:", error);
        toast.error("Gagal menambahkan kolom.");
    }
  }

  const handleDeleteColumn = async (columnId) => {
    if (!currentDatabase) return;
    try {
        const res = await databaseService.deleteColumnFromDatabase(currentDatabase.id, columnId);
        if (res && res.data) {
            setColumns(res.data.columns.sort((a,b) => a.order - b.order));
            setRows(res.data.rows || []); // Update rows juga setelah kolom dihapus
            setSelectOptions(res.data.columns.flatMap(col => 
                col.type === 'select' && col.options ? col.options.map(opt => ({ ...opt, columnId: col.id })) : []
            ));
            setSelectedColumnPopover(null);
            toast.success("Kolom berhasil dihapus.");
        }
    } catch (error) {
        console.error("Error deleting column:", error);
        toast.error("Gagal menghapus kolom.");
    }
  };

  const handleEditColumn = async (columnId, newName) => {
    if (!currentDatabase || !newName.trim()) return;
    try {
        const updatedColumn = { name: newName };
        const res = await databaseService.updateColumnInDatabase(currentDatabase.id, columnId, updatedColumn);
        if (res && res.data) {
            const updatedDb = res.data;
            setCurrentDatabase(updatedDb);
            setColumns(updatedDb.columns.sort((a, b) => a.order - b.order));
            setRows(updatedDb.rows || []);
            setSelectOptions(updatedDb.columns.flatMap(col => 
                col.type === 'select' && col.options ? col.options.map(opt => ({ ...opt, columnId: col.id })) : []
            ));
            
            setSelectedColumnPopover(null);
            setEditColumnName("");
            toast.success("Kolom berhasil diperbarui.");
        }
    } catch (error) {
        console.error("Error editing column:", error);
        toast.error("Gagal memperbarui kolom.");
    }
  };

  // Handle row operations
  const handleAddRow = async () => {
    if (!currentDatabase) return;
    try {
        const newRow = { values: {} }; // Buat row kosong atau dengan default value jika perlu
        const res = await databaseService.addRowToDatabase(currentDatabase.id, newRow);
        if (res && res.data) {
            setRows(res.data.rows || []);
            toast.success("Baris baru berhasil ditambahkan.");
        }
    } catch (error) {
        console.error("Error adding row:", error);
        toast.error("Gagal menambahkan baris.");
    }
  };

  const handleDeleteRow = async (rowId) => {
    if (!currentDatabase) return;
    try {
        const res = await databaseService.deleteRowFromDatabase(currentDatabase.id, rowId);
        if (res && res.data) {
            setRows(res.data.rows || []);
            toast.success("Baris berhasil dihapus.");
        }
    } catch (error) {
        console.error("Error deleting row:", error);
        toast.error("Gagal menghapus baris.");
    }
  };

  const handleNewRowSubmit = async () => {
    if (!currentDatabase) return;
    try {
        const res = await databaseService.addRowToDatabase(currentDatabase.id, { values: newRowData });
        if (res && res.data) {
            setRows(res.data.rows || []);
            setNewRowData({});
            setIsNewRowSheetOpen(false);
            toast.success("Baris baru berhasil ditambahkan.");
        }
    } catch (error) {
        console.error("Error adding new row:", error);
        toast.error("Gagal menambahkan baris baru.");
    }
  };

  // Render select options management
  const renderSelectOptionsManagement = useCallback((column) => {
    const columnOptions = getColumnOptions(column.id)

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Manage Select Options</h4>
          <p className="text-sm text-muted-foreground">
            Add, edit, or remove options for the {column.name} select column.
          </p>
        </div>

        {/* Existing Options */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Current Options</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {columnOptions.map((option) => (
              <div key={option.id} className="flex items-center gap-2 p-2 border rounded">
                {editingOption === option.id ? (
                  <>
                    <Input
                      value={editingOptionValue}
                      onChange={(e) => setEditingOptionValue(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <Button size="sm" onClick={() => handleUpdateSelectOption(option.id, editingOptionValue)}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingOption(null)
                        setEditingOptionValue("")
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Badge variant="secondary" className="flex-1">
                      {option.value}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingOption(option.id)
                        setEditingOptionValue(option.value)
                      }}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Option</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the option {option.value}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteSelectOption(option.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Option
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add New Option */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Add New Option</label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter option value"
              value={newOptionValue}
              onChange={(e) => setNewOptionValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddSelectOption(column.id)
                }
              }}
            />
            <Button onClick={() => handleAddSelectOption(column.id)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }, [getColumnOptions, editingOption, editingOptionValue, newOptionValue, handleAddSelectOption, handleUpdateSelectOption, handleDeleteSelectOption])

  // Render cell content berdasarkan tipe kolom
  const renderCellContent = useCallback((row, column) => {
    const cellKey = `${row.id}-${column.id}`
    const value = row.values[column.id]
    const isEditing = editingCell === cellKey
    const columnOptions = getColumnOptions(column.id)

    // Direct editing untuk select, checkbox, dan date
    if (column.type === "select" && !isEditing) {
      return (
        <div className="p-3 min-h-[50px] flex items-center">
          <Select
            value={value || ""}
            onValueChange={(newValue) => {
                const updatedValues = { ...row.values, [column.id]: newValue };
                databaseService.updateRowInDatabase(currentDatabase.id, row.id, { values: updatedValues })
                    .then(res => {
                        if (res && res.data) {
                            setRows(res.data.rows || []);
                            toast.success("Sel berhasil diperbarui.");
                        }
                    })
                    .catch(error => {
                        console.error("Error updating select cell:", error);
                        toast.error("Gagal memperbarui sel.");
                    });
            }}
          >
            <SelectTrigger className="w-full border-0 shadow-none p-0 h-auto">
              <SelectValue placeholder="Select option">
                {value ? <Badge variant="secondary">{value}</Badge> : "Select option"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {columnOptions.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    }

    if (column.type === "boolean" && !isEditing) {
      return (
        <div className="p-3 min-h-[50px] flex items-center">
          <Checkbox
            checked={value === true || value === "true"}
            onCheckedChange={(checked) => {
                const updatedValues = { ...row.values, [column.id]: checked };
                databaseService.updateRowInDatabase(currentDatabase.id, row.id, { values: updatedValues })
                    .then(res => {
                        if (res && res.data) {
                            setRows(res.data.rows || []);
                            toast.success("Sel berhasil diperbarui.");
                        }
                    })
                    .catch(error => {
                        console.error("Error updating boolean cell:", error);
                        toast.error("Gagal memperbarui sel.");
                    });
            }}
          />
        </div>
      )
    }

    if (column.type === "date" && !isEditing) {
      return (
        <div className="p-3 min-h-[50px] flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left font-normal p-0 h-auto border-0 shadow-none",
                  !value && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => {
                  const formattedDate = date ? format(date, "yyyy-MM-dd") : ""
                  const updatedValues = { ...row.values, [column.id]: formattedDate };
                  databaseService.updateRowInDatabase(currentDatabase.id, row.id, { values: updatedValues })
                    .then(res => {
                        if (res && res.data) {
                            setRows(res.data.rows || []);
                            toast.success("Sel berhasil diperbarui.");
                        }
                    })
                    .catch(error => {
                        console.error("Error updating date cell:", error);
                        toast.error("Gagal memperbarui sel.");
                    });
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )
    }

    // Editing mode untuk text dan number
    if (isEditing) {
      return (
        <div className="p-1 min-h-[50px] flex items-center">
          <textarea
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            className="w-full min-h-[46px] p-3 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md resize-none overflow-hidden"
            style={{
              height: "auto",
              minHeight: "46px",
            }}
            autoFocus
            onInput={(e) => {
              // Auto-resize textarea
              e.target.style.height = "auto"
              e.target.style.height = Math.max(46, e.target.scrollHeight) + "px"
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleCellSave(row.id, column.id)
              } else if (e.key === "Escape") {
                handleCellCancel()
              }
            }}
            onBlur={() => {
              handleCellSave(row.id, column.id)
            }}
            onFocus={(e) => {
              // Auto-resize on focus
              e.target.style.height = "auto"
              e.target.style.height = Math.max(46, e.target.scrollHeight) + "px"
            }}
          />
        </div>
      )
    }

    // Display mode untuk text dan number
    const displayValue = () => {
      if (!value) return ""
      return value
    }

    return (
      <div
        className="cursor-pointer hover:bg-muted/50 p-3 rounded min-h-[50px] flex items-start break-words"
        onClick={() => handleCellClick(row.id, column.id, value)}
      >
        <span className="w-full whitespace-pre-wrap leading-relaxed" title={value}>
          {displayValue()}
        </span>
      </div>
    )
  }, [editingCell, editingValue, handleCellSave, handleCellCancel, getColumnOptions, currentDatabase]) // Hapus `rows` dari dependency array. `rows` digunakan oleh handleCellSave, bukan langsung oleh renderCellContent.

  const renderNewRowInput = useCallback((column) => {
    const value = newRowData[column.id] || ""
    const columnOptions = getColumnOptions(column.id)

    if (column.type === "select") {
      return (
        <Select value={value} onValueChange={(val) => setNewRowData((prev) => ({ ...prev, [column.id]: val }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            {columnOptions.map((option) => (
              <SelectItem key={option.id} value={option.value}>
                {option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    } else if (column.type === "boolean") {
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={column.id}
            checked={value === true || value === "true"}
            onCheckedChange={(checked) => setNewRowData((prev) => ({ ...prev, [column.id]: checked }))}
          />
          <Label htmlFor={column.id} className="text-sm font-medium">
            {value ? "Yes" : "No"}
          </Label>
        </div>
      )
    } else if (column.type === "date") {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(new Date(value), "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(date) => {
                const formattedDate = date ? format(date, "yyyy-MM-dd") : ""
                setNewRowData((prev) => ({ ...prev, [column.id]: formattedDate }))
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )
    } else {
      return (
        <Input
          value={value}
          onChange={(e) => setNewRowData((prev) => ({ ...prev, [column.id]: e.target.value }))}
          type={column.type === "number" ? "number" : "text"}
          placeholder={`Enter ${column.name.toLowerCase()}`}
        />
      )
    }
  }, [newRowData, getColumnOptions])

  if (loading) { // Hapus businessLoading dan authLoading
    return (
        <div className="flex flex-col items-center justify-center h-full">
             <LoaderCircle className="h-12 w-12 text-muted-foreground animate-spin" /> {/* Gunakan LoaderCircle langsung */}
            <p className="mt-4 text-muted-foreground">Memuat data database...</p>
        </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <p>{error}</p>
        <p>Pastikan Anda memiliki izin yang benar atau channel sudah ada.</p>
      </div>
    );
  }

  if (!currentDatabase) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No database found for this channel.</p>
        <p>Anda bisa membuat database baru untuk channel ini jika Anda memiliki izin.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          Hapus SidebarTrigger karena sidebar tidak ada
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Database className="h-5 w-5" />
          <span className="font-semibold">{selectedChannelLocal?.name}</span>
          <span className="text-muted-foreground">/ {currentDatabase?.title}</span>
        </header> */}

      <div className="p-6 flex flex-col space-y-6 flex-1 min-h-0">
        {/* Database Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{currentDatabase?.title}</h1>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          {/* Left side - View buttons */}
          <div className="flex items-center gap-2">
              <Button
                variant={currentView === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("table")}
              >
                <TableIcon className="h-4 w-4 mr-2" />
                Table
              </Button>
              <Button
                variant={currentView === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("kanban")}
              >
                <SquareKanban className="h-4 w-4 mr-2" />
                Kanban
              </Button>
              <Button
                variant={currentView === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("calendar")}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar
              </Button>
            </div>

            {/* Right side - New and Search */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Sheet open={isNewRowSheetOpen} onOpenChange={setIsNewRowSheetOpen}>
                <SheetTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Add New Row</SheetTitle>
                    <SheetDescription>
                      Fill in the information below to add a new row to your database.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    {columns.map((column) => (
                      <div key={column.id} className="space-y-2">
                        <Label htmlFor={column.id}>
                          {column.name}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {column.type}
                          </Badge>
                        </Label>
                        {renderNewRowInput(column)}
                      </div>
                    ))}
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleNewRowSubmit} className="flex-1">
                        Add Row
                      </Button>
                      <Button variant="outline" onClick={() => setIsNewRowSheetOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Database Table using shadcn Table component */}
          <ScrollArea className="flex-1">
            <div className="border rounded-lg">
              <Table>
                <TableHeader className="bg-background whitespace-nowrap sticky top-0 z-10">
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column.id} className="w-[200px] h-[60px]">
                        <Popover
                          open={selectedColumnPopover === column.id}
                          onOpenChange={(open) => {
                            setSelectedColumnPopover(open ? column.id : null)
                            if (open) {
                              setEditColumnName(column.name)
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <div className="flex items-center justify-between group cursor-pointer hover:bg-muted/50 p-1 rounded">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{column.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {column.type}
                                </Badge>
                              </div>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-96">
                            {column.type === "select" ? (
                              renderSelectOptionsManagement(column)
                            ) : (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium">Column Options</h4>
                                  <p className="text-sm text-muted-foreground">Manage this column settings.</p>
                                </div>
                                <div className="space-y-3">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Column Name</label>
                                    <Input
                                      placeholder="Enter column name"
                                      value={editColumnName}
                                      onChange={(e) => setEditColumnName(e.target.value)}
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => handleEditColumn(column.id, editColumnName)}
                                      className="flex-1"
                                    >
                                      <Edit3 className="h-4 w-4 mr-2" />
                                      Update
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="destructive">
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Column</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete the column {column.name}? This action cannot be
                                            undone and will remove all data in this column.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteColumn(column.id)}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          >
                                            Delete Column
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              </div>
                            )}
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                    ))}
                    {/* Add Column Button */}
                    <TableHead className="w-[60px]">
                      <Popover open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
                        <PopoverTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">Add New Column</h4>
                              <p className="text-sm text-muted-foreground">Create a new column for your database.</p>
                            </div>
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Column Name</label>
                                <Input
                                  placeholder="Enter column name"
                                  value={newColumnName}
                                  onChange={(e) => setNewColumnName(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Column Type</label>
                                <Select value={newColumnType} onValueChange={setNewColumnType}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="number">Number</SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="select">Select</SelectItem>
                                    <SelectItem value="boolean">Boolean</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button onClick={handleAddColumn} className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Column
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableHead>
                    <TableHead className="w-[60px]">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      {columns.map((column) => (
                        <TableCell key={column.id} className="p-0 w-[200px] align-top">
                          {renderCellContent(row, column)}
                        </TableCell>
                      ))}
                      <TableCell className="w-[60px]"></TableCell>
                      <TableCell className="w-[60px]">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Row</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this row? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteRow(row.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete Row
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Add Row Button */}
                  <TableRow>
                    <TableCell colSpan={columns.length + 2} className="p-0">
                      <div className="flex items-center p-3">
                        <Button size="sm" variant="ghost" onClick={handleAddRow} className="h-auto px-3 flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          <span className="text-sm text-muted-foreground">Add new row</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </ScrollArea>

          {rows.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No data yet. Click Add Row to get started.</p>
            </div>
          )}
      </div>
    </div>
  )
}
