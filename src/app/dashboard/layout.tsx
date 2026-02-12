import { Sidebar } from "@/components/dashboard/Sidebar";
import { UserButton } from "@/components/dashboard/UserButton";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { FeatureGuard } from "@/components/dashboard/FeatureGuard";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    // Optional: Redirect if not authenticated
    // if (!session?.user) redirect("/login");

    const user = session?.user?.email ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { subscriptionStatus: true }
    }) : null;

    const isSubscribed = user?.subscriptionStatus === "active" || user?.subscriptionStatus === "trialing";

    return (
        <div className="min-h-screen flex bg-background">
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                <header className="h-20 flex items-center justify-between px-8 bg-transparent sticky top-0 z-10">
                    <h1 className="text-2xl font-bold text-on-surface tracking-tight">Dashboard</h1>
                    <div className="flex items-center gap-4 bg-surface/50 backdrop-blur-md p-2 pl-4 pr-2 rounded-full border border-outline-variant/10 shadow-sm">
                        <span className="text-sm font-medium text-on-surface-variant mr-2 hidden sm:block">Welcome back</span>
                        <UserButton user={session?.user} />
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    <FeatureGuard isSubscribed={isSubscribed}>
                        {children}
                    </FeatureGuard>
                    <OnboardingTour />
                </main>
            </div>
        </div>
    );
}
