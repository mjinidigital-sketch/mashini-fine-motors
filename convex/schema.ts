import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // -------------------------------------------------------------------------
    // USERS TABLE
    // -------------------------------------------------------------------------
    users: defineTable({
        // Core fields (used by Clerk webhook upsert)
        name: v.string(),
        externalId: v.optional(v.string()),

        // Legacy / extended profile fields
        clerkId: v.optional(v.string()),
        email: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        phone: v.optional(v.string()),
        role: v.optional(v.string()), // e.g. "buyer", "seller", "dealer", "admin"
        status: v.optional(v.string()),
        tokenIdentifier: v.optional(v.string()),
        notes: v.optional(v.string()),
        verified: v.optional(v.boolean()),
        ridesCount: v.optional(v.number()),

        // Seller / Dealer specific attributes
        isDealer: v.optional(v.boolean()),
        dealershipName: v.optional(v.string()),
        dealerLicenseNumber: v.optional(v.string()),
        dealerRating: v.optional(v.number()),
        totalListingsCount: v.optional(v.number()),
        location: v.optional(v.string()),

        createdAt: v.optional(v.number()),
        updatedAt: v.optional(v.number()),
    }).index("byExternalId", ["externalId"]),

    // -------------------------------------------------------------------------
    // VEHICLES TABLE (Comprehensive Car & Auto Marketplace Listings)
    // -------------------------------------------------------------------------
    vehicles: defineTable({
        // 1. Seller / Owner
        userId: v.id("users"),
        sellerClerkId: v.optional(v.string()),
        sellerType: v.optional(
            v.union(
                v.literal("individual"),
                v.literal("dealer"),
                v.literal("company")
            )
        ),
        dealershipId: v.optional(v.id("dealerships")),
        sellerVerified: v.optional(v.boolean()),

        // 2. Identification & Categorization
        title: v.string(),
        slug: v.optional(v.string()),
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
        trim: v.optional(v.string()),
        year: v.number(),
        generation: v.optional(v.string()),
        bodyType: v.optional(v.string()),
        vinOrChassisNumber: v.optional(v.string()),
        engineNumber: v.optional(v.string()),
        registrationNumber: v.optional(v.string()),
        stockNumber: v.optional(v.string()),
        countryOfOrigin: v.optional(v.string()),
        importYear: v.optional(v.number()),
        firstRegistrationYear: v.optional(v.number()),
        previousRegistrationCountry: v.optional(v.string()),

        // 3. Listing Type, Pricing & Status
        price: v.number(),
        currency: v.string(), // KES, USD, EUR
        negotiable: v.optional(v.boolean()),
        originalPrice: v.optional(v.number()),
        depositAmount: v.optional(v.number()),
        minimumFinanceDeposit: v.optional(v.number()),
        financingAvailable: v.optional(v.boolean()),

        status: v.union(
            v.literal("draft"),
            v.literal("pending_approval"),
            v.literal("active"),
            v.literal("reserved"),
            v.literal("sold"),
            v.literal("archived")
        ),
        featured: v.optional(v.boolean()),
        featuredUntil: v.optional(v.number()),
        promoted: v.optional(v.boolean()),
        promotionExpiresAt: v.optional(v.number()),
        rejectionReason: v.optional(v.string()),
        moderationNotes: v.optional(v.string()),

        // 4. Condition & Ownership History
        condition: v.union(
            v.literal("brand_new"),
            v.literal("foreign_used"),
            v.literal("locally_used")
        ),
        mileage: v.number(),
        mileageUnit: v.union(v.literal("km"), v.literal("miles")),
        femaleOwned: v.boolean(),
        accidentFree: v.boolean(),
        repainted: v.boolean(),
        originalPaint: v.optional(v.boolean()),
        numberOfPreviousOwners: v.optional(v.number()),
        dutyPaid: v.optional(v.boolean()),
        logbookAvailable: v.optional(v.boolean()),
        warrantyRemainingMonths: v.optional(v.number()),
        warrantyDescription: v.optional(v.string()),
        defects: v.optional(v.array(v.string())),
        keysAvailable: v.optional(v.number()),
        spareTyreAvailable: v.optional(v.boolean()),

        // 5. Engine, Powertrain & Performance
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
        drivetrain: v.optional(
            v.union(
                v.literal("fwd"),
                v.literal("rwd"),
                v.literal("4wd"),
                v.literal("awd")
            )
        ),
        engineSizeCc: v.optional(v.number()),
        fuelConsumption: v.optional(v.string()),
        topSpeedKph: v.optional(v.number()),
        turbocharged: v.optional(v.boolean()),

        // 6. Electric Vehicle Specifications
        batteryCapacityKwh: v.optional(v.number()),
        electricRangeKm: v.optional(v.number()),
        chargingTimeHours: v.optional(v.number()),
        chargingPortType: v.optional(v.string()),
        batteryHealthPercent: v.optional(v.number()),
        batteryWarrantyMonths: v.optional(v.number()),
        fastChargingSupported: v.optional(v.boolean()),

        // 7. Commercial, Bus & Agricultural Specifications
        seatingCapacity: v.optional(v.number()),
        payloadCapacityKg: v.optional(v.number()),
        towingCapacityKg: v.optional(v.number()),
        grossVehicleWeightKg: v.optional(v.number()),
        axleCount: v.optional(v.number()),
        wheelConfiguration: v.optional(v.string()),
        bedLength: v.optional(v.string()),
        hydraulicSystem: v.optional(v.boolean()),

        // 8. Exterior & Interior
        exteriorColor: v.string(),
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
        wheelSizeInches: v.optional(v.number()),
        alloyWheels: v.optional(v.boolean()),
        sunroof: v.optional(v.boolean()),
        panoramicRoof: v.optional(v.boolean()),
        roofRails: v.optional(v.boolean()),
        fogLights: v.optional(v.boolean()),
        ledHeadlights: v.optional(v.boolean()),

        // 9. Safety, Comfort & Technology
        features: v.array(v.string()),
        safetyFeatures: v.optional(v.array(v.string())),
        comfortFeatures: v.optional(v.array(v.string())),
        technologyFeatures: v.optional(v.array(v.string())),
        airbagsCount: v.optional(v.number()),
        abs: v.optional(v.boolean()),
        tractionControl: v.optional(v.boolean()),
        stabilityControl: v.optional(v.boolean()),
        parkingSensors: v.optional(v.boolean()),
        rearCamera: v.optional(v.boolean()),
        surroundCamera: v.optional(v.boolean()),
        adaptiveCruiseControl: v.optional(v.boolean()),
        laneAssist: v.optional(v.boolean()),
        appleCarPlay: v.optional(v.boolean()),
        androidAuto: v.optional(v.boolean()),
        bluetooth: v.optional(v.boolean()),
        navigationSystem: v.optional(v.boolean()),
        climateControl: v.optional(v.boolean()),
        heatedSeats: v.optional(v.boolean()),
        ventilatedSeats: v.optional(v.boolean()),
        electricSeats: v.optional(v.boolean()),
        keylessEntry: v.optional(v.boolean()),
        pushButtonStart: v.optional(v.boolean()),

        // 10. Location
        city: v.string(),
        stateOrCounty: v.optional(v.string()),
        country: v.string(),
        address: v.optional(v.string()),
        latitude: v.optional(v.number()),
        longitude: v.optional(v.number()),
        locationLabel: v.optional(v.string()),

        // 11. Images & Documents
        images: v.array(v.string()),
        thumbnailUrl: v.optional(v.string()),
        additionalDocuments: v.optional(
            v.array(
                v.object({
                    name: v.string(),
                    url: v.string(),
                    type: v.string(),
                })
            )
        ),

        // 12. Description & Search Metadata
        keywords: v.optional(v.array(v.string())),
        seoTitle: v.optional(v.string()),
        seoDescription: v.optional(v.string()),

        // 13. Seller Contact
        sellerContactName: v.optional(v.string()),
        sellerContactPhone: v.optional(v.string()),
        sellerContactWhatsApp: v.optional(v.string()),
        sellerContactEmail: v.optional(v.string()),
        allowWhatsAppChat: v.optional(v.boolean()),
        allowPhoneCalls: v.optional(v.boolean()),
        preferredContactMethod: v.optional(
            v.union(
                v.literal("phone"),
                v.literal("whatsapp"),
                v.literal("email"),
                v.literal("platform")
            )
        ),

        // 16. Analytics & Engagement
        viewsCount: v.optional(v.number()),
        savesCount: v.optional(v.number()),
        inquiriesCount: v.optional(v.number()),
        sharesCount: v.optional(v.number()),
        lastViewedAt: v.optional(v.number()),
        lastInquiryAt: v.optional(v.number()),

        // 17. Publication & Timestamps
        publishedAt: v.optional(v.number()),
        expiresAt: v.optional(v.number()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        // Ownership and seller queries
        .index("byUser", ["userId"])
        .index("bySellerClerkId", ["sellerClerkId"])
        .index("byDealership", ["dealershipId"])

        // Listing discovery
        .index("bySlug", ["slug"])
        .index("byCategory", ["category"])
        .index("byStatus", ["status"])
        .index("byCategoryAndStatus", ["category", "status"])
        .index("byMake", ["make"])
        .index("byMakeAndModel", ["make", "model"])
        .index("byYear", ["year"])
        .index("byPrice", ["price"])
        .index("byFeatured", ["featured", "status"])
        .index("byPublishedAt", ["publishedAt"])
        .index("byCreatedAt", ["createdAt"])

        // Location discovery
        .index("byCity", ["city"])
        .index("byCounty", ["stateOrCounty"])
        .index("byCountry", ["country"])
        .index("byCityAndStatus", ["city", "status"])
        .index("byCountyAndStatus", ["stateOrCounty", "status"])

        // Condition and fuel filters
        .index("byCondition", ["condition"])
        .index("byFuelType", ["fuelType"])
        .index("byTransmission", ["transmission"])

        // Marketplace filtering
        .index("byMakeAndStatus", ["make", "status"])
        .index("byCategoryAndPrice", ["category", "price"])
        .index("byMakeAndPrice", ["make", "price"])
        .index("byYearAndPrice", ["year", "price"])
        .index("byStatusAndPrice", ["status", "price"])
        .index("byStatusAndPublishedAt", ["status", "publishedAt"])

        // Moderation and verification
        .index("bySellerVerified", ["sellerVerified", "status"])
        .index("byPromotionExpiry", ["promotionExpiresAt"])
        .index("byExpiry", ["expiresAt"]),
    // -------------------------------------------------------------------------
    // VEHICLE INQUIRIES & OFFERS TABLE (Buyer-Seller Interaction)
    // -------------------------------------------------------------------------
    inquiries: defineTable({
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
        status: v.union(
            v.literal("pending"),
            v.literal("accepted"),
            v.literal("declined"),
            v.literal("countered"),
            v.literal("closed")
        ),
        counterOfferPrice: v.optional(v.number()),
        sellerResponse: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("byVehicle", ["vehicleId"])
        .index("byBuyer", ["buyerId"])
        .index("bySeller", ["sellerId"])
        .index("byVehicleAndBuyer", ["vehicleId", "buyerId"]),

    // -------------------------------------------------------------------------
    // VEHICLE INSURANCE POLICIES TABLE
    // -------------------------------------------------------------------------
    insurance: defineTable({
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
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("byUser", ["userId"])
        .index("byUserClerkId", ["userClerkId"])
        .index("byVehicle", ["vehicleId"])
        .index("byStatus", ["status"])
        .index("byPolicyNumber", ["policyNumber"]),
});