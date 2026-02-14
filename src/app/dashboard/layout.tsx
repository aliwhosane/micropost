import { Sidebar } from "@/components/dashboard/Sidebar";
import { UserButton } from "@/components/dashboard/UserButton";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { FeatureGuard } from "@/components/dashboard/FeatureGuard";
import { getSubscriptionTier } from "@/lib/subscription";
import { ClientProvider } from "@/components/dashboard/ClientSwitcher";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    // Optional: Redirect if not authenticated
    // if (!session?.user) redirect("/login");

    const user = session?.user?.email ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            subscriptionStatus: true,
            subscriptionPlanId: true
        }
    }) : null;

    const tier = getSubscriptionTier(user || {});
    const isSubscribed = tier !== "STARTER"; // Backwards compatibility for now

    return (
        <ClientProvider user={session?.user || {}}>
            <div className="min-h-screen flex bg-background">
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                    <header className="h-20 flex items-center justify-between px-8 bg-transparent sticky top-0 z-50">
                        <div className="flex items-center gap-4">
                            {/* Mobile Sidebar Trigger could go here */}
                            <h1 className="text-2xl font-bold text-on-surface tracking-tight">Dashboard</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <UserButton user={session?.user} />
                        </div>
                    </header>
                    <main className="flex-1 p-6 overflow-auto flex flex-col">
                        {children}
                        <OnboardingTour />
                    </main>
                </div>
            </div>
        </ClientProvider>
    );
}
