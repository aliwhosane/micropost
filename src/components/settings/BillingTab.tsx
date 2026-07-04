"use client";

import { PricingCard } from "@/components/settings/PricingCard";
import { Zap, CreditCard } from "lucide-react";

interface BillingTabProps {
    subscriptionStatus: string | null;
    productIdPro: string;
    productIdAgencyMonthly: string;
    productIdAgencyYearly: string;
}

export function BillingTab({
    subscriptionStatus,
    productIdPro,
    productIdAgencyMonthly,
    productIdAgencyYearly,
}: BillingTabProps) {
    const isActive = subscriptionStatus === "active" || subscriptionStatus === "trialing";

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-tertiary/10 text-tertiary">
                    <CreditCard className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-on-surface">
                        Billing & Subscription
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                        {isActive
                            ? "You're on an active plan. Manage or change your subscription below."
                            : "Choose a plan to unlock the full power of your AI ghostwriter."}
                    </p>
                </div>
            </div>

            {/* Pricing cards */}
            {isActive ? (
                <PricingCard
                    name="Active Subscription"
                    price="Active"
                    description="Manage your subscription in the portal."
                    features={["Unlimited Posts", "Priority Support", "Feature Access"]}
                    buttonText="Manage Subscription"
                    productId=""
                    isActive={true}
                    isPopular={false}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Pro Plan */}
                    <PricingCard
                        name="Pro"
                        price="$29"
                        description="For serious creators."
                        features={["3 Posts/day", "Basic Analytics", "No Shorts"]}
                        buttonText="Subscribe"
                        productId={productIdPro}
                        isPopular={false}
                    />

                    {/* Agency Monthly */}
                    <PricingCard
                        name="Agency"
                        price="$99"
                        description="Ultimate power & video."
                        features={[
                            "Unlimited Posts",
                            "Advanced Analytics",
                            "Unlimited Shorts",
                            "Commercial Rights",
                        ]}
                        buttonText="Subscribe"
                        productId={productIdAgencyMonthly}
                        isPopular={false}
                    />

                    {/* Agency Yearly - Early Bird */}
                    <PricingCard
                        name="Agency Yearly"
                        price="$399"
                        description="Limited Time Founder's Deal."
                        features={[
                            "Everything in Agency",
                            "4 months free",
                            "Founder Badge",
                        ]}
                        buttonText="Get Yearly Deal"
                        productId={productIdAgencyYearly}
                        isPopular={true}
                    />
                </div>
            )}
        </div>
    );
}
