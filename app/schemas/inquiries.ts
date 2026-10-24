import { z } from "zod";

// ============================================================================
// ENUMS (defined first as requested)
// ============================================================================

export const InquiryTypeEnum = z.enum([
  "inquiry",
  "offer",
  "test_drive_request",
  "inspection_request",
]);
export type InquiryType = z.infer<typeof InquiryTypeEnum>;

export const InquiryStatusEnum = z.enum([
  "pending",
  "accepted",
  "declined",
  "countered",
  "closed",
]);
export type InquiryStatus = z.infer<typeof InquiryStatusEnum>;

// ============================================================================
// INQUIRY SCHEMA
// ============================================================================

export const InquirySchema = z.object({
  vehicleId: z.string(), // v.id("vehicles")
  buyerId: z.string(), // v.id("users")
  sellerId: z.string(), // v.id("users")
  type: InquiryTypeEnum,
  message: z.string(),
  offeredPrice: z.number().optional(),
  preferredTestDriveDate: z.number().optional(),
  buyerContactPhone: z.string().optional(),
  status: InquiryStatusEnum,
  counterOfferPrice: z.number().optional(),
  sellerResponse: z.string().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Inquiry = z.infer<typeof InquirySchema>;
