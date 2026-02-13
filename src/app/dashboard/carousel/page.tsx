import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSubscriptionTier } from "@/lib/subscription";
import { PremiumGate } from "@/components/dashboard/PremiumGate";
import { CarouselWizard } from "@/components/carousel/CarouselWizard";
import { prisma } from "@/lib/db";
import { Sparkles } from "lucide-react";

export default async function CarouselPage() {
    const session = await auth();
    if (!session?.user?.email) return redirect("/login");

    // Fetch fresh user data from DB to ensure subscription status is up to date
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { subscriptionStatus: true, subscriptionPlanId: true }
    });

    const tier = getSubscriptionTier(user);
    const isAgency = tier === "AGENCY";

    if (!isAgency) {
        return (
            <div className="max-w-7xl mx-auto h-[600px] flex items-center justify-center">
                <PremiumGate
                    title="Carousel Generator"
                    description="Create viral LinkedIn PDF carousels in seconds."
                    features={[
                        "AI-Powered Content Generation",
                        "Custom Branding & Images",
                        "One-Click PDF Export",
                        "High-Performing Templates"
                    ]}
                    requiredTier="AGENCY"
                >
                    <div className="flex flex-col items-center justify-center gap-4 p-10 opacity-50">
                        <Sparkles className="w-16 h-16" />
                        <h2 className="text-2xl font-bold">Locked Feature</h2>
                    </div>
                </PremiumGate>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">LinkedIn Carousel Generator</h1>
                <p className="text-on-surface-variant mt-2">
                    Turn any idea into a high-converting PDF carousel.
                </p>
            </div>

            <CarouselWizard />
        </div>
    );
}
