import { Sidebar } from "@/components/dashboard/Sidebar";
import { UserButton } from "@/components/dashboard/UserButton";
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

    const isSubscribed = user?.subscriptionStatus === "active";

    return (
        <div className="min-h-screen flex bg-background">
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 border-b border-outline-variant/20 flex items-center justify-between px-6 bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
                    <h1 className="text-xl font-semibold text-on-surface">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <UserButton user={session?.user} />
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    <FeatureGuard isSubscribed={isSubscribed}>
                        {children}
                    </FeatureGuard>
                </main>
            </div>
        </div>
    );
}
