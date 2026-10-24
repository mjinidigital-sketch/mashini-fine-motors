"use client"

import * as React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { updateUser as updateClerkUserAction } from "@/app/actions/users"

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
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    UserIcon,
    PhoneIcon,
    MapPinIcon,
    BriefcaseIcon,
    ImageIcon,
    CheckCircle2Icon,
    Loader2Icon,
    ShieldCheckIcon,
    Trash2Icon,
} from "lucide-react"

// ============================================================================
// FORM SCHEMA
// ============================================================================
export const userCardFormSchema = z.object({
    // Step 1: Identity & Credentials
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    name: z.string().min(2, "Full name is required"),
    email: z.string().email("Valid email is required"),
    role: z.string().default("user"),
    status: z.string().default("Active"),
    verified: z.boolean().default(false),

    // Step 2: Contact & Communication
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    preferredContactMethod: z.enum(["phone", "whatsapp", "email", "platform"]).default("phone"),
    allowPhoneCalls: z.boolean().default(true),
    allowWhatsAppChat: z.boolean().default(true),

    // Step 3: Location Details
    country: z.string().min(1, "Country is required").default("Kenya"),
    city: z.string().min(1, "City is required"),
    stateOrCounty: z.string().optional(),
    address: z.string().optional(),
    location: z.string().optional(),

    // Step 4: Dealership & Professional Details
    isDealer: z.boolean().default(false),
    dealershipName: z.string().optional(),
    dealerLicenseNumber: z.string().optional(),
    dealerRating: z.number().min(0).max(5).default(4.9),
    ridesCount: z.number().min(0).default(0),
    notes: z.string().optional(),

    // Step 5: Profile Photo & Visuals
    imageUrl: z.string().optional(),
})

export type UserCardFormValues = z.infer<typeof userCardFormSchema>

// ============================================================================
// STEP 1: IDENTITY & ROLE
// ============================================================================
function Step1Identity({ form }: { form: any }) {
    const handleNameSync = () => {
        const first = form.getValues("firstName") || ""
        const last = form.getValues("lastName") || ""
        const combined = `${first} ${last}`.trim()
        if (combined) {
            form.setValue("name", combined)
        }
    }

    return (
        <Card className="border-border/60 shadow-sm">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <UserIcon className="size-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Identity & Role</CardTitle>
                        <CardDescription>Basic account credentials and system authorization</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                            id="firstName"
                            placeholder="e.g. John"
                            {...form.register("firstName", {
                                onChange: handleNameSync,
                            })}
                        />
                        {form.formState.errors.firstName && (
                            <p className="text-xs text-destructive">{form.formState.errors.firstName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                            id="lastName"
                            placeholder="e.g. Doe"
                            {...form.register("lastName", {
                                onChange: handleNameSync,
                            })}
                        />
                        {form.formState.errors.lastName && (
                            <p className="text-xs text-destructive">{form.formState.errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Display / Full Name *</Label>
                        <Input
                            id="name"
                            placeholder="e.g. John Doe"
                            {...form.register("name")}
                        />
                        {form.formState.errors.name && (
                            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            {...form.register("email")}
                        />
                        {form.formState.errors.email && (
                            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor="role">Platform Role *</Label>
                        <Select
                            onValueChange={(val) => form.setValue("role", val)}
                            defaultValue={form.watch("role") || "user"}
                        >
                            <SelectTrigger id="role" className="h-10">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="user">User / Buyer</SelectItem>
                                    <SelectItem value="seller">Private Seller</SelectItem>
                                    <SelectItem value="dealer">Certified Dealer</SelectItem>
                                    <SelectItem value="staff">Staff / Moderator</SelectItem>
                                    <SelectItem value="admin">Administrator</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Account Status</Label>
                        <Select
                            onValueChange={(val) => form.setValue("status", val)}
                            defaultValue={form.watch("status") || "Active"}
                        >
                            <SelectTrigger id="status" className="h-10">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="Active">Active (Normal)</SelectItem>
                                    <SelectItem value="Suspended">Suspended</SelectItem>
                                    <SelectItem value="Inactive">Inactive / Disabled</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="flex items-center space-x-3 rounded-lg border p-4 bg-muted/20">
                        <Checkbox
                            id="verified"
                            checked={form.watch("verified")}
                            onCheckedChange={(checked) => form.setValue("verified", !!checked)}
                        />
                        <div className="space-y-1 leading-none">
                            <Label htmlFor="verified" className="cursor-pointer font-medium flex items-center gap-1.5">
                                <ShieldCheckIcon className="size-4 text-emerald-500" />
                                Verified Profile Badge
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Marks this user with an official verified badge across listings and offers.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// ============================================================================
// STEP 2: CONTACT & PREFERENCES
// ============================================================================
function Step2Contact({ form }: { form: any }) {
    return (
        <Card className="border-border/60 shadow-sm">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <PhoneIcon className="size-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Contact & Communication</CardTitle>
                        <CardDescription>Phone, WhatsApp, and preferred communication channels</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            placeholder="+254 712 345 678"
                            {...form.register("phone")}
                        />
                        <p className="text-xs text-muted-foreground">Used for buyer calls and inquiries.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp Number</Label>
                        <Input
                            id="whatsapp"
                            placeholder="+254 712 345 678"
                            {...form.register("whatsapp")}
                        />
                        <p className="text-xs text-muted-foreground">Direct chat link on vehicle listings.</p>
                    </div>
                </div>

                <div className="space-y-2 pt-2">
                    <Label htmlFor="preferredContactMethod">Preferred Contact Channel</Label>
                    <Select
                        onValueChange={(val) => form.setValue("preferredContactMethod", val)}
                        defaultValue={form.watch("preferredContactMethod") || "phone"}
                    >
                        <SelectTrigger id="preferredContactMethod" className="h-10">
                            <SelectValue placeholder="Select contact preference" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="phone">Direct Phone Call</SelectItem>
                                <SelectItem value="whatsapp">WhatsApp Message</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="platform">In-App Chat / Platform</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center space-x-3 rounded-lg border p-4 bg-muted/20">
                        <Checkbox
                            id="allowPhoneCalls"
                            checked={form.watch("allowPhoneCalls")}
                            onCheckedChange={(checked) => form.setValue("allowPhoneCalls", !!checked)}
                        />
                        <div className="space-y-1 leading-none">
                            <Label htmlFor="allowPhoneCalls" className="cursor-pointer font-medium">
                                Allow Phone Calls
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Prospective buyers can call directly.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 rounded-lg border p-4 bg-muted/20">
                        <Checkbox
                            id="allowWhatsAppChat"
                            checked={form.watch("allowWhatsAppChat")}
                            onCheckedChange={(checked) => form.setValue("allowWhatsAppChat", !!checked)}
                        />
                        <div className="space-y-1 leading-none">
                            <Label htmlFor="allowWhatsAppChat" className="cursor-pointer font-medium">
                                Allow WhatsApp Chats
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Quick 1-click WhatsApp button on vehicles.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// ============================================================================
// STEP 3: LOCATION DETAILS
// ============================================================================
function Step3Location({ form }: { form: any }) {
    return (
        <Card className="border-border/60 shadow-sm">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <MapPinIcon className="size-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Location & Address</CardTitle>
                        <CardDescription>Geographic location shown to buyers and on listings</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Input
                            id="country"
                            placeholder="e.g. Kenya"
                            {...form.register("country")}
                        />
                        {form.formState.errors.country && (
                            <p className="text-xs text-destructive">{form.formState.errors.country.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                            id="city"
                            placeholder="e.g. Nairobi"
                            {...form.register("city")}
                        />
                        {form.formState.errors.city && (
                            <p className="text-xs text-destructive">{form.formState.errors.city.message}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="stateOrCounty">State or County</Label>
                        <Input
                            id="stateOrCounty"
                            placeholder="e.g. Nairobi County"
                            {...form.register("stateOrCounty")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">General Location / Neighborhood</Label>
                        <Input
                            id="location"
                            placeholder="e.g. Westlands, Nairobi"
                            {...form.register("location")}
                        />
                    </div>
                </div>

                <div className="space-y-2 pt-1">
                    <Label htmlFor="address">Physical Address / Dealership Showroom</Label>
                    <Input
                        id="address"
                        placeholder="e.g. Plot 42, Waiyaki Way, Westlands"
                        {...form.register("address")}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

// ============================================================================
// STEP 4: DEALERSHIP & PROFESSIONAL DETAILS
// ============================================================================
function Step4Dealership({ form }: { form: any }) {
    const isDealer = form.watch("isDealer")

    return (
        <Card className="border-border/60 shadow-sm">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <BriefcaseIcon className="size-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Dealership & Professional</CardTitle>
                        <CardDescription>Dealership credentials, business license, and internal notes</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="flex items-center space-x-3 rounded-lg border p-4 bg-muted/20">
                    <Checkbox
                        id="isDealer"
                        checked={isDealer}
                        onCheckedChange={(checked) => form.setValue("isDealer", !!checked)}
                    />
                    <div className="space-y-1 leading-none">
                        <Label htmlFor="isDealer" className="cursor-pointer font-medium">
                            Registered Auto Dealer / Showroom
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Enables dealership branding, verified badge, and dealer inventory filters.
                        </p>
                    </div>
                </div>

                {isDealer && (
                    <div className="space-y-4 pt-2 border-l-2 border-primary/40 pl-4 transition-all">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dealershipName">Dealership / Company Name</Label>
                                <Input
                                    id="dealershipName"
                                    placeholder="e.g. Mashini Elite Motors Ltd"
                                    {...form.register("dealershipName")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dealerLicenseNumber">Dealer License / Registration #</Label>
                                <Input
                                    id="dealerLicenseNumber"
                                    placeholder="e.g. KRA-DL-893021"
                                    {...form.register("dealerLicenseNumber")}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dealerRating">Dealer Rating (1 - 5)</Label>
                                <Input
                                    id="dealerRating"
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    max="5"
                                    placeholder="4.9"
                                    {...form.register("dealerRating", { valueAsNumber: true })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ridesCount">Completed Sales / Transactions Count</Label>
                                <Input
                                    id="ridesCount"
                                    type="number"
                                    min="0"
                                    placeholder="15"
                                    {...form.register("ridesCount", { valueAsNumber: true })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-2 pt-2">
                    <Label htmlFor="notes">About / Bio & Administrative Notes</Label>
                    <Textarea
                        id="notes"
                        rows={4}
                        placeholder="Add information about the user or dealership experience, specializations, warranty guarantees, or admin moderation notes..."
                        {...form.register("notes")}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

// ============================================================================
// STEP 5: AVATAR & PHOTO
// ============================================================================
function Step5Avatar({ form }: { form: any }) {
    const imageUrl = form.watch("imageUrl")
    const name = form.watch("name") || "User"
    const initials = name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"

    return (
        <Card className="border-border/60 shadow-sm">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
                        <ImageIcon className="size-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Profile Photo</CardTitle>
                        <CardDescription>Visual avatar displayed on profile cards and listing inquiries</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border rounded-xl bg-muted/15">
                    <Avatar className="size-24 border-2 border-primary/20 shadow-md">
                        <AvatarImage src={imageUrl} alt={name} />
                        <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="space-y-2 text-center sm:text-left flex-1">
                        <h4 className="font-semibold text-lg">{name || "Unnamed User"}</h4>
                        <p className="text-xs text-muted-foreground">
                            {form.watch("email") || "No email specified"} • {form.watch("role") || "user"}
                        </p>
                        {imageUrl && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => form.setValue("imageUrl", "")}
                                className="text-destructive hover:bg-destructive/10 text-xs gap-1.5 h-8 mt-1"
                            >
                                <Trash2Icon className="size-3.5" />
                                Remove Avatar
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="imageUrl">Avatar Image URL</Label>
                    <Input
                        id="imageUrl"
                        placeholder="https://images.unsplash.com/... or uploaded photo link"
                        {...form.register("imageUrl")}
                    />
                    <p className="text-xs text-muted-foreground">
                        Paste a direct URL to a profile image (PNG, JPG, WebP) or Clerk avatar link.
                    </p>
                </div>

                {/* Quick avatar selection presets */}
                <div className="space-y-2 pt-2">
                    <Label className="text-xs text-muted-foreground">Sample Avatars (Click to apply)</Label>
                    <div className="flex flex-wrap gap-2">
                        {[
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                        ].map((url, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => form.setValue("imageUrl", url)}
                                className="size-11 rounded-full overflow-hidden border-2 hover:border-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// ============================================================================
// MAIN USER CARD FORM COMPONENT
// ============================================================================
export interface UserCardFormProps {
    user?: any
    onSuccess?: () => void
    onCancel?: () => void
}

export function UserCardForm({ user, onSuccess, onCancel }: UserCardFormProps) {
    const [currentStep, setCurrentStep] = React.useState(1)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const updateUserProfile = useMutation(api.users.updateUserProfile)

    // Derive defaults from given user object (Convex doc or Clerk record)
    const defaultFirst = user?.firstName || (user?.name ? user.name.split(" ")[0] : "")
    const defaultLast = user?.lastName || (user?.name ? user.name.split(" ").slice(1).join(" ") : "")
    const defaultEmail = user?.email || ""

    const form = useForm<UserCardFormValues>({
        resolver: zodResolver(userCardFormSchema) as any,
        defaultValues: {
            firstName: defaultFirst,
            lastName: defaultLast,
            name: user?.name || `${defaultFirst} ${defaultLast}`.trim() || "User",
            email: defaultEmail,
            role: user?.role || "user",
            status: user?.status || "Active",
            verified: user?.verified || false,
            phone: user?.phone || "",
            whatsapp: user?.sellerContactWhatsApp || user?.whatsapp || user?.phone || "",
            preferredContactMethod: user?.preferredContactMethod || "phone",
            allowPhoneCalls: user?.allowPhoneCalls ?? true,
            allowWhatsAppChat: user?.allowWhatsAppChat ?? true,
            country: user?.country || "Kenya",
            city: user?.city || user?.location || "Nairobi",
            stateOrCounty: user?.stateOrCounty || "",
            address: user?.address || "",
            location: user?.location || "Nairobi",
            isDealer: user?.isDealer ?? (user?.role === "dealer"),
            dealershipName: user?.dealershipName || "",
            dealerLicenseNumber: user?.dealerLicenseNumber || "",
            dealerRating: user?.dealerRating ?? 4.9,
            ridesCount: user?.ridesCount ?? 0,
            notes: user?.notes || "",
            imageUrl: user?.imageUrl || user?.image || "",
        },
    })

    const steps = [
        { title: "Identity", icon: UserIcon, component: Step1Identity },
        { title: "Contact", icon: PhoneIcon, component: Step2Contact },
        { title: "Location", icon: MapPinIcon, component: Step3Location },
        { title: "Dealership", icon: BriefcaseIcon, component: Step4Dealership },
        { title: "Avatar", icon: ImageIcon, component: Step5Avatar },
    ]

    const getStepFields = (step: number): (keyof UserCardFormValues)[] => {
        switch (step) {
            case 1:
                return ["firstName", "lastName", "name", "email", "role"]
            case 2:
                return ["phone"]
            case 3:
                return ["country", "city"]
            case 4:
                return ["dealershipName"]
            case 5:
                return ["imageUrl"]
            default:
                return []
        }
    }

    const handleNext = async () => {
        const fields = getStepFields(currentStep)
        const isValid = await form.trigger(fields as any)

        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length))
        } else {
            toast.error("Please fill in the required fields")
        }
    }

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    const onSubmit: SubmitHandler<UserCardFormValues> = async (data) => {
        try {
            setIsSubmitting(true)

            // 1. Update in Convex if user._id is present
            if (user?._id) {
                await updateUserProfile({
                    id: user._id as Id<"users">,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    role: data.role,
                    status: data.status,
                    imageUrl: data.imageUrl,
                    location: data.location || data.city,
                    dealershipName: data.dealershipName,
                    dealerLicenseNumber: data.dealerLicenseNumber,
                    isDealer: data.isDealer,
                    verified: data.verified,
                    notes: data.notes,
                })
            }

            // 2. Also sync to Clerk if clerkId is available
            const targetClerkId = user?.clerkId || user?.externalId || (user?._id?.startsWith("user_") ? user._id : undefined)
            if (targetClerkId) {
                try {
                    await updateClerkUserAction(targetClerkId, {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                        role: data.role,
                    })
                } catch (clerkErr: any) {
                    console.warn("Clerk sync notice:", clerkErr?.message)
                }
            }

            toast.success("User profile updated successfully!")
            onSuccess?.()
        } catch (error: any) {
            console.error("Failed to update user:", error)
            toast.error(error?.message || "Failed to save user profile")
        } finally {
            setIsSubmitting(false)
        }
    }

    const CurrentStepComponent = steps[currentStep - 1].component
    const progressPercent = (currentStep / steps.length) * 100

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Header / Stepper Progress Indicator */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-foreground">
                        Step {currentStep} of {steps.length}:{" "}
                        <span className="text-primary">{steps[currentStep - 1].title}</span>
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                        {Math.round(progressPercent)}% completed
                    </span>
                </div>
                <Progress value={progressPercent} className="h-2" />

                {/* Step tabs */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                    {steps.map((s, idx) => {
                        const stepNum = idx + 1
                        const isCompleted = stepNum < currentStep
                        const isCurrent = stepNum === currentStep
                        const IconComponent = s.icon

                        return (
                            <button
                                key={s.title}
                                type="button"
                                onClick={async () => {
                                    if (stepNum < currentStep) {
                                        setCurrentStep(stepNum)
                                    } else if (stepNum === currentStep + 1) {
                                        handleNext()
                                    }
                                }}
                                className={`flex items-center justify-center gap-1.5 py-2 px-1 text-xs rounded-lg transition-all ${
                                    isCurrent
                                        ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                                        : isCompleted
                                        ? "bg-muted text-foreground hover:bg-muted/80 cursor-pointer"
                                        : "bg-muted/30 text-muted-foreground cursor-not-allowed"
                                }`}
                            >
                                {isCompleted ? (
                                    <CheckCircle2Icon className="size-3.5 text-emerald-500 shrink-0" />
                                ) : (
                                    <IconComponent className="size-3.5 shrink-0" />
                                )}
                                <span className="hidden sm:inline truncate">{s.title}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Step Body */}
            <div>
                <CurrentStepComponent form={form} />
            </div>

            {/* Navigation & Submit Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                    {currentStep > 1 ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={isSubmitting}
                            className="gap-2"
                        >
                            <ChevronLeftIcon className="size-4" />
                            Previous
                        </Button>
                    ) : onCancel ? (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    ) : (
                        <div />
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {currentStep < steps.length ? (
                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className="gap-2"
                        >
                            Next
                            <ChevronRightIcon className="size-4" />
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2Icon className="size-4 animate-spin" />
                                    Saving User...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2Icon className="size-4" />
                                    Save Profile
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </form>
    )
}
