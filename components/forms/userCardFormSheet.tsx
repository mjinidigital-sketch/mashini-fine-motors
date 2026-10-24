"use client"

import * as React from "react"
import { UserCardForm } from "./userCardForm"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

interface UserCardFormSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: any
    onSuccess?: () => void
}

export function UserCardFormSheet({ open, onOpenChange, user, onSuccess }: UserCardFormSheetProps) {
    const handleSuccess = () => {
        onOpenChange(false)
        onSuccess?.()
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="overflow-y-auto p-6 thin-scrollbar w-[85vw] sm:w-[75vw] lg:w-[50vw]"
            >
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-2xl font-bold tracking-tight">
                        {user ? `Edit User: ${user.name || "Profile"}` : "Create User Profile"}
                    </SheetTitle>
                    <SheetDescription className="text-sm text-muted-foreground">
                        {user
                            ? "Update account credentials, contact information, role permissions, and dealership parameters."
                            : "Provide the required details to create and configure a user profile."}
                    </SheetDescription>
                </SheetHeader>
                <div className="pb-8">
                    <UserCardForm
                        user={user}
                        onSuccess={handleSuccess}
                        onCancel={() => onOpenChange(false)}
                    />
                </div>
            </SheetContent>
        </Sheet>
    )
}
