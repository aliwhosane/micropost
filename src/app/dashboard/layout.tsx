import { Sidebar } from "@/components/dashboard/Sidebar";
import { PageTitle } from "@/components/dashboard/PageTitle";
import { UserButton } from "@/components/dashboard/UserButton";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";

import { getSubscriptionTier } from "@/lib/subscription";
import { ClientProvider } from "@/components/dashboard/ClientSwitcher";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { KeyboardShortcuts } from "@/components/dashboard/KeyboardShortcuts";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session?.user) redirect("/auth");

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
                    <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 bg-transparent sticky top-0 z-50">
                        <div className="flex items-center gap-4">
                            {/* Mobile Sidebar Trigger could go here */}
                            <PageTitle />
                        </div>

                        <div className="flex items-center gap-4">
                            <UserButton user={session?.user} />
                        </div>
                    </header>
                    <main className="flex-1 p-6 pb-20 md:pb-6 overflow-auto flex flex-col">
                        {children}
                    </main>
                </div>
            </div>
            <MobileNav />
            <KeyboardShortcuts />
        </ClientProvider>
    );
}
