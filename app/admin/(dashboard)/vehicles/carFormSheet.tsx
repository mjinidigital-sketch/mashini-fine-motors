"use client"

import * as React from "react"
import { Doc } from "@/convex/_generated/dataModel"
import { CarForm } from "./carForm"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

interface CarFormSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    vehicle?: Doc<"vehicles">
    onSuccess?: () => void
}

export function CarFormSheet({ open, onOpenChange, vehicle, onSuccess }: CarFormSheetProps) {
    const handleSuccess = () => {
        onOpenChange(false)
        onSuccess?.()
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="overflow-y-auto p-6 thin-scrollbar w-[70vw] lg:w-[55vw]"
            >
                <SheetHeader className="mb-8">
                    <SheetTitle className="text-2xl font-semibold">
                        {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
                    </SheetTitle>
                    <SheetDescription className="text-base">
                        {vehicle
                            ? "Update the vehicle information. Click save when you're done."
                            : "Fill in the vehicle details to add it to your inventory."}
                    </SheetDescription>
                </SheetHeader>
                <div className="pb-8">
                    <CarForm vehicle={vehicle} onSuccess={handleSuccess} onCancel={() => onOpenChange(false)} />
                </div>
            </SheetContent>
        </Sheet>
    )
}
