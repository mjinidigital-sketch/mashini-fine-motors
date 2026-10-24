import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// List all insurance policies (admin / general)
export const listAll = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 100;
        return await ctx.db.query("insurance").order("desc").take(limit);
    },
});

// List insurance policies by user Convex ID
export const listByUser = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("insurance")
            .withIndex("byUser", (q) => q.eq("userId", args.userId))
            .order("desc")
            .take(100);
    },
});

// List insurance policies by Clerk user ID or Convex ID
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

        // First check if userIdentifier is a Convex ID
        if (!user) {
            try {
                user = await ctx.db.get(args.userIdentifier as Id<"users">);
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
            // Also try userClerkId index directly on insurance
            const direct = await ctx.db
                .query("insurance")
                .withIndex("byUserClerkId", (q) => q.eq("userClerkId", args.userIdentifier))
                .take(100);
            return direct;
        }

        const byUserId = await ctx.db
            .query("insurance")
            .withIndex("byUser", (q) => q.eq("userId", user._id))
            .order("desc")
            .take(100);

        if (byUserId.length > 0) return byUserId;

        // Fallback to clerk ID
        if (user.clerkId || user.externalId) {
            const clerkId = user.clerkId || user.externalId;
            return await ctx.db
                .query("insurance")
                .withIndex("byUserClerkId", (q) => q.eq("userClerkId", clerkId))
                .take(100);
        }

        return [];
    },
});

// Get a single insurance policy by ID
export const getById = query({
    args: {
        id: v.id("insurance"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create a new insurance policy
export const create = mutation({
    args: {
        userId: v.id("users"),
        userClerkId: v.optional(v.string()),
        vehicleId: v.optional(v.id("vehicles")),
        vehicleDetails: v.string(),
        policyNumber: v.string(),
        provider: v.string(),
        coverageType: v.union(
            v.literal("comprehensive"),
            v.literal("third_party"),
            v.literal("third_party_fire_theft")
        ),
        premiumAmount: v.number(),
        currency: v.string(),
        startDate: v.number(),
        endDate: v.number(),
        status: v.union(
            v.literal("active"),
            v.literal("pending"),
            v.literal("expired"),
            v.literal("cancelled")
        ),
        certificateUrl: v.optional(v.string()),
        agentName: v.optional(v.string()),
        agentContact: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const id = await ctx.db.insert("insurance", {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
        return id;
    },
});

// Update an insurance policy
export const update = mutation({
    args: {
        id: v.id("insurance"),
        vehicleDetails: v.optional(v.string()),
        policyNumber: v.optional(v.string()),
        provider: v.optional(v.string()),
        coverageType: v.optional(
            v.union(
                v.literal("comprehensive"),
                v.literal("third_party"),
                v.literal("third_party_fire_theft")
            )
        ),
        premiumAmount: v.optional(v.number()),
        currency: v.optional(v.string()),
        startDate: v.optional(v.number()),
        endDate: v.optional(v.number()),
        status: v.optional(
            v.union(
                v.literal("active"),
                v.literal("pending"),
                v.literal("expired"),
                v.literal("cancelled")
            )
        ),
        certificateUrl: v.optional(v.string()),
        agentName: v.optional(v.string()),
        agentContact: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, {
            ...fields,
            updatedAt: Date.now(),
        });
    },
});

// Delete an insurance policy
export const remove = mutation({
    args: {
        id: v.id("insurance"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
