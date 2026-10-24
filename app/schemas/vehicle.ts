import { z } from "zod";

// ============================================================================
// ENUMS (defined first as requested)
// ============================================================================

export const SellerTypeEnum = z.enum(["individual", "dealer", "company"]);
export type SellerType = z.infer<typeof SellerTypeEnum>;

export const CategoryEnum = z.enum([
  "sedan",
  "suv",
  "lorry",
  "pickup",
  "ev",
  "bike",
  "farm_equipment",
  "bus",
  "minibus",
  "van",
  "station_wagon",
  "hatchback",
  "coupe",
  "convertible",
  "heavy_machinery",
  "other",
]);
export type Category = z.infer<typeof CategoryEnum>;

export const VehicleStatusEnum = z.enum([
  "draft",
  "pending_approval",
  "active",
  "reserved",
  "sold",
  "archived",
]);
export type VehicleStatus = z.infer<typeof VehicleStatusEnum>;

export const ConditionEnum = z.enum(["brand_new", "foreign_used", "locally_used"]);
export type Condition = z.infer<typeof ConditionEnum>;

export const MileageUnitEnum = z.enum(["km", "miles"]);
export type MileageUnit = z.infer<typeof MileageUnitEnum>;

export const FuelTypeEnum = z.enum([
  "petrol",
  "diesel",
  "electric",
  "hybrid",
  "plug_in_hybrid",
  "cng_lpg",
  "other",
]);
export type FuelType = z.infer<typeof FuelTypeEnum>;

export const TransmissionEnum = z.enum([
  "automatic",
  "manual",
  "cvt",
  "dual_clutch",
  "semi_automatic",
]);
export type Transmission = z.infer<typeof TransmissionEnum>;

export const DrivetrainEnum = z.enum(["fwd", "rwd", "4wd", "awd"]);
export type Drivetrain = z.infer<typeof DrivetrainEnum>;

export const InteriorMaterialEnum = z.enum([
  "leather",
  "fabric",
  "synthetic",
  "alcantara",
  "other",
]);
export type InteriorMaterial = z.infer<typeof InteriorMaterialEnum>;

export const PreferredContactMethodEnum = z.enum([
  "phone",
  "whatsapp",
  "email",
  "platform",
]);
export type PreferredContactMethod = z.infer<typeof PreferredContactMethodEnum>;

// ============================================================================
// VEHICLE SCHEMA
// ============================================================================

export const VehicleSchema = z.object({
  // 1. Seller / Owner
  userId: z.string(), // v.id("users")
  sellerClerkId: z.string().optional(),
  sellerType: SellerTypeEnum.optional(),
  dealershipId: z.string().optional(), // v.id("dealerships")
  sellerVerified: z.boolean().optional(),

  // 2. Identification & Categorization
  title: z.string(),
  slug: z.string().optional(),
  category: CategoryEnum,
  make: z.string(),
  model: z.string(),
  trim: z.string().optional(),
  year: z.number(),
  generation: z.string().optional(),
  bodyType: z.string().optional(),
  vinOrChassisNumber: z.string().optional(),
  engineNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
  stockNumber: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  importYear: z.number().optional(),
  firstRegistrationYear: z.number().optional(),
  previousRegistrationCountry: z.string().optional(),

  // 3. Listing Type, Pricing & Status
  price: z.number(),
  currency: z.string(), // KES, USD, EUR
  negotiable: z.boolean().optional(),
  originalPrice: z.number().optional(),
  depositAmount: z.number().optional(),
  minimumFinanceDeposit: z.number().optional(),
  financingAvailable: z.boolean().optional(),

  status: VehicleStatusEnum,
  featured: z.boolean().optional(),
  featuredUntil: z.number().optional(),
  promoted: z.boolean().optional(),
  promotionExpiresAt: z.number().optional(),
  rejectionReason: z.string().optional(),
  moderationNotes: z.string().optional(),

  // 4. Condition & Ownership History
  condition: ConditionEnum,
  mileage: z.number(),
  mileageUnit: MileageUnitEnum,
  femaleOwned: z.boolean(),
  accidentFree: z.boolean(),
  repainted: z.boolean(),
  originalPaint: z.boolean().optional(),
  numberOfPreviousOwners: z.number().optional(),
  dutyPaid: z.boolean().optional(),
  logbookAvailable: z.boolean().optional(),
  warrantyRemainingMonths: z.number().optional(),
  warrantyDescription: z.string().optional(),
  defects: z.array(z.string()).optional(),
  keysAvailable: z.number().optional(),
  spareTyreAvailable: z.boolean().optional(),

  // 5. Engine, Powertrain & Performance
  fuelType: FuelTypeEnum,
  transmission: TransmissionEnum,
  drivetrain: DrivetrainEnum.optional(),
  engineSizeCc: z.number().optional(),
  fuelConsumption: z.string().optional(),
  topSpeedKph: z.number().optional(),
  turbocharged: z.boolean().optional(),

  // 6. Electric Vehicle Specifications
  batteryCapacityKwh: z.number().optional(),
  electricRangeKm: z.number().optional(),
  chargingTimeHours: z.number().optional(),
  chargingPortType: z.string().optional(),
  batteryHealthPercent: z.number().optional(),
  batteryWarrantyMonths: z.number().optional(),
  fastChargingSupported: z.boolean().optional(),

  // 7. Commercial, Bus & Agricultural Specifications
  seatingCapacity: z.number().optional(),
  payloadCapacityKg: z.number().optional(),
  towingCapacityKg: z.number().optional(),
  grossVehicleWeightKg: z.number().optional(),
  axleCount: z.number().optional(),
  wheelConfiguration: z.string().optional(),
  bedLength: z.string().optional(),
  hydraulicSystem: z.boolean().optional(),

  // 8. Exterior & Interior
  exteriorColor: z.string(),
  interiorColor: z.string().optional(),
  interiorMaterial: InteriorMaterialEnum.optional(),
  doorsCount: z.number().optional(),
  wheelSizeInches: z.number().optional(),
  alloyWheels: z.boolean().optional(),
  sunroof: z.boolean().optional(),
  panoramicRoof: z.boolean().optional(),
  roofRails: z.boolean().optional(),
  fogLights: z.boolean().optional(),
  ledHeadlights: z.boolean().optional(),

  // 9. Safety, Comfort & Technology
  features: z.array(z.string()),
  safetyFeatures: z.array(z.string()).optional(),
  comfortFeatures: z.array(z.string()).optional(),
  technologyFeatures: z.array(z.string()).optional(),
  airbagsCount: z.number().optional(),
  abs: z.boolean().optional(),
  tractionControl: z.boolean().optional(),
  stabilityControl: z.boolean().optional(),
  parkingSensors: z.boolean().optional(),
  rearCamera: z.boolean().optional(),
  surroundCamera: z.boolean().optional(),
  adaptiveCruiseControl: z.boolean().optional(),
  laneAssist: z.boolean().optional(),
  appleCarPlay: z.boolean().optional(),
  androidAuto: z.boolean().optional(),
  bluetooth: z.boolean().optional(),
  navigationSystem: z.boolean().optional(),
  climateControl: z.boolean().optional(),
  heatedSeats: z.boolean().optional(),
  ventilatedSeats: z.boolean().optional(),
  electricSeats: z.boolean().optional(),
  keylessEntry: z.boolean().optional(),
  pushButtonStart: z.boolean().optional(),

  // 10. Location
  city: z.string(),
  stateOrCounty: z.string().optional(),
  country: z.string(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  locationLabel: z.string().optional(),

  // 11. Images & Documents
  images: z.array(z.string()),
  thumbnailUrl: z.string().optional(),
  additionalDocuments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        type: z.string(),
      })
    )
    .optional(),

  // 12. Description & Search Metadata
  keywords: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),

  // 13. Seller Contact
  sellerContactName: z.string().optional(),
  sellerContactPhone: z.string().optional(),
  sellerContactWhatsApp: z.string().optional(),
  sellerContactEmail: z.string().optional(),
  allowWhatsAppChat: z.boolean().optional(),
  allowPhoneCalls: z.boolean().optional(),
  preferredContactMethod: PreferredContactMethodEnum.optional(),

  // 16. Analytics & Engagement
  viewsCount: z.number().optional(),
  savesCount: z.number().optional(),
  inquiriesCount: z.number().optional(),
  sharesCount: z.number().optional(),
  lastViewedAt: z.number().optional(),
  lastInquiryAt: z.number().optional(),

  // 17. Publication & Timestamps
  publishedAt: z.number().optional(),
  expiresAt: z.number().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Vehicle = z.infer<typeof VehicleSchema>;
