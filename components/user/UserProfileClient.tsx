"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { useSearchParams, useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    UserIcon,
    MailIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarIcon,
    ShieldCheckIcon,
    CarIcon,
    FileTextIcon,
    MessageSquareIcon,
    PlusIcon,
    SearchIcon,
    ExternalLinkIcon,
    PencilIcon,
    Trash2Icon,
    CheckCircle2Icon,
    ClockIcon,
    XCircleIcon,
    Building2Icon,
    StarIcon,
    EyeIcon,
    TagIcon,
    ArrowRightIcon,
    CopyIcon,
    EllipsisVerticalIcon,
    MessageCircleIcon,
    CheckIcon,
    ShieldIcon,
    LayersIcon,
    AlertCircleIcon,
} from "lucide-react"

import { UserCardForm } from "@/components/forms/userCardForm"
import { UserCardFormSheet } from "@/components/forms/userCardFormSheet"
import { CarFormSheet } from "@/app/admin/(dashboard)/vehicles/carFormSheet"
import { InsuranceFormSheet } from "@/components/forms/insuranceFormSheet"

interface UserProfileClientProps {
    userId: string
}

export function UserProfileClient({ userId }: UserProfileClientProps) {
    // ------------------------------------------------------------------------
    // URL PARAMS
    // ------------------------------------------------------------------------
    const searchParams = useSearchParams()
    const router = useRouter()
    const tabParam = searchParams.get("tab") as "overview" | "cars" | "insurance" | "inquiries" | "edit" | null

    // ------------------------------------------------------------------------
    // CONVEX LIVE QUERIES
    // ------------------------------------------------------------------------
    const user = useQuery(api.users.getById, { id: userId })
    const vehicles = useQuery(api.vehicles.listByUserFlexible, { userIdentifier: userId })
    const insurancePolicies = useQuery(api.insurance.listByUserFlexible, { userIdentifier: userId })
    const inquiriesData = useQuery(api.inquiries.listEnrichedByUserFlexible, { userIdentifier: userId })

    // Mutations
    const updateVehicleStatus = useMutation(api.vehicles.updateVehicleStatus)
    const deleteVehicle = useMutation(api.vehicles.deleteVehicle)
    const deleteInsurance = useMutation(api.insurance.remove)
    const updateInquiryStatus = useMutation(api.inquiries.updateStatus)

    // ------------------------------------------------------------------------
    // UI STATES
    // ------------------------------------------------------------------------
    const [activeTab, setActiveTab] = React.useState<"overview" | "cars" | "insurance" | "inquiries" | "edit">(tabParam || "overview")
    const [inquirySubTab, setInquirySubTab] = React.useState<"received" | "sent">("received")

    // Update URL when tab changes
    const handleTabChange = (tab: "overview" | "cars" | "insurance" | "inquiries" | "edit") => {
        setActiveTab(tab)
        router.push(`/user?tab=${tab}`)
    }

    // Sync with URL params
    React.useEffect(() => {
        if (tabParam && tabParam !== activeTab) {
            setActiveTab(tabParam)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabParam])

    // Filter states
    const [carSearch, setCarSearch] = React.useState("")
    const [carStatusFilter, setCarStatusFilter] = React.useState("all")
    const [insuranceSearch, setInsuranceSearch] = React.useState("")
    const [insuranceStatusFilter, setInsuranceStatusFilter] = React.useState("all")
    const [inquirySearch, setInquirySearch] = React.useState("")
    const [inquiryStatusFilter, setInquiryStatusFilter] = React.useState("all")

    // Modals / Sheets
    const [userFormSheetOpen, setUserFormSheetOpen] = React.useState(false)
    const [carFormSheetOpen, setCarFormSheetOpen] = React.useState(false)
    const [editingVehicle, setEditingVehicle] = React.useState<any>(null)
    const [insuranceSheetOpen, setInsuranceSheetOpen] = React.useState(false)

    // Inquiry message preview modal
    const [selectedInquiry, setSelectedInquiry] = React.useState<any>(null)
    const [counterPriceInput, setCounterPriceInput] = React.useState("")
    const [isCountering, setIsCountering] = React.useState(false)

    // ------------------------------------------------------------------------
    // DERIVED VALUES
    // ------------------------------------------------------------------------
    const userName = user?.name || "User Profile"
    const userEmail = user?.email || "No email registered"
    const userPhone = user?.phone || "No phone registered"
    const userRole = (user?.role || "user").toLowerCase()
    const isDealer = user?.isDealer || userRole === "dealer"
    const initials = userName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"

    // Filtered cars
    const filteredCars = React.useMemo(() => {
        if (!vehicles) return []
        return vehicles.filter((v) => {
            const matchesQuery =
                !carSearch ||
                v.title.toLowerCase().includes(carSearch.toLowerCase()) ||
                v.make.toLowerCase().includes(carSearch.toLowerCase()) ||
                v.model.toLowerCase().includes(carSearch.toLowerCase()) ||
                (v.registrationNumber && v.registrationNumber.toLowerCase().includes(carSearch.toLowerCase()))

            const matchesStatus = carStatusFilter === "all" || v.status === carStatusFilter
            return matchesQuery && matchesStatus
        })
    }, [vehicles, carSearch, carStatusFilter])

    // Filtered insurance policies
    const filteredInsurance = React.useMemo(() => {
        if (!insurancePolicies) return []
        return insurancePolicies.filter((p) => {
            const matchesQuery =
                !insuranceSearch ||
                p.policyNumber.toLowerCase().includes(insuranceSearch.toLowerCase()) ||
                p.provider.toLowerCase().includes(insuranceSearch.toLowerCase()) ||
                p.vehicleDetails.toLowerCase().includes(insuranceSearch.toLowerCase())

            const matchesStatus = insuranceStatusFilter === "all" || p.status === insuranceStatusFilter
            return matchesQuery && matchesStatus
        })
    }, [insurancePolicies, insuranceSearch, insuranceStatusFilter])

    // Filtered inquiries
    const currentInquiriesList = inquirySubTab === "received" ? inquiriesData?.received || [] : inquiriesData?.sent || []
    const filteredInquiries = React.useMemo(() => {
        return currentInquiriesList.filter((inq) => {
            const matchesQuery =
                !inquirySearch ||
                inq.message.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                (inq.vehicle?.title && inq.vehicle.title.toLowerCase().includes(inquirySearch.toLowerCase())) ||
                (inq.buyer?.name && inq.buyer.name.toLowerCase().includes(inquirySearch.toLowerCase()))

            const matchesStatus = inquiryStatusFilter === "all" || inq.status === inquiryStatusFilter
            return matchesQuery && matchesStatus
        })
    }, [currentInquiriesList, inquirySearch, inquiryStatusFilter])

    // Quick Stats
    const totalCarsCount = vehicles?.length ?? 0
    const activeCarsCount = vehicles?.filter((v) => v.status === "active").length ?? 0
    const activeInsuranceCount = insurancePolicies?.filter((p) => p.status === "active").length ?? 0
    const totalInsurancePremium = insurancePolicies?.reduce((acc, curr) => acc + (curr.premiumAmount || 0), 0) ?? 0
    const totalInquiriesReceived = inquiriesData?.received?.length ?? 0
    const totalInquiriesSent = inquiriesData?.sent?.length ?? 0

    // Handlers
    const handleCopyEmail = () => {
        if (user?.email) {
            navigator.clipboard.writeText(user.email)
            toast.success("Email copied to clipboard")
        }
    }

    const handleCarStatusChange = async (vehicleId: Id<"vehicles">, status: "active" | "draft" | "sold" | "reserved") => {
        try {
            await updateVehicleStatus({ id: vehicleId, status })
            toast.success(`Vehicle status updated to ${status}`)
        } catch (error: any) {
            toast.error(error?.message || "Failed to update vehicle status")
        }
    }

    const handleDeleteCar = async (vehicleId: Id<"vehicles">, title: string) => {
        if (!confirm(`Are you sure you want to delete ${title}?`)) return
        try {
            await deleteVehicle({ id: vehicleId })
            toast.success("Vehicle deleted successfully")
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete vehicle")
        }
    }

    const handleDeletePolicy = async (policyId: Id<"insurance">, policyNum: string) => {
        if (!confirm(`Are you sure you want to remove policy ${policyNum}?`)) return
        try {
            await deleteInsurance({ id: policyId })
            toast.success("Insurance policy deleted")
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete policy")
        }
    }

    const handleInquiryStatusChange = async (
        inquiryId: Id<"inquiries">,
        status: "pending" | "accepted" | "declined" | "countered" | "closed",
        counterPrice?: number
    ) => {
        try {
            await updateInquiryStatus({
                id: inquiryId,
                status,
                counterOfferPrice: counterPrice,
            })
            toast.success(`Inquiry marked as ${status}`)
            if (selectedInquiry?._id === inquiryId) {
                setSelectedInquiry(null)
                setIsCountering(false)
            }
        } catch (error: any) {
            toast.error(error?.message || "Failed to update inquiry status")
        }
    }

    return (
        <div className="min-h-screen bg-muted/20 pb-16">
            {/* Top Sub-Header / Breadcrumb */}
            <div className="border-b bg-card">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground text-sm truncate max-w-[200px] sm:max-w-none">
                                {userName}
                            </span>
                            <Badge
                                variant={
                                    userRole === "admin"
                                        ? "destructive"
                                        : isDealer
                                        ? "default"
                                        : "secondary"
                                }
                                className="text-[11px] capitalize font-medium"
                            >
                                {userRole}
                            </Badge>
                            {user?.verified && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                    <ShieldCheckIcon className="size-3 text-emerald-600" />
                                    Verified
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserFormSheetOpen(true)}
                            className="gap-1.5 text-xs font-semibold h-9"
                        >
                            <PencilIcon className="size-3.5" />
                            Edit Profile
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setEditingVehicle(undefined)
                                setCarFormSheetOpen(true)
                            }}
                            className="gap-1.5 text-xs font-semibold h-9"
                        >
                            <CarIcon className="size-3.5" />
                            Add Car
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => setInsuranceSheetOpen(true)}
                            className="gap-1.5 text-xs font-semibold h-9 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            <ShieldIcon className="size-3.5" />
                            New Insurance
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Container */}
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">

                    {/* ========================================================= */}
                    {/* LEFT COLUMN: USER PROFILE SIDEBAR                         */}
                    {/* ========================================================= */}
                    <div className="space-y-6">
                        <Card className="overflow-hidden border-border/70 shadow-sm sticky top-6">
                            {/* Card Decorative Banner */}
                            <div className="h-24 bg-gradient-to-r from-primary/80 via-primary to-primary/90 relative">
                                <div className="absolute right-3 top-3">
                                    <span
                                        className={`inline-block size-3 rounded-full border-2 border-white ${
                                            user?.status === "Active" || !user?.status
                                                ? "bg-emerald-500"
                                                : "bg-amber-500"
                                        }`}
                                        title={`Status: ${user?.status || "Active"}`}
                                    />
                                </div>
                            </div>

                            <CardContent className="pt-0 px-6 pb-6">
                                {/* Avatar */}
                                <div className="-mt-12 mb-4 flex justify-between items-end">
                                    <Avatar className="size-24 rounded-2xl border-4 border-card shadow-lg bg-card">
                                        <AvatarImage src={user?.imageUrl || user?.image} alt={userName} />
                                        <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Badge
                                        variant="outline"
                                        className="font-mono text-[11px] bg-muted/40 uppercase"
                                    >
                                        {user?.status || "Active"}
                                    </Badge>
                                </div>

                                {/* Names & Role */}
                                <div className="space-y-1 mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <h2 className="text-xl font-bold text-foreground tracking-tight leading-tight">
                                            {userName}
                                        </h2>
                                        {user?.verified && (
                                            <ShieldCheckIcon className="size-4 text-emerald-500 shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                                        <span>ID:</span>
                                        <span className="truncate max-w-[200px]">
                                            {user?.clerkId || user?._id || userId}
                                        </span>
                                    </p>
                                </div>

                                {/* Dealership Badge (if dealer) */}
                                {isDealer && (
                                    <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                                        <div className="flex items-center gap-2">
                                            <Building2Icon className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                                            <div className="flex-1 truncate">
                                                <p className="text-xs font-bold text-amber-900 dark:text-amber-300 truncate">
                                                    {user?.dealershipName || "Certified Auto Dealership"}
                                                </p>
                                                <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80">
                                                    Lic: {user?.dealerLicenseNumber || "Licensed Motor Dealer"}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-0.5 text-xs font-black text-amber-600">
                                                <StarIcon className="size-3 fill-amber-500 text-amber-500" />
                                                <span>{user?.dealerRating || 4.9}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* User Key Details */}
                                <div className="space-y-2.5 border-t border-border pt-4 text-xs">
                                    {/* Email */}
                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <div className="flex items-center gap-2 truncate pr-2">
                                            <MailIcon className="size-3.5 shrink-0 text-muted-foreground" />
                                            <span className="truncate text-foreground font-medium">{userEmail}</span>
                                        </div>
                                        {user?.email && (
                                            <button
                                                type="button"
                                                onClick={handleCopyEmail}
                                                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                                title="Copy email"
                                            >
                                                <CopyIcon className="size-3" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <PhoneIcon className="size-3.5 shrink-0 text-muted-foreground" />
                                            <a
                                                href={user?.phone ? `tel:${user.phone}` : "#"}
                                                className="text-foreground font-medium hover:underline"
                                            >
                                                {userPhone}
                                            </a>
                                        </div>
                                        {user?.phone && (
                                            <a
                                                href={`https://wa.me/${user.phone.replace(/\D/g, "")}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-emerald-600 hover:text-emerald-700 p-1"
                                                title="Chat on WhatsApp"
                                            >
                                                <MessageCircleIcon className="size-3" />
                                            </a>
                                        )}
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPinIcon className="size-3.5 shrink-0 text-muted-foreground" />
                                        <span className="text-foreground">
                                            {[user?.city, user?.stateOrCounty, user?.country || "Kenya"]
                                                .filter(Boolean)
                                                .join(", ") || "Nairobi, Kenya"}
                                        </span>
                                    </div>

                                    {/* Join Date */}
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
                                        <span>
                                            Member since{" "}
                                            {user?.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString("en-KE", {
                                                      year: "numeric",
                                                      month: "short",
                                                  })
                                                : "2024"}
                                        </span>
                                    </div>
                                </div>

                                {/* Navigation Sidebar Tabs */}
                                <div className="mt-6 space-y-1 border-t border-border pt-4">
                                    <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                        Manage Account
                                    </p>

                                    {[
                                        {
                                            id: "overview",
                                            label: "Overview & Bio",
                                            icon: UserIcon,
                                            count: null,
                                        },
                                        {
                                            id: "cars",
                                            label: "Vehicles / Cars",
                                            icon: CarIcon,
                                            count: totalCarsCount,
                                        },
                                        {
                                            id: "insurance",
                                            label: "Insurance Policies",
                                            icon: ShieldIcon,
                                            count: insurancePolicies?.length ?? 0,
                                        },
                                        {
                                            id: "inquiries",
                                            label: "Inquiries & Offers",
                                            icon: MessageSquareIcon,
                                            count: totalInquiriesReceived + totalInquiriesSent,
                                        },
                                        {
                                            id: "edit",
                                            label: "Edit Profile Form",
                                            icon: PencilIcon,
                                            count: null,
                                        },
                                    ].map((tab) => {
                                        const IconComp = tab.icon
                                        const isActive = activeTab === tab.id
                                        return (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => handleTabChange(tab.id as any)}
                                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                                                    isActive
                                                        ? "bg-primary text-primary-foreground shadow-sm"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <IconComp className="size-4 shrink-0" />
                                                    <span>{tab.label}</span>
                                                </div>
                                                {tab.count !== null && (
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                            isActive
                                                                ? "bg-primary-foreground/20 text-primary-foreground"
                                                                : "bg-muted text-muted-foreground"
                                                        }`}
                                                    >
                                                        {tab.count}
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ========================================================= */}
                    {/* RIGHT COLUMN: MAIN CONTENT TABS & TABLES                  */}
                    {/* ========================================================= */}
                    <div className="space-y-6">

                        {/* ----------------------------------------------------- */}
                        {/* TAB 1: OVERVIEW & PROFILE METRICS                     */}
                        {/* ----------------------------------------------------- */}
                        {activeTab === "overview" && (
                            <div className="space-y-6">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    <Card className="border-border/60">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-muted-foreground">
                                                    Cars Listed
                                                </span>
                                                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                                                    <CarIcon className="size-4" />
                                                </div>
                                            </div>
                                            <p className="mt-2 text-2xl font-black">{totalCarsCount}</p>
                                            <p className="text-[11px] text-muted-foreground">
                                                {activeCarsCount} active on marketplace
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-border/60">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-muted-foreground">
                                                    Active Insurance
                                                </span>
                                                <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                    <ShieldCheckIcon className="size-4" />
                                                </div>
                                            </div>
                                            <p className="mt-2 text-2xl font-black">{activeInsuranceCount}</p>
                                            <p className="text-[11px] text-muted-foreground">
                                                Policies in good standing
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-border/60">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-muted-foreground">
                                                    Inquiries
                                                </span>
                                                <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                                    <MessageSquareIcon className="size-4" />
                                                </div>
                                            </div>
                                            <p className="mt-2 text-2xl font-black">{totalInquiriesReceived}</p>
                                            <p className="text-[11px] text-muted-foreground">
                                                Received from potential buyers
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-border/60">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-muted-foreground">
                                                    Completed Deals
                                                </span>
                                                <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                                    <TagIcon className="size-4" />
                                                </div>
                                            </div>
                                            <p className="mt-2 text-2xl font-black">{user?.ridesCount ?? 0}</p>
                                            <p className="text-[11px] text-muted-foreground">
                                                Verified transactions
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* User Bio & Notes */}
                                <Card className="border-border/60">
                                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                                        <div>
                                            <CardTitle className="text-lg">About & Experience</CardTitle>
                                            <CardDescription>Public biography and dealership introduction</CardDescription>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleTabChange("edit")}
                                            className="text-xs gap-1"
                                        >
                                            <PencilIcon className="size-3" />
                                            Edit
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-foreground/80 leading-relaxed">
                                            {user?.notes ||
                                                "No biography added yet. Update profile information to share details about your automobile experience, verified warranties, and inventory specials."}
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground">Preferred Contact</p>
                                                <p className="text-sm font-semibold capitalize mt-0.5">
                                                    {user?.preferredContactMethod || "Direct Phone"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground">Direct Calls</p>
                                                <p className="text-sm font-semibold mt-0.5">
                                                    {user?.allowPhoneCalls !== false ? "Allowed" : "Disabled"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground">WhatsApp Inquiries</p>
                                                <p className="text-sm font-semibold mt-0.5">
                                                    {user?.allowWhatsAppChat !== false ? "Allowed" : "Disabled"}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Preview: Latest Cars */}
                                <Card className="border-border/60">
                                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                                        <div>
                                            <CardTitle className="text-lg">Recent Vehicle Listings</CardTitle>
                                            <CardDescription>Vehicles associated with this user</CardDescription>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleTabChange("cars")}
                                            className="text-xs gap-1 font-semibold"
                                        >
                                            View all {totalCarsCount} →
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        {vehicles && vehicles.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                {vehicles.slice(0, 3).map((car) => (
                                                    <div
                                                        key={car._id}
                                                        className="group rounded-xl border border-border/80 overflow-hidden bg-card hover:shadow-md transition-all"
                                                    >
                                                        <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                                                            {car.thumbnailUrl || car.images?.[0] ? (
                                                                <img
                                                                    src={car.thumbnailUrl || car.images[0]}
                                                                    alt={car.title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                                    <CarIcon className="size-8" />
                                                                </div>
                                                            )}
                                                            <div className="absolute top-2 right-2">
                                                                <Badge
                                                                    variant={car.status === "active" ? "default" : "secondary"}
                                                                    className="text-[10px] capitalize font-semibold shadow-sm"
                                                                >
                                                                    {car.status}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <div className="p-3">
                                                            <p className="font-semibold text-sm truncate">{car.title}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {car.year} • {car.category.toUpperCase()}
                                                            </p>
                                                            <p className="mt-1 font-bold text-sm text-primary">
                                                                {car.currency} {car.price.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center text-muted-foreground text-sm">
                                                <CarIcon className="size-10 mx-auto mb-2 opacity-30" />
                                                <p>No vehicles listed for this user yet.</p>
                                                <Button
                                                    size="sm"
                                                    onClick={() => setCarFormSheetOpen(true)}
                                                    className="mt-3 text-xs"
                                                >
                                                    Add First Vehicle
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* ----------------------------------------------------- */}
                        {/* TAB 2: CARS TABLE                                     */}
                        {/* ----------------------------------------------------- */}
                        {activeTab === "cars" && (
                            <Card className="border-border/60 shadow-sm">
                                <CardHeader className="pb-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                                <CarIcon className="size-5 text-primary" />
                                                Vehicles Inventory ({filteredCars.length})
                                            </CardTitle>
                                            <CardDescription>
                                                Manage, edit, and track cars listed by {userName}
                                            </CardDescription>
                                        </div>

                                        <Button
                                            onClick={() => {
                                                setEditingVehicle(undefined)
                                                setCarFormSheetOpen(true)
                                            }}
                                            className="gap-1.5 text-xs font-semibold h-9 self-start sm:self-auto"
                                        >
                                            <PlusIcon className="size-4" />
                                            Add New Car
                                        </Button>
                                    </div>

                                    {/* Search and Filters */}
                                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                                        <div className="relative w-full sm:w-72">
                                            <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search by make, model, plate..."
                                                value={carSearch}
                                                onChange={(e) => setCarSearch(e.target.value)}
                                                className="pl-9 h-9 text-xs"
                                            />
                                        </div>

                                        <Select value={carStatusFilter} onValueChange={setCarStatusFilter}>
                                            <SelectTrigger className="w-full sm:w-44 h-9 text-xs">
                                                <SelectValue placeholder="All Statuses" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="all">All Statuses</SelectItem>
                                                    <SelectItem value="active">Active (Available)</SelectItem>
                                                    <SelectItem value="draft">Draft</SelectItem>
                                                    <SelectItem value="reserved">Reserved</SelectItem>
                                                    <SelectItem value="sold">Sold</SelectItem>
                                                    <SelectItem value="pending_approval">Pending Approval</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/30">
                                                    <TableHead className="w-[300px]">Vehicle</TableHead>
                                                    <TableHead>Price</TableHead>
                                                    <TableHead>Category</TableHead>
                                                    <TableHead>Condition</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Listed Date</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredCars.length > 0 ? (
                                                    filteredCars.map((car) => {
                                                        const img = car.thumbnailUrl || car.images?.[0] || ""
                                                        return (
                                                            <TableRow key={car._id} className="hover:bg-muted/20">
                                                                <TableCell>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="size-12 rounded-lg bg-muted overflow-hidden shrink-0 border">
                                                                            {img ? (
                                                                                <img
                                                                                    src={img}
                                                                                    alt={car.title}
                                                                                    className="size-full object-cover"
                                                                                />
                                                                            ) : (
                                                                                <div className="size-full flex items-center justify-center text-muted-foreground">
                                                                                    <CarIcon className="size-5" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <Link
                                                                                href={`/vehicles/${car.slug || car._id}`}
                                                                                target="_blank"
                                                                                className="font-semibold text-sm hover:underline text-foreground truncate block max-w-[220px]"
                                                                            >
                                                                                {car.title}
                                                                            </Link>
                                                                            <p className="text-xs text-muted-foreground truncate">
                                                                                {car.year} {car.make} {car.model}
                                                                                {car.registrationNumber ? ` • ${car.registrationNumber}` : ""}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="text-sm font-bold text-foreground">
                                                                        {car.currency} {car.price.toLocaleString()}
                                                                    </div>
                                                                    {car.negotiable && (
                                                                        <span className="text-[10px] text-muted-foreground">
                                                                            Negotiable
                                                                        </span>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant="outline" className="text-xs uppercase font-medium">
                                                                        {car.category}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span className="text-xs text-muted-foreground capitalize">
                                                                        {car.condition.replace(/_/g, " ")}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant={
                                                                            car.status === "active"
                                                                                ? "default"
                                                                                : car.status === "sold"
                                                                                ? "destructive"
                                                                                : "secondary"
                                                                        }
                                                                        className="text-xs capitalize font-medium"
                                                                    >
                                                                        {car.status}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-xs text-muted-foreground">
                                                                    {new Date(car.createdAt).toLocaleDateString()}
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger
                                                                            render={
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="size-8"
                                                                                />
                                                                            }
                                                                        >
                                                                            <EllipsisVerticalIcon className="size-4" />
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end" className="w-44">
                                                                            <DropdownMenuItem
                                                                                onClick={() => {
                                                                                    window.open(`/vehicles/${car.slug || car._id}`, "_blank")
                                                                                }}
                                                                            >
                                                                                <ExternalLinkIcon className="mr-2 size-4 text-blue-500" />
                                                                                View Listing
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                onClick={() => {
                                                                                    setEditingVehicle(car)
                                                                                    setCarFormSheetOpen(true)
                                                                                }}
                                                                            >
                                                                                <PencilIcon className="mr-2 size-4 text-amber-500" />
                                                                                Edit Vehicle
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuSeparator />
                                                                            {car.status !== "active" && (
                                                                                <DropdownMenuItem
                                                                                    onClick={() => handleCarStatusChange(car._id, "active")}
                                                                                >
                                                                                    <CheckCircle2Icon className="mr-2 size-4 text-emerald-500" />
                                                                                    Mark Available
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                            {car.status !== "sold" && (
                                                                                <DropdownMenuItem
                                                                                    onClick={() => handleCarStatusChange(car._id, "sold")}
                                                                                >
                                                                                    <TagIcon className="mr-2 size-4 text-purple-500" />
                                                                                    Mark as Sold
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem
                                                                                variant="destructive"
                                                                                onClick={() => handleDeleteCar(car._id, car.title)}
                                                                            >
                                                                                <Trash2Icon className="mr-2 size-4" />
                                                                                Delete Vehicle
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-sm">
                                                            No cars match your search or filters.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* ----------------------------------------------------- */}
                        {/* TAB 3: INSURANCE TABLE                                */}
                        {/* ----------------------------------------------------- */}
                        {activeTab === "insurance" && (
                            <Card className="border-border/60 shadow-sm">
                                <CardHeader className="pb-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                                <ShieldCheckIcon className="size-5 text-emerald-600" />
                                                Vehicle Insurance Policies ({filteredInsurance.length})
                                            </CardTitle>
                                            <CardDescription>
                                                Active coverages, underwriters, and policy renewal dates
                                            </CardDescription>
                                        </div>

                                        <Button
                                            onClick={() => setInsuranceSheetOpen(true)}
                                            className="gap-1.5 text-xs font-semibold h-9 bg-emerald-600 hover:bg-emerald-700 text-white self-start sm:self-auto"
                                        >
                                            <PlusIcon className="size-4" />
                                            Add Insurance Policy
                                        </Button>
                                    </div>

                                    {/* Search and Filters */}
                                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                                        <div className="relative w-full sm:w-72">
                                            <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search policy #, underwriter, car..."
                                                value={insuranceSearch}
                                                onChange={(e) => setInsuranceSearch(e.target.value)}
                                                className="pl-9 h-9 text-xs"
                                            />
                                        </div>

                                        <Select value={insuranceStatusFilter} onValueChange={setInsuranceStatusFilter}>
                                            <SelectTrigger className="w-full sm:w-44 h-9 text-xs">
                                                <SelectValue placeholder="All Statuses" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="all">All Statuses</SelectItem>
                                                    <SelectItem value="active">Active (Covered)</SelectItem>
                                                    <SelectItem value="pending">Pending Underwriting</SelectItem>
                                                    <SelectItem value="expired">Expired</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/30">
                                                    <TableHead className="w-[200px]">Policy #</TableHead>
                                                    <TableHead>Covered Vehicle</TableHead>
                                                    <TableHead>Underwriter</TableHead>
                                                    <TableHead>Coverage</TableHead>
                                                    <TableHead>Premium</TableHead>
                                                    <TableHead>Validity Period</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredInsurance.length > 0 ? (
                                                    filteredInsurance.map((policy) => {
                                                        const isExpired = Date.now() > policy.endDate
                                                        const daysRemaining = Math.max(
                                                            0,
                                                            Math.ceil((policy.endDate - Date.now()) / (1000 * 60 * 60 * 24))
                                                        )

                                                        return (
                                                            <TableRow key={policy._id} className="hover:bg-muted/20">
                                                                <TableCell className="font-mono font-semibold text-xs text-foreground">
                                                                    {policy.policyNumber}
                                                                </TableCell>
                                                                <TableCell className="text-xs font-medium text-foreground">
                                                                    {policy.vehicleDetails}
                                                                </TableCell>
                                                                <TableCell className="text-xs font-semibold text-foreground">
                                                                    {policy.provider}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-[11px] capitalize bg-muted/40 font-medium"
                                                                    >
                                                                        {policy.coverageType.replace(/_/g, " ")}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-xs font-bold text-foreground">
                                                                    {policy.currency} {policy.premiumAmount?.toLocaleString()}
                                                                </TableCell>
                                                                <TableCell className="text-xs">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-muted-foreground">
                                                                            {new Date(policy.startDate).toLocaleDateString()} -{" "}
                                                                            {new Date(policy.endDate).toLocaleDateString()}
                                                                        </span>
                                                                        <span
                                                                            className={`text-[10px] font-semibold ${
                                                                                isExpired
                                                                                    ? "text-red-500"
                                                                                    : daysRemaining < 30
                                                                                    ? "text-amber-500"
                                                                                    : "text-emerald-600"
                                                                            }`}
                                                                        >
                                                                            {isExpired
                                                                                ? "Expired"
                                                                                : `${daysRemaining} days remaining`}
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant={
                                                                            policy.status === "active" && !isExpired
                                                                                ? "default"
                                                                                : "destructive"
                                                                        }
                                                                        className="text-[11px] capitalize font-medium"
                                                                    >
                                                                        {isExpired ? "Expired" : policy.status}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger
                                                                            render={
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="size-8"
                                                                                />
                                                                            }
                                                                        >
                                                                            <EllipsisVerticalIcon className="size-4" />
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end" className="w-44">
                                                                            <DropdownMenuItem
                                                                                onClick={() => {
                                                                                    toast.info(`Policy: ${policy.policyNumber} with ${policy.provider}`)
                                                                                }}
                                                                            >
                                                                                <ShieldCheckIcon className="mr-2 size-4 text-emerald-500" />
                                                                                View Details
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem
                                                                                variant="destructive"
                                                                                onClick={() => handleDeletePolicy(policy._id, policy.policyNumber)}
                                                                            >
                                                                                <Trash2Icon className="mr-2 size-4" />
                                                                                Delete Policy
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={8} className="h-32 text-center text-muted-foreground text-sm">
                                                            No insurance policies found. Click "Add Insurance Policy" to register coverage.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* ----------------------------------------------------- */}
                        {/* TAB 4: INQUIRIES & OFFERS TABLE                        */}
                        {/* ----------------------------------------------------- */}
                        {activeTab === "inquiries" && (
                            <Card className="border-border/60 shadow-sm">
                                <CardHeader className="pb-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                                <MessageSquareIcon className="size-5 text-blue-600" />
                                                Inquiries & Offers ({filteredInquiries.length})
                                            </CardTitle>
                                            <CardDescription>
                                                Prospective buyers asking about cars or offers sent on the marketplace
                                            </CardDescription>
                                        </div>

                                        {/* Received vs Sent Toggle */}
                                        <div className="flex rounded-lg border bg-muted/40 p-1 self-start sm:self-auto">
                                            <button
                                                type="button"
                                                onClick={() => setInquirySubTab("received")}
                                                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                                                    inquirySubTab === "received"
                                                        ? "bg-card text-foreground shadow-sm"
                                                        : "text-muted-foreground hover:text-foreground"
                                                }`}
                                            >
                                                Received ({inquiriesData?.received?.length || 0})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setInquirySubTab("sent")}
                                                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                                                    inquirySubTab === "sent"
                                                        ? "bg-card text-foreground shadow-sm"
                                                        : "text-muted-foreground hover:text-foreground"
                                                }`}
                                            >
                                                Sent ({inquiriesData?.sent?.length || 0})
                                            </button>
                                        </div>
                                    </div>

                                    {/* Search and Filters */}
                                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                                        <div className="relative w-full sm:w-72">
                                            <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search message, buyer, car..."
                                                value={inquirySearch}
                                                onChange={(e) => setInquirySearch(e.target.value)}
                                                className="pl-9 h-9 text-xs"
                                            />
                                        </div>

                                        <Select value={inquiryStatusFilter} onValueChange={setInquiryStatusFilter}>
                                            <SelectTrigger className="w-full sm:w-44 h-9 text-xs">
                                                <SelectValue placeholder="All Statuses" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="all">All Statuses</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="accepted">Accepted</SelectItem>
                                                    <SelectItem value="countered">Countered</SelectItem>
                                                    <SelectItem value="declined">Declined</SelectItem>
                                                    <SelectItem value="closed">Closed</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/30">
                                                    <TableHead className="w-[220px]">Vehicle</TableHead>
                                                    <TableHead>{inquirySubTab === "received" ? "Buyer / Contact" : "Seller"}</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Offer Amount</TableHead>
                                                    <TableHead className="w-[240px]">Message</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredInquiries.length > 0 ? (
                                                    filteredInquiries.map((inq) => {
                                                        const otherPerson = inquirySubTab === "received" ? inq.buyer : inq.seller

                                                        return (
                                                            <TableRow key={inq._id} className="hover:bg-muted/20">
                                                                <TableCell>
                                                                    <div className="flex items-center gap-2">
                                                                        {inq.vehicle?.image && (
                                                                            <img
                                                                                src={inq.vehicle.image}
                                                                                alt={inq.vehicle.title}
                                                                                className="size-9 rounded-md object-cover border shrink-0"
                                                                            />
                                                                        )}
                                                                        <div className="min-w-0">
                                                                            <span className="font-semibold text-xs block truncate max-w-[150px]">
                                                                                {inq.vehicle?.title || "Car Listing"}
                                                                            </span>
                                                                            {inq.vehicle?.price && (
                                                                                <span className="text-[11px] text-muted-foreground font-mono">
                                                                                    {inq.vehicle.currency} {inq.vehicle.price.toLocaleString()}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="text-xs">
                                                                        <p className="font-medium text-foreground">
                                                                            {otherPerson?.name || "Anonymous User"}
                                                                        </p>
                                                                        <p className="text-[11px] text-muted-foreground truncate">
                                                                            {otherPerson?.phone || inq.buyerContactPhone || otherPerson?.email || "No phone"}
                                                                        </p>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-[11px] capitalize bg-muted/30 font-medium"
                                                                    >
                                                                        {inq.type.replace(/_/g, " ")}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {inq.offeredPrice ? (
                                                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                                            KES {inq.offeredPrice.toLocaleString()}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-xs text-muted-foreground">-</span>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <p
                                                                        className="text-xs text-muted-foreground truncate max-w-[220px] cursor-pointer hover:text-foreground"
                                                                        onClick={() => setSelectedInquiry(inq)}
                                                                        title={inq.message}
                                                                    >
                                                                        {inq.message}
                                                                    </p>
                                                                </TableCell>
                                                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                                                    {new Date(inq.createdAt).toLocaleDateString()}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant={
                                                                            inq.status === "accepted"
                                                                                ? "default"
                                                                                : inq.status === "declined"
                                                                                ? "destructive"
                                                                                : "secondary"
                                                                        }
                                                                        className="text-[11px] capitalize font-medium"
                                                                    >
                                                                        {inq.status}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <div className="flex items-center justify-end gap-1">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-8 text-xs font-semibold px-2"
                                                                            onClick={() => setSelectedInquiry(inq)}
                                                                        >
                                                                            View
                                                                        </Button>

                                                                        {inquirySubTab === "received" && inq.status === "pending" && (
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="h-8 text-xs font-semibold px-2 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                                                                                onClick={() => handleInquiryStatusChange(inq._id, "accepted")}
                                                                            >
                                                                                Accept
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={8} className="h-32 text-center text-muted-foreground text-sm">
                                                            No {inquirySubTab} inquiries recorded yet.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* ----------------------------------------------------- */}
                        {/* TAB 5: EDIT PROFILE (USERCARD FORM EMBEDDED)          */}
                        {/* ----------------------------------------------------- */}
                        {activeTab === "edit" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight">Edit Profile</h3>
                                        <p className="text-xs text-muted-foreground">
                                            Update user credentials, contacts, dealership information, and visual avatar
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleTabChange("overview")}
                                        className="text-xs gap-1"
                                    >
                                        <ArrowLeftIcon className="size-3.5" />
                                        Back to Overview
                                    </Button>
                                </div>

                                <UserCardForm
                                    user={user}
                                    onSuccess={() => {
                                        toast.success("Profile saved successfully!")
                                        handleTabChange("overview")
                                    }}
                                    onCancel={() => handleTabChange("overview")}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ============================================================= */}
            {/* MODALS & SHEETS                                               */}
            {/* ============================================================= */}

            {/* 1. UserCardFormSheet */}
            <UserCardFormSheet
                open={userFormSheetOpen}
                onOpenChange={setUserFormSheetOpen}
                user={user}
                onSuccess={() => {
                    toast.success("User updated successfully!")
                }}
            />

            {/* 2. CarFormSheet */}
            <CarFormSheet
                open={carFormSheetOpen}
                onOpenChange={setCarFormSheetOpen}
                vehicle={editingVehicle}
                onSuccess={() => {
                    setEditingVehicle(undefined)
                    toast.success("Car updated successfully!")
                }}
            />

            {/* 3. InsuranceFormSheet */}
            {user && (
                <InsuranceFormSheet
                    open={insuranceSheetOpen}
                    onOpenChange={setInsuranceSheetOpen}
                    userId={user._id as Id<"users">}
                    userClerkId={user.clerkId || user.externalId}
                    vehicles={vehicles || []}
                    onSuccess={() => {
                        toast.success("Insurance policy registered!")
                    }}
                />
            )}

            {/* 4. Inquiry Details Dialog */}
            {selectedInquiry && (
                <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold flex items-center gap-2">
                                <MessageSquareIcon className="size-5 text-primary" />
                                Inquiry Details
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                Submitted on {new Date(selectedInquiry.createdAt).toLocaleString()}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-2 text-sm">
                            {/* Vehicle card */}
                            {selectedInquiry.vehicle && (
                                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                                    {selectedInquiry.vehicle.image && (
                                        <img
                                            src={selectedInquiry.vehicle.image}
                                            alt={selectedInquiry.vehicle.title}
                                            className="size-12 rounded object-cover border shrink-0"
                                        />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-xs truncate">
                                            {selectedInquiry.vehicle.title}
                                        </p>
                                        <p className="text-xs text-primary font-bold">
                                            {selectedInquiry.vehicle.currency} {selectedInquiry.vehicle.price?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Offer comparison */}
                            {selectedInquiry.offeredPrice && (
                                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                                    <p className="text-xs font-semibold">Offered Amount</p>
                                    <p className="text-lg font-black">
                                        KES {selectedInquiry.offeredPrice.toLocaleString()}
                                    </p>
                                </div>
                            )}

                            {/* Message text */}
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground">Message from Inquirer</p>
                                <div className="p-3 rounded-lg border bg-muted/10 text-xs leading-relaxed">
                                    {selectedInquiry.message}
                                </div>
                            </div>

                            {/* Contact info */}
                            <div className="text-xs space-y-1 text-muted-foreground">
                                <p>
                                    <span className="font-semibold text-foreground">Contact Phone: </span>
                                    {selectedInquiry.buyerContactPhone || selectedInquiry.buyer?.phone || "Not specified"}
                                </p>
                                <p>
                                    <span className="font-semibold text-foreground">Status: </span>
                                    <Badge variant="outline" className="capitalize text-[10px]">
                                        {selectedInquiry.status}
                                    </Badge>
                                </p>
                            </div>

                            {/* Counter Offer Input if active */}
                            {isCountering && (
                                <div className="space-y-2 pt-2 border-t">
                                    <p className="text-xs font-semibold">Propose Counter Offer (KES)</p>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            placeholder="e.g. 1950000"
                                            value={counterPriceInput}
                                            onChange={(e) => setCounterPriceInput(e.target.value)}
                                            className="h-9 text-xs"
                                        />
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                const val = Number(counterPriceInput)
                                                if (val > 0) {
                                                    handleInquiryStatusChange(selectedInquiry._id, "countered", val)
                                                }
                                            }}
                                            className="h-9 text-xs font-semibold"
                                        >
                                            Send Counter
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            {inquirySubTab === "received" && selectedInquiry.status === "pending" && !isCountering ? (
                                <div className="flex items-center justify-between w-full gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs text-destructive hover:bg-destructive/10"
                                        onClick={() => handleInquiryStatusChange(selectedInquiry._id, "declined")}
                                    >
                                        Decline
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs"
                                            onClick={() => setIsCountering(true)}
                                        >
                                            Counter Offer
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                            onClick={() => handleInquiryStatusChange(selectedInquiry._id, "accepted")}
                                        >
                                            Accept Offer
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedInquiry(null)
                                        setIsCountering(false)
                                    }}
                                    className="text-xs"
                                >
                                    Close
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
