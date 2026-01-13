"use client";

import { usePathname } from "next/navigation";
import { SubscriptionPaywall } from "@/components/dashboard/SubscriptionPaywall";

interface FeatureGuardProps {
    isSubscribed: boolean;
    children: React.ReactNode;
}

export function FeatureGuard({ isSubscribed, children }: FeatureGuardProps) {
    const pathname = usePathname();

    // Allow access to settings page regardless of subscription status
    const isSettingsPage = pathname === "/dashboard/settings";

    if (!isSubscribed && !isSettingsPage) {
        return <SubscriptionPaywall />;
    }

    return <>{children}</>;
}
