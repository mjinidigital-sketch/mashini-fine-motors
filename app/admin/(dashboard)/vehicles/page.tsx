"use client"

import { VehiclesDataTable } from "./data-table"
import { CarFormSheet } from "./carFormSheet"
import { useConvex } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default function VehiclesPage() {
    const convex = useConvex()
    const [vehicles, setVehicles] = useState<Doc<"vehicles">[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState<Doc<"vehicles"> | undefined>()

    useEffect(() => {
        const loadVehicles = async () => {
            try {
                const data = await convex.query(api.vehicles.getAllVehicles)
                setVehicles(data)
            } catch (error) {
                console.error("Failed to load vehicles:", error)
                toast.error("Failed to load vehicles")
            } finally {
                setIsLoading(false)
            }
        }

        loadVehicles()
    }, [convex])

    const handleRefresh = async () => {
        setIsLoading(true)
        try {
            const data = await convex.query(api.vehicles.getAllVehicles)
            setVehicles(data)
            toast.success("Vehicles refreshed")
        } catch (error) {
            console.error("Failed to refresh vehicles:", error)
            toast.error("Failed to refresh vehicles")
        } finally {
            setIsLoading(false)
        }
    }

    const handleView = (vehicle: Doc<"vehicles">) => {
        console.log("View vehicle:", vehicle)
        toast.info("View vehicle functionality not yet implemented")
    }

    const handleEdit = (vehicle: Doc<"vehicles">) => {
        setSelectedVehicle(vehicle)
        setIsFormOpen(true)
    }

    const handleDelete = (vehicle: Doc<"vehicles">) => {
        console.log("Delete vehicle:", vehicle)
        toast.info("Delete vehicle functionality not yet implemented")
    }

    const handleAddNew = () => {
        setSelectedVehicle(undefined)
        setIsFormOpen(true)
    }

    const handleFormSuccess = () => {
        handleRefresh()
    }

    return (
        <div className="flex h-full flex-col p-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">Vehicles</h1>
                <Button onClick={handleAddNew} className="h-11 rounded-md">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Vehicle
                </Button>
            </div>
            <VehiclesDataTable
                data={vehicles as Doc<"vehicles">[]}
                handlers={{ onView: handleView, onEdit: handleEdit, onDelete: handleDelete }}
                onRefresh={handleRefresh}
                isLoading={isLoading}
            />
            <CarFormSheet
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                vehicle={selectedVehicle}
                onSuccess={handleFormSuccess}
            />
        </div>
    )
}
