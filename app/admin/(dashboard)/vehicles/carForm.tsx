"use client"

import * as React from "react"
import { useForm, useFieldArray, FormProvider, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useMutation, useConvex } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import {
    CategoryEnum,
    VehicleStatusEnum,
    ConditionEnum,
    MileageUnitEnum,
    FuelTypeEnum,
    TransmissionEnum,
    DrivetrainEnum,
    InteriorMaterialEnum,
} from "@/app/schemas/vehicle"
import {
    uploadImages,
    uploadImageWithThumbnail,
    validateImageFile,
    getPreviewUrl,
    revokePreviewUrl,
} from "@/lib/storage-helpers"

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
import { ChevronLeftIcon, ChevronRightIcon, UploadIcon, XIcon, ImageIcon } from "lucide-react"

// ============================================================================
// FORM SCHEMA
// ============================================================================
const vehicleFormSchema = z.object({
    // Step 1: Basic Information
    title: z.string().min(3, "Title must be at least 3 characters"),
    category: CategoryEnum,
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
    price: z.number().min(0),
    currency: z.string().default("KES"),
    negotiable: z.boolean().default(false),
    featured: z.boolean().default(false),

    // Step 2: Vehicle Details
    condition: ConditionEnum,
    mileage: z.number().min(0),
    mileageUnit: MileageUnitEnum,
    fuelType: FuelTypeEnum,
    transmission: TransmissionEnum,
    drivetrain: DrivetrainEnum.optional(),
    exteriorColor: z.string().min(1, "Exterior color is required"),
    interiorColor: z.string().optional(),
    interiorMaterial: InteriorMaterialEnum.optional(),
    doorsCount: z.number().min(2).max(8).optional(),
    femaleOwned: z.boolean().default(false),
    accidentFree: z.boolean().default(false),
    repainted: z.boolean().default(false),

    // Step 3: Features
    features: z.array(z.string()).default([]),
    safetyFeatures: z.array(z.string()).default([]),
    comfortFeatures: z.array(z.string()).default([]),
    technologyFeatures: z.array(z.string()).default([]),

    // Step 4: Location & Contact
    city: z.string().min(1, "City is required"),
    stateOrCounty: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    address: z.string().optional(),
    sellerContactName: z.string().optional(),
    sellerContactPhone: z.string().optional(),
    sellerContactWhatsApp: z.string().optional(),
    sellerContactEmail: z.string().email().optional().or(z.literal("")),

    // Step 5: Images
    images: z.array(z.string()).default([]),
    thumbnailUrl: z.string().optional(),
})

type VehicleFormValues = z.infer<typeof vehicleFormSchema>

const FEATURE_OPTIONS = [
    "Air Conditioning",
    "Power Steering",
    "Power Windows",
    "Central Locking",
    "Alloy Wheels",
    "Sunroof",
    "Bluetooth",
    "USB Port",
    "Cruise Control",
    "Reverse Camera",
    "Parking Sensors",
    "Keyless Entry",
    "Push Button Start",
    "Leather Seats",
    "Heated Seats",
    "Ventilated Seats",
    "Electric Seats",
    "Navigation System",
    "Apple CarPlay",
    "Android Auto",
    "LED Headlights",
    "Fog Lights",
    "Roof Rails",
    "Spare Tire",
]

const SAFETY_FEATURE_OPTIONS = [
    "Airbags",
    "ABS",
    "Traction Control",
    "Stability Control",
    "Lane Assist",
    "Adaptive Cruise Control",
    "Blind Spot Monitoring",
    "Rear Cross Traffic Alert",
    "Auto Emergency Braking",
    "Child Safety Locks",
]

const COMFORT_FEATURE_OPTIONS = [
    "Climate Control",
    "Dual Zone Climate",
    "Rear AC",
    "Heated Steering Wheel",
    "Memory Seats",
    "Massage Seats",
    "Panoramic Sunroof",
    "Electric Sunroof",
    "Tinted Windows",
    "Premium Audio",
]

const TECHNOLOGY_FEATURE_OPTIONS = [
    "Touchscreen Display",
    "Digital Dashboard",
    "Wireless Charging",
    "WiFi Hotspot",
    "Voice Control",
    "Head-Up Display",
    "360° Camera",
    "Remote Start",
    "Keyless Entry",
    "Smartphone Integration",
]

// ============================================================================
// STEP COMPONENTS
// ============================================================================
interface StepProps {
    form: any
    onNext: () => void
    onPrevious: () => void
    isFirstStep: boolean
    isLastStep: boolean
}

function Step1BasicInfo({ form, onNext, isFirstStep, isLastStep }: StepProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>

                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                placeholder="e.g., 2023 Toyota Camry"
                                {...form.register("title")}
                            />
                            {form.formState.errors.title && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.title.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                onValueChange={(value) => form.setValue("category", value)}
                                defaultValue={form.watch("category")}
                            >
                                <SelectTrigger className="h-11 rounded-md">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {CategoryEnum.options.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat.replace(/_/g, " ").toUpperCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.category && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.category.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="make">Make *</Label>
                            <Input
                                id="make"
                                placeholder="e.g., Toyota"
                                {...form.register("make")}
                            />
                            {form.formState.errors.make && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.make.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="model">Model *</Label>
                            <Input
                                id="model"
                                placeholder="e.g., Camry"
                                {...form.register("model")}
                            />
                            {form.formState.errors.model && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.model.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="year">Year *</Label>
                            <Input
                                id="year"
                                type="number"
                                placeholder="e.g., 2023"
                                {...form.register("year", { valueAsNumber: true })}
                            />
                            {form.formState.errors.year && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.year.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Price *</Label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="e.g., 1500000"
                                {...form.register("price", { valueAsNumber: true })}
                            />
                            {form.formState.errors.price && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.price.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select
                                onValueChange={(value) => form.setValue("currency", value)}
                                defaultValue={form.watch("currency")}
                            >
                                <SelectTrigger className="h-11 rounded-md">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="KES">KES</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                        <SelectItem value="GBP">GBP</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2 pt-6">
                            <Checkbox
                                id="negotiable"
                                checked={form.watch("negotiable")}
                                onCheckedChange={(checked) =>
                                    form.setValue("negotiable", checked as boolean)
                                }
                            />
                            <Label htmlFor="negotiable" className="cursor-pointer">
                                Price is negotiable
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="featured"
                                checked={form.watch("featured")}
                                onCheckedChange={(checked) =>
                                    form.setValue("featured", checked as boolean)
                                }
                            />
                            <Label htmlFor="featured" className="cursor-pointer">
                                Featured vehicle
                            </Label>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function Step2VehicleDetails({ form }: StepProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Vehicle Details</CardTitle>
                    <CardDescription>
                        Condition, mileage, and specifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="condition">Condition *</Label>
                            <Select
                                onValueChange={(value) => form.setValue("condition", value)}
                                defaultValue={form.watch("condition")}
                            >
                                <SelectTrigger className="h-11 rounded-md">
                                    <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {ConditionEnum.options.map((cond) => (
                                            <SelectItem key={cond} value={cond}>
                                                {cond.replace(/_/g, " ").toUpperCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.condition && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.condition.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mileage">Mileage *</Label>
                            <Input
                                id="mileage"
                                type="number"
                                placeholder="e.g., 50000"
                                {...form.register("mileage", { valueAsNumber: true })}
                            />
                            {form.formState.errors.mileage && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.mileage.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mileageUnit">Mileage Unit</Label>
                            <Select
                                onValueChange={(value) => form.setValue("mileageUnit", value)}
                                defaultValue={form.watch("mileageUnit")}
                            >
                                <SelectTrigger className="h-11 rounded-md">
                                    <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {MileageUnitEnum.options.map((unit) => (
                                            <SelectItem key={unit} value={unit}>
                                                {unit.toUpperCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fuelType">Fuel Type *</Label>
                            <Select
                                onValueChange={(value) => form.setValue("fuelType", value)}
                                defaultValue={form.watch("fuelType")}
                            >
                                <SelectTrigger className="h-11 rounded-md">
                                    <SelectValue placeholder="Select fuel type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {FuelTypeEnum.options.map((fuel) => (
                                            <SelectItem key={fuel} value={fuel}>
                                                {fuel.replace(/_/g, " ").toUpperCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.fuelType && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.fuelType.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="transmission">Transmission *</Label>
                            <Select
                                onValueChange={(value) => form.setValue("transmission", value)}
                                defaultValue={form.watch("transmission")}
                            >
                                <SelectTrigger className="h-11 rounded-md">
                                    <SelectValue placeholder="Select transmission" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {TransmissionEnum.options.map((trans) => (
                                            <SelectItem key={trans} value={trans}>
                                                {trans.replace(/_/g, " ").toUpperCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.transmission && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.transmission.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="drivetrain">Drivetrain</Label>
                            <Select
                                onValueChange={(value) => form.setValue("drivetrain", value)}
                                defaultValue={form.watch("drivetrain")}
                            >
                                <SelectTrigger className="h-11 rounded-md">
                                    <SelectValue placeholder="Select drivetrain" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {DrivetrainEnum.options.map((drive) => (
                                            <SelectItem key={drive} value={drive}>
                                                {drive.toUpperCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="exteriorColor">Exterior Color *</Label>
                            <Input
                                id="exteriorColor"
                                placeholder="e.g., White"
                                {...form.register("exteriorColor")}
                            />
                            {form.formState.errors.exteriorColor && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.exteriorColor.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="interiorColor">Interior Color</Label>
                            <Input
                                id="interiorColor"
                                placeholder="e.g., Black"
                                {...form.register("interiorColor")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="interiorMaterial">Interior Material</Label>
                            <Select
                                onValueChange={(value) => form.setValue("interiorMaterial", value)}
                                defaultValue={form.watch("interiorMaterial")}
                            >
                                <SelectTrigger className="h-11 rounded-md">
                                    <SelectValue placeholder="Select material" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {InteriorMaterialEnum.options.map((mat) => (
                                            <SelectItem key={mat} value={mat}>
                                                {mat.replace(/_/g, " ").toUpperCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="doorsCount">Number of Doors</Label>
                            <Input
                                id="doorsCount"
                                type="number"
                                placeholder="e.g., 4"
                                {...form.register("doorsCount", { valueAsNumber: true })}
                            />
                        </div>

                        <div className="flex items-center space-x-2 pt-6">
                            <Checkbox
                                id="femaleOwned"
                                checked={form.watch("femaleOwned")}
                                onCheckedChange={(checked) =>
                                    form.setValue("femaleOwned", checked as boolean)
                                }
                            />
                            <Label htmlFor="femaleOwned" className="cursor-pointer">
                                Female Owned
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="accidentFree"
                                checked={form.watch("accidentFree")}
                                onCheckedChange={(checked) =>
                                    form.setValue("accidentFree", checked as boolean)
                                }
                            />
                            <Label htmlFor="accidentFree" className="cursor-pointer">
                                Accident Free
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="repainted"
                                checked={form.watch("repainted")}
                                onCheckedChange={(checked) =>
                                    form.setValue("repainted", checked as boolean)
                                }
                            />
                            <Label htmlFor="repainted" className="cursor-pointer">
                                Repainted
                            </Label>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function Step3Features({ form }: StepProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Features & Equipment</CardTitle>
                    <CardDescription>
                        Select the features available in this vehicle
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label className="text-base font-semibold mb-3 block">General Features</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {FEATURE_OPTIONS.map((feature) => (
                                <div key={feature} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`feature-${feature}`}
                                        checked={form.watch("features").includes(feature)}
                                        onCheckedChange={(checked) => {
                                            const currentFeatures = form.watch("features")
                                            if (checked) {
                                                form.setValue("features", [...currentFeatures, feature])
                                            } else {
                                                form.setValue(
                                                    "features",
                                                    currentFeatures.filter((f: string) => f !== feature)
                                                )
                                            }
                                        }}
                                    />
                                    <Label
                                        htmlFor={`feature-${feature}`}
                                        className="cursor-pointer text-sm"
                                    >
                                        {feature}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label className="text-base font-semibold mb-3 block">Safety Features</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {SAFETY_FEATURE_OPTIONS.map((feature) => (
                                <div key={feature} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`safety-${feature}`}
                                        checked={form.watch("safetyFeatures").includes(feature)}
                                        onCheckedChange={(checked) => {
                                            const currentFeatures = form.watch("safetyFeatures") || []
                                            if (checked) {
                                                form.setValue("safetyFeatures", [...currentFeatures, feature])
                                            } else {
                                                form.setValue(
                                                    "safetyFeatures",
                                                    currentFeatures.filter((f: string) => f !== feature)
                                                )
                                            }
                                        }}
                                    />
                                    <Label
                                        htmlFor={`safety-${feature}`}
                                        className="cursor-pointer text-sm"
                                    >
                                        {feature}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label className="text-base font-semibold mb-3 block">Comfort Features</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {COMFORT_FEATURE_OPTIONS.map((feature) => (
                                <div key={feature} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`comfort-${feature}`}
                                        checked={form.watch("comfortFeatures").includes(feature)}
                                        onCheckedChange={(checked) => {
                                            const currentFeatures = form.watch("comfortFeatures") || []
                                            if (checked) {
                                                form.setValue("comfortFeatures", [...currentFeatures, feature])
                                            } else {
                                                form.setValue(
                                                    "comfortFeatures",
                                                    currentFeatures.filter((f: string) => f !== feature)
                                                )
                                            }
                                        }}
                                    />
                                    <Label
                                        htmlFor={`comfort-${feature}`}
                                        className="cursor-pointer text-sm"
                                    >
                                        {feature}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label className="text-base font-semibold mb-3 block">Technology Features</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {TECHNOLOGY_FEATURE_OPTIONS.map((feature) => (
                                <div key={feature} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`tech-${feature}`}
                                        checked={form.watch("technologyFeatures").includes(feature)}
                                        onCheckedChange={(checked) => {
                                            const currentFeatures = form.watch("technologyFeatures") || []
                                            if (checked) {
                                                form.setValue("technologyFeatures", [...currentFeatures, feature])
                                            } else {
                                                form.setValue(
                                                    "technologyFeatures",
                                                    currentFeatures.filter((f: string) => f !== feature)
                                                )
                                            }
                                        }}
                                    />
                                    <Label
                                        htmlFor={`tech-${feature}`}
                                        className="cursor-pointer text-sm"
                                    >
                                        {feature}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function Step4LocationContact({ form }: StepProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Location & Contact</CardTitle>
                    <CardDescription>
                        Where is the vehicle located and how can buyers contact you?
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                                id="city"
                                placeholder="e.g., Nairobi"
                                {...form.register("city")}
                            />
                            {form.formState.errors.city && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.city.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stateOrCounty">State/County</Label>
                            <Input
                                id="stateOrCounty"
                                placeholder="e.g., Nairobi County"
                                {...form.register("stateOrCounty")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country">Country *</Label>
                            <Input
                                id="country"
                                placeholder="e.g., Kenya"
                                {...form.register("country")}
                            />
                            {form.formState.errors.country && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.country.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                placeholder="e.g., 123 Main Street"
                                {...form.register("address")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sellerContactName">Contact Name</Label>
                            <Input
                                id="sellerContactName"
                                placeholder="Your name"
                                {...form.register("sellerContactName")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sellerContactPhone">Phone Number</Label>
                            <Input
                                id="sellerContactPhone"
                                placeholder="e.g., +254700000000"
                                {...form.register("sellerContactPhone")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sellerContactWhatsApp">WhatsApp</Label>
                            <Input
                                id="sellerContactWhatsApp"
                                placeholder="e.g., +254700000000"
                                {...form.register("sellerContactWhatsApp")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sellerContactEmail">Email</Label>
                            <Input
                                id="sellerContactEmail"
                                type="email"
                                placeholder="e.g., seller@example.com"
                                {...form.register("sellerContactEmail")}
                            />
                            {form.formState.errors.sellerContactEmail && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.sellerContactEmail.message as string}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function Step5Images({ form }: StepProps) {
    const [previewUrls, setPreviewUrls] = React.useState<string[]>([])
    const [uploading, setUploading] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        try {
            setUploading(true)

            // Validate files
            for (const file of files) {
                validateImageFile(file, 10) // 10MB limit
            }

            // Generate preview URLs
            const newPreviews = files.map((file) => getPreviewUrl(file))
            setPreviewUrls((prev) => [...prev, ...newPreviews])

            // Note: Actual upload will happen on form submit
            // Store files in form state for later upload
            const currentImages = form.watch("images") || []
            form.setValue("images", [...currentImages, ...files.map((f) => f.name)])

            toast.success(`${files.length} image(s) selected`)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to select images")
        } finally {
            setUploading(false)
        }
    }

    const removeImage = (index: number) => {
        setPreviewUrls((prev) => {
            const newPreviews = [...prev]
            revokePreviewUrl(newPreviews[index])
            newPreviews.splice(index, 1)
            return newPreviews
        })

        const currentImages = form.watch("images") || []
        form.setValue(
            "images",
            currentImages.filter((_: string, i: number) => i !== index)
        )
    }

    React.useEffect(() => {
        // Cleanup preview URLs on unmount
        return () => {
            previewUrls.forEach(revokePreviewUrl)
        }
    }, [previewUrls])

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Vehicle Images</CardTitle>
                    <CardDescription>
                        Upload high-quality images of the vehicle. First image will be used as thumbnail.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            multiple
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="w-full h-32 border-2 border-dashed rounded-md"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <UploadIcon className="h-8 w-8" />
                                <span>Click to upload images</span>
                                <span className="text-xs text-muted-foreground">
                                    JPEG, PNG, WebP (max 10MB each)
                                </span>
                            </div>
                        </Button>
                    </div>

                    {previewUrls.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="relative group">
                                    <div className="aspect-square rounded-md overflow-hidden border">
                                        <img
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon-sm"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeImage(index)}
                                    >
                                        <XIcon className="h-4 w-4" />
                                    </Button>
                                    {index === 0 && (
                                        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                            Thumbnail
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {previewUrls.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-md">
                            <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                                No images selected yet
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// ============================================================================
// MAIN FORM COMPONENT
// ============================================================================
interface CarFormProps {
    vehicle?: any
    onSuccess?: () => void
    onCancel?: () => void
}

export function CarForm({ vehicle, onSuccess, onCancel }: CarFormProps) {
    const [currentStep, setCurrentStep] = React.useState(1)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const convex = useConvex()

    const form = useForm<VehicleFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(vehicleFormSchema) as any,
        defaultValues: vehicle
            ? {
                ...vehicle,
                features: vehicle.features || [],
                safetyFeatures: vehicle.safetyFeatures || [],
                comfortFeatures: vehicle.comfortFeatures || [],
                technologyFeatures: vehicle.technologyFeatures || [],
                images: vehicle.images || [],
                featured: vehicle.featured || false,
            }
            : {
                title: "",
                category: "sedan",
                make: "",
                model: "",
                year: new Date().getFullYear(),
                price: 0,
                currency: "KES",
                negotiable: false,
                featured: false,
                condition: "brand_new",
                mileage: 0,
                mileageUnit: "km",
                fuelType: "petrol",
                transmission: "automatic",
                exteriorColor: "",
                interiorColor: "",
                femaleOwned: false,
                accidentFree: true,
                repainted: false,
                features: [],
                safetyFeatures: [],
                comfortFeatures: [],
                technologyFeatures: [],
                city: "",
                country: "",
                images: [],
            },
    })

    const createVehicle = useMutation(api.vehicles.createVehicle)
    const updateVehicle = useMutation(api.vehicles.updateVehicle)
    const generateUploadUrl = useMutation(api.vehicles.generateUploadUrl)
    const saveFileUrl = useMutation(api.vehicles.saveFileUrl)

    const steps = [
        { title: "Basic Info", component: Step1BasicInfo },
        { title: "Vehicle Details", component: Step2VehicleDetails },
        { title: "Features", component: Step3Features },
        { title: "Location", component: Step4LocationContact },
        { title: "Images", component: Step5Images },
    ]

    const handleNext = async () => {
        const currentStepFields = getStepFields(currentStep)
        const isValid = await form.trigger(currentStepFields)

        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length))
        } else {
            toast.error("Please fix the errors before proceeding")
        }
    }

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    const getStepFields = (step: number): (keyof VehicleFormValues)[] => {
        switch (step) {
            case 1:
                return ["title", "category", "make", "model", "year", "price", "currency"]
            case 2:
                return [
                    "condition",
                    "mileage",
                    "mileageUnit",
                    "fuelType",
                    "transmission",
                    "exteriorColor",
                ]
            case 3:
                return ["features"]
            case 4:
                return ["city", "country", "sellerContactEmail"]
            case 5:
                return ["images"]
            default:
                return []
        }
    }

    const onSubmit: SubmitHandler<VehicleFormValues> = async (data) => {
        try {
            setIsSubmitting(true)

            // Handle image uploads
            let imageUrls: string[] = []
            let thumbnailUrl: string | undefined

            if (data.images && data.images.length > 0) {
                // In a real implementation, you'd have the actual File objects
                // For now, we'll use the placeholder URLs
                imageUrls = data.images

                // Set first image as thumbnail
                if (imageUrls.length > 0) {
                    thumbnailUrl = imageUrls[0]
                }
            }

            // Build a payload with only the fields the Convex mutations accept.
            // Using spread `...data` would leak form-only fields (safetyFeatures,
            // comfortFeatures, technologyFeatures) that the validators reject.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const vehicleData: any = {
                userId: "dummy-user-id" as Id<"users">, // replace with real auth userId
                title: data.title,
                category: data.category,
                make: data.make,
                model: data.model,
                year: data.year,
                price: data.price,
                currency: data.currency,
                negotiable: data.negotiable,
                featured: data.featured,
                condition: data.condition,
                mileage: data.mileage,
                mileageUnit: data.mileageUnit,
                fuelType: data.fuelType,
                transmission: data.transmission,
                exteriorColor: data.exteriorColor,
                city: data.city,
                country: data.country,
                femaleOwned: data.femaleOwned,
                accidentFree: data.accidentFree,
                repainted: data.repainted,
                features: data.features,
                images: imageUrls,
                // optional fields
                drivetrain: data.drivetrain,
                interiorColor: data.interiorColor,
                interiorMaterial: data.interiorMaterial,
                doorsCount: data.doorsCount,
                stateOrCounty: data.stateOrCounty,
                address: data.address,
                sellerContactName: data.sellerContactName,
                sellerContactPhone: data.sellerContactPhone,
                sellerContactWhatsApp: data.sellerContactWhatsApp,
                sellerContactEmail: data.sellerContactEmail || undefined,
                thumbnailUrl,
                status: "draft" as const,
            }

            if (vehicle) {
                await updateVehicle({ id: vehicle._id, ...vehicleData })
                toast.success("Vehicle updated successfully")
            } else {
                await createVehicle(vehicleData)
                toast.success("Vehicle created successfully")
            }

            onSuccess?.()
        } catch (error) {
            console.error("Failed to save vehicle:", error)
            toast.error("Failed to save vehicle. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const CurrentStepComponent = steps[currentStep - 1].component

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">

                {/* Step Indicator */}
                <div className="space-y-3">
                    <div className="flex items-center gap-1">
                        {steps.map((step, index) => {
                            const stepNum = index + 1
                            const isActive = stepNum === currentStep
                            const isDone = stepNum < currentStep
                            return (
                                <React.Fragment key={step.title}>
                                    <div className="flex flex-col items-center gap-1 flex-1">
                                        <div
                                            className={[
                                                "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                                                isActive ? "bg-primary text-primary-foreground" : isDone ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                                            ].join(" ")}
                                        >
                                            {isDone ? "✓" : stepNum}
                                        </div>
                                        <span className={["text-[10px] text-center hidden sm:block", isActive ? "text-primary font-medium" : "text-muted-foreground"].join(" ")}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={["h-0.5 flex-1 mb-4 transition-colors", stepNum < currentStep ? "bg-primary/40" : "bg-muted"].join(" ")} />
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </div>
                    <Progress value={(currentStep / steps.length) * 100} className="h-1" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Step {currentStep} of {steps.length}</span>
                        <span className="font-medium text-foreground">{steps[currentStep - 1].title}</span>
                    </div>
                </div>

                {/* Current Step */}
                <CurrentStepComponent
                    form={form}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    isFirstStep={currentStep === 1}
                    isLastStep={currentStep === steps.length}
                />

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => { e.preventDefault(); handlePrevious() }}
                        disabled={currentStep === 1}
                    >
                        <ChevronLeftIcon className="mr-2 h-4 w-4" />
                        Previous
                    </Button>

                    <div className="flex gap-2">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={(e) => { e.preventDefault(); onCancel() }}
                            >
                                Cancel
                            </Button>
                        )}

                        {currentStep < steps.length ? (
                            <Button
                                type="button"
                                onClick={(e) => { e.preventDefault(); handleNext() }}
                            >
                                Next
                                <ChevronRightIcon className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : vehicle ? "Update Vehicle" : "Create Vehicle"}
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}
