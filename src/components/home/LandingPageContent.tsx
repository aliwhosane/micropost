"use client";

import { HeroSection } from "@/components/landing/HeroSection";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ToolsSection } from "@/components/landing/ToolsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { CTASection } from "@/components/landing/CTASection";

interface LandingPageContentProps {
    productIds: {
        pro: string;
        agencyMonthly: string;
        agencyYearly: string;
    }
}

export function LandingPageContent({ productIds }: LandingPageContentProps) {
    return (
        <main className="flex-1 overflow-x-hidden">
            <HeroSection />
            <ComparisonSection />
            <FeaturesSection />
            <ToolsSection />
            <PricingSection productIds={productIds} />
            <CTASection />
        </main>
    );
}

