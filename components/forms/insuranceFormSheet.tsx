"use client"

import * as React from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ShieldCheckIcon, Loader2Icon } from "lucide-react"

interface InsuranceFormSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    userId: Id<"users">
    userClerkId?: string
    vehicles?: any[]
    onSuccess?: () => void
}

const INSURANCE_PROVIDERS = [
    "Jubilee Insurance",
    "APA Insurance",
    "Britam General Insurance",
    "CIC Insurance Group",
    "Heritage Insurance",
    "ICEA LION General",
    "Madison Insurance",
    "Directline Assurance",
    "First Assurance",
    "AIG Kenya",
    "Other Provider",
]

export function InsuranceFormSheet({
    open,
    onOpenChange,
    userId,
    userClerkId,
    vehicles = [],
    onSuccess,
}: InsuranceFormSheetProps) {
    const createInsurance = useMutation(api.insurance.create)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const [formData, setFormData] = React.useState({
        policyNumber: `POL-${Math.floor(100000 + Math.random() * 900000)}`,
        provider: "Jubilee Insurance",
        coverageType: "comprehensive" as "comprehensive" | "third_party" | "third_party_fire_theft",
        vehicleDetails: "",
        vehicleId: "" as string,
        premiumAmount: 65000,
        currency: "KES",
        durationMonths: 12,
        status: "active" as "active" | "pending" | "expired" | "cancelled",
        agentName: "Mashini Assurance Services",
        agentContact: "+254 700 000 000",
        notes: "Standard annual comprehensive automotive policy.",
    })

    // If user has vehicles, prefill first vehicle
    React.useEffect(() => {
        if (vehicles && vehicles.length > 0 && !formData.vehicleDetails) {
            const first = vehicles[0]
            const details = `${first.year} ${first.make} ${first.model} ${first.registrationNumber ? `(${first.registrationNumber})` : ""}`.trim()
            setFormData((prev) => ({
                ...prev,
                vehicleId: first._id,
                vehicleDetails: details,
            }))
        }
    }, [vehicles, open])

    const handleVehicleSelect = (val: string) => {
        if (val === "custom") {
            setFormData((prev) => ({ ...prev, vehicleId: "", vehicleDetails: "" }))
            return
        }
        const v = vehicles.find((item) => item._id === val)
        if (v) {
            const details = `${v.year} ${v.make} ${v.model} ${v.registrationNumber ? `(${v.registrationNumber})` : ""}`.trim()
            setFormData((prev) => ({
                ...prev,
                vehicleId: v._id,
                vehicleDetails: details,
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.vehicleDetails.trim()) {
            toast.error("Please enter or select vehicle details")
            return
        }

        try {
            setIsSubmitting(true)
            const now = Date.now()
            const endDate = now + formData.durationMonths * 30 * 24 * 60 * 60 * 1000

            await createInsurance({
                userId,
                userClerkId,
                vehicleId: formData.vehicleId ? (formData.vehicleId as Id<"vehicles">) : undefined,
                vehicleDetails: formData.vehicleDetails.trim(),
                policyNumber: formData.policyNumber.trim(),
                provider: formData.provider,
                coverageType: formData.coverageType,
                premiumAmount: Number(formData.premiumAmount) || 0,
                currency: formData.currency,
                startDate: now,
                endDate,
                status: formData.status,
                agentName: formData.agentName,
                agentContact: formData.agentContact,
                notes: formData.notes,
            })

            toast.success("Insurance policy created successfully!")
            onOpenChange(false)
            onSuccess?.()
        } catch (error: any) {
            console.error("Failed to create policy:", error)
            toast.error(error?.message || "Failed to create policy")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto p-6 thin-scrollbar w-[85vw] sm:w-[65vw] lg:w-[45vw]">
                <SheetHeader className="mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <ShieldCheckIcon className="size-5" />
                        </div>
                        <div>
                            <SheetTitle className="text-xl font-bold">New Insurance Policy</SheetTitle>
                            <SheetDescription className="text-sm">
                                Register or link an auto insurance policy for this user
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="policyNumber">Policy Number *</Label>
                        <Input
                            id="policyNumber"
                            value={formData.policyNumber}
                            onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="provider">Insurance Underwriter *</Label>
                            <Select
                                value={formData.provider}
                                onValueChange={(val) => setFormData({ ...formData, provider: val })}
                            >
                                <SelectTrigger id="provider" className="h-10">
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {INSURANCE_PROVIDERS.map((p) => (
                                            <SelectItem key={p} value={p}>
                                                {p}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="coverageType">Coverage Tier *</Label>
                            <Select
                                value={formData.coverageType}
                                onValueChange={(val: any) => setFormData({ ...formData, coverageType: val })}
                            >
                                <SelectTrigger id="coverageType" className="h-10">
                                    <SelectValue placeholder="Select coverage" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="comprehensive">Comprehensive</SelectItem>
                                        <SelectItem value="third_party">Third Party Only</SelectItem>
                                        <SelectItem value="third_party_fire_theft">Third Party, Fire & Theft</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Vehicle link */}
                    {vehicles && vehicles.length > 0 && (
                        <div className="space-y-2">
                            <Label htmlFor="linkedVehicle">Select from User's Cars</Label>
                            <Select
                                value={formData.vehicleId || "custom"}
                                onValueChange={handleVehicleSelect}
                            >
                                <SelectTrigger id="linkedVehicle" className="h-10">
                                    <SelectValue placeholder="Choose a registered vehicle" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="custom">-- Custom / Other Vehicle --</SelectItem>
                                        {vehicles.map((v) => (
                                            <SelectItem key={v._id} value={v._id}>
                                                {v.year} {v.make} {v.model} ({v.price.toLocaleString()} {v.currency})
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="vehicleDetails">Vehicle Details / Plate Number *</Label>
                        <Input
                            id="vehicleDetails"
                            placeholder="e.g. 2023 Toyota Land Cruiser Prado - KDD 123A"
                            value={formData.vehicleDetails}
                            onChange={(e) => setFormData({ ...formData, vehicleDetails: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="premiumAmount">Annual Premium Amount</Label>
                            <Input
                                id="premiumAmount"
                                type="number"
                                min="0"
                                value={formData.premiumAmount}
                                onChange={(e) => setFormData({ ...formData, premiumAmount: Number(e.target.value) })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select
                                value={formData.currency}
                                onValueChange={(val) => setFormData({ ...formData, currency: val })}
                            >
                                <SelectTrigger id="currency" className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="KES">KES</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="durationMonths">Policy Term</Label>
                            <Select
                                value={String(formData.durationMonths)}
                                onValueChange={(val) => setFormData({ ...formData, durationMonths: Number(val) })}
                            >
                                <SelectTrigger id="durationMonths" className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="1">1 Month (Temporary)</SelectItem>
                                        <SelectItem value="3">3 Months (Quarterly)</SelectItem>
                                        <SelectItem value="6">6 Months (Semi-Annual)</SelectItem>
                                        <SelectItem value="12">12 Months (Annual Standard)</SelectItem>
                                        <SelectItem value="24">24 Months (2 Years)</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Policy Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                            >
                                <SelectTrigger id="status" className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="active">Active (Covered)</SelectItem>
                                        <SelectItem value="pending">Pending Underwriting</SelectItem>
                                        <SelectItem value="expired">Expired</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="agentName">Servicing Agent / Broker</Label>
                            <Input
                                id="agentName"
                                value={formData.agentName}
                                onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="agentContact">Agent Helpline / Phone</Label>
                            <Input
                                id="agentContact"
                                value={formData.agentContact}
                                onChange={(e) => setFormData({ ...formData, agentContact: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2 border-t">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="gap-2">
                            {isSubmitting ? (
                                <>
                                    <Loader2Icon className="size-4 animate-spin" />
                                    Creating Policy...
                                </>
                            ) : (
                                "Create Insurance Policy"
                            )}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}
