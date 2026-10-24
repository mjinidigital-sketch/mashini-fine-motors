// convex/vehicles.ts
import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { Id, Doc } from "./_generated/dataModel";

export const getAllVehicles = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("vehicles").take(1000);
    },
});

export const listActive = query({
    args: {
        category: v.optional(v.string()),
        make: v.optional(v.string()),
        minPrice: v.optional(v.number()),
        maxPrice: v.optional(v.number()),
        condition: v.optional(v.string()),
        city: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let query = ctx.db
            .query("vehicles")
            .withIndex("byStatus", (q) => q.eq("status", "active"));

        const vehicles = await query.take(100);

        return vehicles.filter((vehicle) => {
            if (args.category && vehicle.category !== args.category) return false;
            if (args.make && vehicle.make !== args.make) return false;
            if (args.minPrice !== undefined && vehicle.price < args.minPrice) return false;
            if (args.maxPrice !== undefined && vehicle.price > args.maxPrice) return false;
            if (args.condition && vehicle.condition !== args.condition) return false;
            if (args.city && vehicle.city !== args.city) return false;
            return true;
        });
    },
});

export const listFeatured = query({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();
        const vehicles = await ctx.db
            .query("vehicles")
            .withIndex("byFeatured", (q) => q.eq("featured", true).eq("status", "active"))
            .take(20);

        return vehicles
            .filter((vehicle) => {
                if (vehicle.featuredUntil && vehicle.featuredUntil < now) {
                    return false;
                }
                return true;
            })
            .slice(0, 8);
    },
});

export const getUniqueMakes = query({
    args: {},
    handler: async (ctx) => {
        const vehicles = await ctx.db
            .query("vehicles")
            .withIndex("byStatus", (q) => q.eq("status", "active"))
            .take(1000);
        const makes = new Set(vehicles.map((v) => v.make));
        return Array.from(makes).sort();
    },
});

export const getUniqueCities = query({
    args: {},
    handler: async (ctx) => {
        const vehicles = await ctx.db
            .query("vehicles")
            .withIndex("byStatus", (q) => q.eq("status", "active"))
            .take(1000);
        const cities = new Set(vehicles.map((v) => v.city));
        return Array.from(cities).sort();
    },
});

export const getVehicleById = query({
    args: { id: v.id("vehicles") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const listByUser = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("vehicles")
            .withIndex("byUser", (q) => q.eq("userId", args.userId))
            .order("desc")
            .take(100);
    },
});

export const listByUserFlexible = query({
    args: {
        userIdentifier: v.string(),
    },
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
                // Not a valid convex ID
            }
        }

        if (!user) {
            user = await ctx.db
                .query("users")
                .withIndex("byExternalId", (q) => q.eq("externalId", args.userIdentifier))
                .first();
        }

        if (!user) {
            // Try by sellerClerkId
            return await ctx.db
                .query("vehicles")
                .withIndex("bySellerClerkId", (q) => q.eq("sellerClerkId", args.userIdentifier))
                .take(100);
        }

        // Check if user is actually a user document
        if ("clerkId" in user || "externalId" in user) {
            const userId = user._id as Id<"users">;
            const byUserId = await ctx.db
                .query("vehicles")
                .withIndex("byUser", (q) => q.eq("userId", userId))
                .order("desc")
                .take(100);

            if (byUserId.length > 0) return byUserId;

            const clerkId = (user as any).clerkId || (user as any).externalId;
            if (clerkId) {
                return await ctx.db
                    .query("vehicles")
                    .withIndex("bySellerClerkId", (q) => q.eq("sellerClerkId", clerkId))
                    .take(100);
            }
        }

        return [];
    },
});

export const createVehicle = mutation({
    args: {
        userId: v.id("users"),
        title: v.string(),
        category: v.union(
            v.literal("sedan"),
            v.literal("suv"),
            v.literal("lorry"),
            v.literal("pickup"),
            v.literal("ev"),
            v.literal("bike"),
            v.literal("farm_equipment"),
            v.literal("bus"),
            v.literal("minibus"),
            v.literal("van"),
            v.literal("station_wagon"),
            v.literal("hatchback"),
            v.literal("coupe"),
            v.literal("convertible"),
            v.literal("heavy_machinery"),
            v.literal("other")
        ),
        make: v.string(),
        model: v.string(),
        year: v.number(),
        price: v.number(),
        currency: v.string(),
        condition: v.union(
            v.literal("brand_new"),
            v.literal("foreign_used"),
            v.literal("locally_used")
        ),
        mileage: v.number(),
        mileageUnit: v.union(v.literal("km"), v.literal("miles")),
        fuelType: v.union(
            v.literal("petrol"),
            v.literal("diesel"),
            v.literal("electric"),
            v.literal("hybrid"),
            v.literal("plug_in_hybrid"),
            v.literal("cng_lpg"),
            v.literal("other")
        ),
        transmission: v.union(
            v.literal("automatic"),
            v.literal("manual"),
            v.literal("cvt"),
            v.literal("dual_clutch"),
            v.literal("semi_automatic")
        ),
        exteriorColor: v.string(),
        city: v.string(),
        country: v.string(),
        femaleOwned: v.boolean(),
        accidentFree: v.boolean(),
        repainted: v.boolean(),
        features: v.array(v.string()),
        images: v.array(v.string()),
        // Optional fields
        sellerClerkId: v.optional(v.string()),
        sellerType: v.optional(
            v.union(
                v.literal("individual"),
                v.literal("dealer"),
                v.literal("company")
            )
        ),
        dealershipId: v.optional(v.id("dealerships")),
        trim: v.optional(v.string()),
        bodyType: v.optional(v.string()),
        vinOrChassisNumber: v.optional(v.string()),
        engineNumber: v.optional(v.string()),
        registrationNumber: v.optional(v.string()),
        negotiable: v.optional(v.boolean()),
        featured: v.optional(v.boolean()),
        status: v.optional(
            v.union(
                v.literal("draft"),
                v.literal("pending_approval"),
                v.literal("active"),
                v.literal("reserved"),
                v.literal("sold"),
                v.literal("archived")
            )
        ),
        drivetrain: v.optional(
            v.union(
                v.literal("fwd"),
                v.literal("rwd"),
                v.literal("4wd"),
                v.literal("awd")
            )
        ),
        engineSizeCc: v.optional(v.number()),
        interiorColor: v.optional(v.string()),
        interiorMaterial: v.optional(
            v.union(
                v.literal("leather"),
                v.literal("fabric"),
                v.literal("synthetic"),
                v.literal("alcantara"),
                v.literal("other")
            )
        ),
        doorsCount: v.optional(v.number()),
        stateOrCounty: v.optional(v.string()),
        address: v.optional(v.string()),
        thumbnailUrl: v.optional(v.string()),
        sellerContactName: v.optional(v.string()),
        sellerContactPhone: v.optional(v.string()),
        sellerContactWhatsApp: v.optional(v.string()),
        sellerContactEmail: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const rawBase = `${args.year} ${args.make} ${args.model} ${args.trim || ""}`.trim() || args.title;
        const baseSlug = (args as any).slug
            ? (args as any).slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
            : rawBase.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

        const existing = await ctx.db
            .query("vehicles")
            .withIndex("bySlug", (q) => q.eq("slug", baseSlug))
            .first();

        const candidateSlug = existing
            ? `${baseSlug}-${Date.now().toString(36).slice(-4)}`
            : baseSlug;

        const vehicleId = await ctx.db.insert("vehicles", {
            ...args,
            slug: candidateSlug,
            status: args.status || "draft",
            featured: args.featured || false,
            featuredUntil: args.featured ? now + (30 * 24 * 60 * 60 * 1000) : undefined, // 30 days from now
            createdAt: now,
            updatedAt: now,
        });
        return vehicleId;
    },
});

export const updateVehicle = mutation({
    args: {
        id: v.id("vehicles"),
        // All the same fields as create
        userId: v.id("users"),
        title: v.string(),
        category: v.union(
            v.literal("sedan"),
            v.literal("suv"),
            v.literal("lorry"),
            v.literal("pickup"),
            v.literal("ev"),
            v.literal("bike"),
            v.literal("farm_equipment"),
            v.literal("bus"),
            v.literal("minibus"),
            v.literal("van"),
            v.literal("station_wagon"),
            v.literal("hatchback"),
            v.literal("coupe"),
            v.literal("convertible"),
            v.literal("heavy_machinery"),
            v.literal("other")
        ),
        make: v.string(),
        model: v.string(),
        year: v.number(),
        price: v.number(),
        currency: v.string(),
        condition: v.union(
            v.literal("brand_new"),
            v.literal("foreign_used"),
            v.literal("locally_used")
        ),
        mileage: v.number(),
        mileageUnit: v.union(v.literal("km"), v.literal("miles")),
        fuelType: v.union(
            v.literal("petrol"),
            v.literal("diesel"),
            v.literal("electric"),
            v.literal("hybrid"),
            v.literal("plug_in_hybrid"),
            v.literal("cng_lpg"),
            v.literal("other")
        ),
        transmission: v.union(
            v.literal("automatic"),
            v.literal("manual"),
            v.literal("cvt"),
            v.literal("dual_clutch"),
            v.literal("semi_automatic")
        ),
        exteriorColor: v.string(),
        city: v.string(),
        country: v.string(),
        femaleOwned: v.boolean(),
        accidentFree: v.boolean(),
        repainted: v.boolean(),
        features: v.array(v.string()),
        images: v.array(v.string()),
        sellerClerkId: v.optional(v.string()),
        sellerType: v.optional(
            v.union(
                v.literal("individual"),
                v.literal("dealer"),
                v.literal("company")
            )
        ),
        dealershipId: v.optional(v.id("dealerships")),
        trim: v.optional(v.string()),
        bodyType: v.optional(v.string()),
        vinOrChassisNumber: v.optional(v.string()),
        engineNumber: v.optional(v.string()),
        registrationNumber: v.optional(v.string()),
        negotiable: v.optional(v.boolean()),
        featured: v.optional(v.boolean()),
        status: v.optional(
            v.union(
                v.literal("draft"),
                v.literal("pending_approval"),
                v.literal("active"),
                v.literal("reserved"),
                v.literal("sold"),
                v.literal("archived")
            )
        ),
        drivetrain: v.optional(
            v.union(
                v.literal("fwd"),
                v.literal("rwd"),
                v.literal("4wd"),
                v.literal("awd")
            )
        ),
        engineSizeCc: v.optional(v.number()),
        interiorColor: v.optional(v.string()),
        interiorMaterial: v.optional(
            v.union(
                v.literal("leather"),
                v.literal("fabric"),
                v.literal("synthetic"),
                v.literal("alcantara"),
                v.literal("other")
            )
        ),
        doorsCount: v.optional(v.number()),
        stateOrCounty: v.optional(v.string()),
        address: v.optional(v.string()),
        thumbnailUrl: v.optional(v.string()),
        sellerContactName: v.optional(v.string()),
        sellerContactPhone: v.optional(v.string()),
        sellerContactWhatsApp: v.optional(v.string()),
        sellerContactEmail: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...vehicleData } = args;
        const existing = await ctx.db.get(id);
        if (!existing) {
            throw new Error("Vehicle not found");
        }

        const now = Date.now();
        const updateData: any = {
            ...vehicleData,
            updatedAt: now,
        };

        // If featured is being set to true and it wasn't before, set featuredUntil
        if (vehicleData.featured && !existing.featured) {
            updateData.featuredUntil = now + (30 * 24 * 60 * 60 * 1000); // 30 days from now
        }
        // If featured is being set to false, clear featuredUntil
        else if (vehicleData.featured === false) {
            updateData.featuredUntil = undefined;
        }

        await ctx.db.patch(id, updateData);
        return id;
    },
});

export const deleteVehicle = mutation({
    args: { id: v.id("vehicles") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const updateVehicleStatus = mutation({
    args: {
        id: v.id("vehicles"),
        status: v.union(
            v.literal("draft"),
            v.literal("pending_approval"),
            v.literal("active"),
            v.literal("reserved"),
            v.literal("sold"),
            v.literal("archived")
        ),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            status: args.status,
            updatedAt: Date.now(),
        });
    },
});

// Generate upload URL for client-side upload
export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});

// Save uploaded file ID to Convex storage and return URL
export const saveFileUrl = mutation({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});

export const toggleFeatured = mutation({
    args: { id: v.id("vehicles"), featured: v.boolean() },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.id);
        if (!existing) {
            throw new Error("Vehicle not found");
        }

        await ctx.db.patch(args.id, {
            featured: args.featured,
            featuredUntil: args.featured ? Date.now() + (30 * 24 * 60 * 60 * 1000) : undefined, // 30 days from now
            updatedAt: Date.now(),
        });
        return { id: args.id, featured: args.featured };
    },
});

// Look up a vehicle by its URL slug
export const getVehicleBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args): Promise<Doc<"vehicles"> | null> => {
        if (!args.slug || args.slug === "undefined") return null;

        // 1. Try slug index first
        const bySlug = await ctx.db
            .query("vehicles")
            .withIndex("bySlug", (q) => q.eq("slug", args.slug))
            .first();
        if (bySlug) return bySlug;

        // 2. Fallback: treat the slug as a raw document _id
        try {
            const byId = await ctx.db.get(args.slug as Id<"vehicles">);
            if (byId) return byId;
        } catch {
            // Not a valid Id format
        }

        // 3. Fallback: if slug has compound format [title]-[id], extract the id
        const parts = args.slug.split("-");
        const potentialId = parts[parts.length - 1];
        if (potentialId && potentialId !== args.slug) {
            try {
                const byExtractedId = await ctx.db.get(potentialId as Id<"vehicles">);
                if (byExtractedId) return byExtractedId;
            } catch {
                // Not a valid Id
            }
        }

        return null;
    },
});

// Backfill clean human-readable slugs for all vehicles (e.g. "2022-tesla-model-y")
export const backfillSlugs = mutation({
    args: {},
    handler: async (ctx) => {
        const vehicles = await ctx.db.query("vehicles").take(1000);
        let count = 0;
        const usedSlugs = new Set<string>();

        for (const vehicle of vehicles) {
            const rawBase = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ""}`.trim() || vehicle.title;
            const baseSlug = rawBase
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

            let candidateSlug = baseSlug;
            let counter = 2;
            while (usedSlugs.has(candidateSlug)) {
                candidateSlug = `${baseSlug}-${counter}`;
                counter++;
            }

            usedSlugs.add(candidateSlug);
            await ctx.db.patch(vehicle._id, { slug: candidateSlug });
            count++;
        }
        return { count };
    },
});

// Fetch related vehicles by same make/category, excluding the current one
export const getRelatedVehicles = query({
    args: {
        make: v.string(),
        category: v.union(
            v.literal("sedan"),
            v.literal("suv"),
            v.literal("lorry"),
            v.literal("pickup"),
            v.literal("ev"),
            v.literal("bike"),
            v.literal("farm_equipment"),
            v.literal("bus"),
            v.literal("minibus"),
            v.literal("van"),
            v.literal("station_wagon"),
            v.literal("hatchback"),
            v.literal("coupe"),
            v.literal("convertible"),
            v.literal("heavy_machinery"),
            v.literal("other")
        ),
        excludeId: v.id("vehicles"),
    },
    handler: async (ctx, args) => {
        const byMake = await ctx.db
            .query("vehicles")
            .withIndex("byMakeAndStatus", (q) =>
                q.eq("make", args.make).eq("status", "active")
            )
            .filter((q) => q.neq(q.field("_id"), args.excludeId))
            .take(4);

        if (byMake.length >= 4) return byMake;

        // Pad with same category if not enough by make
        const byCategory = await ctx.db
            .query("vehicles")
            .withIndex("byCategoryAndStatus", (q) =>
                q.eq("category", args.category).eq("status", "active")
            )
            .filter((q) =>
                q.and(
                    q.neq(q.field("_id"), args.excludeId),
                    q.neq(q.field("make"), args.make)
                )
            )
            .take(4 - byMake.length);

        return [...byMake, ...byCategory];
    },
});
