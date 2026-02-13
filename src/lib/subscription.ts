import { User } from "@prisma/client";

export type SubscriptionTier = "STARTER" | "PRO" | "AGENCY";

export const SUBSCRIPTION_TIERS = {
    STARTER: "STARTER",
    PRO: "PRO",
    AGENCY: "AGENCY",
} as const;

export interface PlanLimits {
    postsPerDay: number;
    shortsPerDay: number;
    hasAnalytics: boolean;
    hasUnlimitedShorts: boolean;
}

export const PLAN_LIMITS: Record<SubscriptionTier, PlanLimits> = {
    STARTER: {
        postsPerDay: 1,
        shortsPerDay: 0,
        hasAnalytics: false,
        hasUnlimitedShorts: false,
    },
    PRO: {
        postsPerDay: 3,
        shortsPerDay: 0,
        hasAnalytics: true,
        hasUnlimitedShorts: false,
    },
    AGENCY: {
        postsPerDay: 100, // Effectively unlimited
        shortsPerDay: 100, // Effectively unlimited
        hasAnalytics: true,
        hasUnlimitedShorts: true,
    },
};

export function getSubscriptionTier(user: { subscriptionStatus?: string | null; subscriptionPlanId?: string | null } | null | undefined): SubscriptionTier {
    if (!user || !user.subscriptionStatus) return "STARTER";

    const isActive = user.subscriptionStatus === "active" || user.subscriptionStatus === "trialing";
    if (!isActive) return "STARTER";

    const planId = user.subscriptionPlanId;

    // Agency / Lifetime Tiers
    if (
        planId === process.env.POLAR_PRODUCT_ID_AGENCY_MONTHLY ||
        planId === process.env.POLAR_PRODUCT_ID_AGENCY_YEARLY ||
        planId === process.env.POLAR_PRODUCT_ID_LIFETIME // Legacy/Founder support
    ) {
        return "AGENCY";
    }

    // Pro Tier
    if (planId === process.env.POLAR_PRODUCT_ID_PRO) {
        return "PRO";
    }

    // Default to Starter if active but unrecognized plan (safety fallback)
    return "STARTER";
}

export function getPlanLimits(tier: SubscriptionTier): PlanLimits {
    return PLAN_LIMITS[tier];
}
