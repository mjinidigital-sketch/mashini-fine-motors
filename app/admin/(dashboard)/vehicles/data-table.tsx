"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Columns3Icon,
    ChevronDownIcon,
    ChevronsLeftIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsRightIcon,
    RefreshCwIcon,
} from "lucide-react"
import { VehicleStatusEnum, ConditionEnum, CategoryEnum } from "@/app/schemas/vehicle"
import { Doc } from "@/convex/_generated/dataModel"
import { columns } from "./column"

interface VehicleActionsHandlers {
    onView: (vehicle: Doc<"vehicles">) => void
    onEdit: (vehicle: Doc<"vehicles">) => void
    onDelete: (vehicle: Doc<"vehicles">) => void
}

export function VehiclesDataTable({
    data: initialData,
    handlers,
    onRefresh,
    isLoading,
}: {
    data: Doc<"vehicles">[]
    handlers: VehicleActionsHandlers
    onRefresh?: () => void
    isLoading?: boolean
}) {
    const [data, setData] = React.useState<Doc<"vehicles">[]>(() => initialData)
    const [isRefreshing, setIsRefreshing] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [yearFilter, setYearFilter] = React.useState<string>("all")
    const [makeFilter, setMakeFilter] = React.useState<string>("all")
    const [modelFilter, setModelFilter] = React.useState<string>("all")
    const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
    const [statusFilter, setStatusFilter] = React.useState<string>("all")
    const [conditionFilter, setConditionFilter] = React.useState<string>("all")

    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        make: false,
        model: false,
        year: false,
        category: false,
        condition: false,
    })
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })

    // Keep data in sync with initialData if server updates it
    React.useEffect(() => {
        setData(initialData)
    }, [initialData])

    const refreshData = async () => {
        setIsRefreshing(true)
        try {
            await onRefresh?.()
        } catch (error: any) {
            toast.error(error?.message || "Failed to refresh vehicles")
        } finally {
            setIsRefreshing(false)
        }
    }

    // Get unique values for filters
    const uniqueMakes = React.useMemo(() => {
        return Array.from(new Set(data.map((v) => v.make))).sort()
    }, [data])

    const uniqueModels = React.useMemo(() => {
        return Array.from(new Set(data.map((v) => v.model))).sort()
    }, [data])

    const uniqueYears = React.useMemo(() => {
        return Array.from(new Set(data.map((v) => v.year))).sort((a, b) => b - a)
    }, [data])

    // Filter data based on search query and filters
    const filteredData = React.useMemo(() => {
        let result = data

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (vehicle) =>
                    (vehicle.title?.toLowerCase() || "").includes(query) ||
                    (vehicle.make?.toLowerCase() || "").includes(query) ||
                    (vehicle.model?.toLowerCase() || "").includes(query) ||
                    (vehicle.registrationNumber?.toLowerCase() || "").includes(query) ||
                    (vehicle.vinOrChassisNumber?.toLowerCase() || "").includes(query)
            )
        }

        if (makeFilter !== "all") {
            result = result.filter((vehicle) => vehicle.make === makeFilter)
        }

        if (modelFilter !== "all") {
            result = result.filter((vehicle) => vehicle.model === modelFilter)
        }

        if (yearFilter !== "all") {
            result = result.filter((vehicle) => vehicle.year.toString() === yearFilter)
        }

        if (categoryFilter !== "all") {
            result = result.filter((vehicle) => vehicle.category === categoryFilter)
        }

        if (statusFilter !== "all") {
            result = result.filter((vehicle) => vehicle.status === statusFilter)
        }

        if (conditionFilter !== "all") {
            result = result.filter((vehicle) => vehicle.condition === conditionFilter)
        }

        return result
    }, [data, searchQuery, yearFilter, makeFilter, modelFilter, categoryFilter, statusFilter, conditionFilter])

    const table = useReactTable({
        data: filteredData,
        columns: columns({ ...handlers, onRefresh }),
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        getRowId: (row) => (row as any)._id,
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    return (
        <div className="flex flex-col gap-4 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs font-medium text-muted-foreground">Search</Label>
                        <Input
                            placeholder="Search vehicles..."
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            className="w-80 h-11 rounded-md"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs font-medium text-muted-foreground">Make</Label>
                        <Select
                            value={makeFilter}
                            onValueChange={(value) => setMakeFilter(value ?? "all")}
                        >
                            <SelectTrigger className="w-[180px] h-11 rounded-md">
                                <SelectValue placeholder="All Makes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">All Makes</SelectItem>
                                    {uniqueMakes.map((make) => (
                                        <SelectItem key={make} value={make}>
                                            {make}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs font-medium text-muted-foreground">Model</Label>
                        <Select
                            value={modelFilter}
                            onValueChange={(value) => setModelFilter(value ?? "all")}
                        >
                            <SelectTrigger className="w-[180px] h-11 rounded-md">
                                <SelectValue placeholder="All Models" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">All Models</SelectItem>
                                    {uniqueModels.map((model) => (
                                        <SelectItem key={model} value={model}>
                                            {model}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs font-medium text-muted-foreground">Year</Label>
                        <Select
                            value={yearFilter}
                            onValueChange={(value) => setYearFilter(value ?? "all")}
                        >
                            <SelectTrigger className="w-[100px] h-11 rounded-md">
                                <SelectValue placeholder="All Years" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">All Years</SelectItem>
                                    {uniqueYears.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs font-medium text-muted-foreground">Category</Label>
                        <Select
                            value={categoryFilter}
                            onValueChange={(value) => setCategoryFilter(value ?? "all")}
                        >
                            <SelectTrigger className="w-[180px] h-11 rounded-md">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {CategoryEnum.options.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category.replace(/_/g, " ").toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                        <Select
                            value={statusFilter}
                            onValueChange={(value) => setStatusFilter(value ?? "all")}
                        >
                            <SelectTrigger className="w-[180px] h-11 rounded-md">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">All Status</SelectItem>
                                    {VehicleStatusEnum.options.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status.replace(/_/g, " ").toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs font-medium text-muted-foreground">Condition</Label>
                        <Select
                            value={conditionFilter}
                            onValueChange={(value) => setConditionFilter(value ?? "all")}
                        >
                            <SelectTrigger className="w-[140px] h-11 rounded-md">
                                <SelectValue placeholder="Condition" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">All Conditions</SelectItem>
                                    {ConditionEnum.options.map((condition) => (
                                        <SelectItem key={condition} value={condition}>
                                            {condition.replace(/_/g, " ").toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs font-medium text-muted-foreground">&nbsp;</Label>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refreshData}
                            disabled={isRefreshing}
                            className="gap-2 h-11 rounded-md"
                        >
                            <RefreshCwIcon className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs font-medium text-muted-foreground">&nbsp;</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger >
                                <Button variant="outline" size="sm" className="h-11 rounded-md">
                                    <Columns3Icon className="mr-2 h-4 w-4" />
                                    Columns
                                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                }
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>
            </div>

            <div className="rounded-lg border bg-card shadow-xs">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={table.getAllColumns().length}
                                    className="h-28 text-center text-muted-foreground"
                                >
                                    Loading vehicles...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-muted/40 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={table.getAllColumns().length}
                                    className="h-28 text-center text-muted-foreground"
                                >
                                    No vehicles found matching current filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="text-xs text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="rows-per-page" className="text-xs font-medium text-muted-foreground">
                            Rows per page
                        </Label>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger size="sm" className="w-18 h-8 rounded-md" id="rows-per-page">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                <SelectGroup>
                                    {[10, 20, 30, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="text-xs font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {Math.max(1, table.getPageCount())}
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            className="size-8 rounded-md"
                            size="icon"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">First page</span>
                            <ChevronsLeftIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8 rounded-md"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Previous page</span>
                            <ChevronLeftIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8 rounded-md"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Next page</span>
                            <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8 rounded-md"
                            size="icon"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Last page</span>
                            <ChevronsRightIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

