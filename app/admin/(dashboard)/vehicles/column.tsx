"use client"

import { Doc } from "@/convex/_generated/dataModel"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { Star, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { useState } from "react"

const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700 border-gray-200",
    pending_approval: "bg-yellow-50 text-yellow-700 border-yellow-200",
    active: "bg-green-50 text-green-700 border-green-200",
    reserved: "bg-blue-50 text-blue-700 border-blue-200",
    sold: "bg-purple-50 text-purple-700 border-purple-200",
    archived: "bg-gray-50 text-gray-600 border-gray-200",
}

interface VehicleActionsHandlers {
    onView: (vehicle: Doc<"vehicles">) => void
    onEdit: (vehicle: Doc<"vehicles">) => void
    onDelete: (vehicle: Doc<"vehicles">) => void
    onRefresh?: () => void
}

export const columns = (handlers: VehicleActionsHandlers): ColumnDef<Doc<"vehicles">>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    indeterminate={
                        table.getIsSomePageRowsSelected() &&
                        !table.getIsAllPageRowsSelected()
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="h-6 w-6"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="h-6 w-6"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "image",
        header: "",
        cell: ({ row }) => {
            const images = row.original.images as string[] | undefined
            const imageUrl = images && images.length > 0 ? images[0] : null
            return (
                <div className="h-10 w-16 rounded-md overflow-hidden bg-muted/50">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Vehicle"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                            No img
                        </div>
                    )}
                </div>
            )
        },
        enableSorting: false,
        enableHiding: true,
    },
    {
        accessorKey: "vehicle",
        header: "Vehicle",
        cell: ({ row }) => {
            const title = row.original.title
            const make = row.original.make
            const model = row.original.model
            const year = row.original.year
            return (
                <div className="space-y-0.5 max-w-[200px]">
                    <div className="font-medium text-sm truncate" title={title}>
                        {title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                        {make} {model} · {year}
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = row.getValue("price") as number
            const currency = row.original.currency || "KES"
            return (
                <div className="font-medium text-sm">
                    {currency} {price.toLocaleString()}
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const displayStatus = status?.replace(/_/g, " ")
            return (
                <Badge variant="outline" className={statusColors[status] || "bg-gray-50 text-gray-700 border-gray-200"}>
                    {displayStatus}
                </Badge>
            )
        },
    },
    {
        accessorKey: "city",
        header: "Location",
        cell: ({ row }) => {
            const city = row.getValue("city") as string
            const country = row.original.country
            return (
                <div className="text-sm">
                    {city}
                    {country && <span className="text-muted-foreground">, {country}</span>}
                </div>
            )
        },
    },
    {
        accessorKey: "featured",
        header: "Featured",
        cell: ({ row }) => {
            const featured = row.getValue("featured") as boolean
            const vehicle = row.original
            const toggleFeatured = useMutation(api.vehicles.toggleFeatured)
            const [localFeatured, setLocalFeatured] = useState(featured)

            const handleChange = async (value: string) => {
                const newFeatured = value === "true"
                // Optimistic update - update UI immediately
                setLocalFeatured(newFeatured)

                try {
                    await toggleFeatured({ id: vehicle._id, featured: newFeatured })
                    toast.success(`Vehicle ${newFeatured ? "featured" : "unfeatured"} successfully`)
                } catch (error) {
                    console.error("Failed to toggle featured:", error)
                    toast.error("Failed to update featured status")
                    // Revert on error
                    setLocalFeatured(featured)
                }
            }

            return (
                <Select
                    value={localFeatured ? "true" : "false"}
                    onValueChange={handleChange}
                >
                    <SelectTrigger className="h-8 w-20">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            )
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const vehicle = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger >
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-md">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handlers.onView(vehicle)}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handlers.onEdit(vehicle)}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer text-destructive"
                            onClick={() => handlers.onDelete(vehicle)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
    {
        accessorKey: "make",
        header: "Make",
        cell: ({ row }) => <div className="text-sm">{row.getValue("make")}</div>,
    },
    {
        accessorKey: "model",
        header: "Model",
        cell: ({ row }) => <div className="text-sm">{row.getValue("model")}</div>,
    },
    {
        accessorKey: "year",
        header: "Year",
        cell: ({ row }) => <div className="text-sm">{row.getValue("year")}</div>,
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const category = row.getValue("category") as string
            return (
                <div className="text-sm">
                    {category?.replace(/_/g, " ").toUpperCase()}
                </div>
            )
        },
    },
    {
        accessorKey: "condition",
        header: "Condition",
        cell: ({ row }) => {
            const condition = row.getValue("condition") as string
            return (
                <div className="text-sm">
                    {condition?.replace(/_/g, " ").toUpperCase()}
                </div>
            )
        },
    },
]
