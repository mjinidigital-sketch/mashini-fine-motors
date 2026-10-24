import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Public query to list inquiries by vehicle
export const listByVehicle = query({
  args: { vehicleId: v.id("vehicles") },
  handler: async (ctx, args) => {
    const inquiries = await ctx.db
      .query("inquiries")
      .withIndex("byVehicle", (q) => q.eq("vehicleId", args.vehicleId))
      .collect();
    return inquiries;
  },
});

// Public query to list inquiries by buyer
export const listByBuyer = query({
  args: { buyerId: v.id("users") },
  handler: async (ctx, args) => {
    const inquiries = await ctx.db
      .query("inquiries")
      .withIndex("byBuyer", (q) => q.eq("buyerId", args.buyerId))
      .collect();
    return inquiries;
  },
});

// Public query to list inquiries by seller
export const listBySeller = query({
  args: { sellerId: v.id("users") },
  handler: async (ctx, args) => {
    const inquiries = await ctx.db
      .query("inquiries")
      .withIndex("bySeller", (q) => q.eq("sellerId", args.sellerId))
      .collect();
    return inquiries;
  },
});

// Enriched inquiries for a user (both received and sent, with vehicle details)
export const listEnrichedByUserFlexible = query({
  args: { userIdentifier: v.string() },
  handler: async (ctx, args) => {
    let user = null;

    if (args.userIdentifier === "me" || args.userIdentifier === "current") {
      const identity = await ctx.auth.getUserIdentity();
      if (identity) {
        user = await ctx.db
          .query("users")
          .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
          .first();
      }
    }

    if (!user) {
      try {
        user = await ctx.db.get(args.userIdentifier as any);
      } catch {
        // not convex id
      }
    }

    if (!user) {
      user = await ctx.db
        .query("users")
        .withIndex("byExternalId", (q) => q.eq("externalId", args.userIdentifier))
        .first();
    }

    if (!user) return { received: [], sent: [] };

    const userId = user._id as Id<"users">;

    const [receivedRaw, sentRaw] = await Promise.all([
      ctx.db
        .query("inquiries")
        .withIndex("bySeller", (q) => q.eq("sellerId", userId))
        .take(50),
      ctx.db
        .query("inquiries")
        .withIndex("byBuyer", (q) => q.eq("buyerId", userId))
        .take(50),
    ]);

    const enrichInquiries = async (list: typeof receivedRaw) => {
      return await Promise.all(
        list.map(async (inq) => {
          const vehicle = await ctx.db.get(inq.vehicleId);
          const buyer = await ctx.db.get(inq.buyerId);
          const seller = await ctx.db.get(inq.sellerId);
          return {
            ...inq,
            vehicle: vehicle
              ? {
                  _id: vehicle._id,
                  title: vehicle.title,
                  make: vehicle.make,
                  model: vehicle.model,
                  year: vehicle.year,
                  price: vehicle.price,
                  currency: vehicle.currency,
                  image: vehicle.thumbnailUrl || vehicle.images?.[0] || "",
                }
              : null,
            buyer: buyer ? { _id: buyer._id, name: buyer.name, email: buyer.email, phone: buyer.phone, imageUrl: buyer.imageUrl } : null,
            seller: seller ? { _id: seller._id, name: seller.name, email: seller.email, phone: seller.phone } : null,
          };
        })
      );
    };

    const [received, sent] = await Promise.all([
      enrichInquiries(receivedRaw),
      enrichInquiries(sentRaw),
    ]);

    return { received, sent };
  },
});

// Public mutation to create an inquiry
export const create = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    buyerId: v.id("users"),
    sellerId: v.id("users"),
    type: v.union(
      v.literal("inquiry"),
      v.literal("offer"),
      v.literal("test_drive_request"),
      v.literal("inspection_request")
    ),
    message: v.string(),
    offeredPrice: v.optional(v.number()),
    preferredTestDriveDate: v.optional(v.number()),
    buyerContactPhone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("inquiries", {
      ...args,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },
});

// Public mutation to update inquiry status
export const updateStatus = mutation({
  args: {
    id: v.id("inquiries"),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("countered"),
      v.literal("closed")
    ),
    counterOfferPrice: v.optional(v.number()),
    sellerResponse: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      counterOfferPrice: args.counterOfferPrice,
      sellerResponse: args.sellerResponse,
      updatedAt: Date.now(),
    });
  },
});
