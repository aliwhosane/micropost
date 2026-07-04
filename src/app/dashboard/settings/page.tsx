import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Wand2 } from "lucide-react";
import { getSubscriptionTier } from "@/lib/subscription";
import { SettingsTabs } from "@/components/settings/SettingsTabs";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.email) return <div>Please log in</div>;

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const activeClientId = cookieStore.get("micropost_active_client_id")?.value;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            preferences: true,
            accounts: !activeClientId ? true : false // Only fetch user accounts if no client active
        },
    });

    if (!user) return <div>User not found</div>;

    let prefs: any;
    let accounts: any[] = [];
    let isClientContext = false;

    if (activeClientId) {
        const client = await prisma.clientProfile.findUnique({
            where: { id: activeClientId },
            include: { accounts: true }
        });

        if (client) {
            const ctx = client as any;
            isClientContext = true;
            prefs = {
                postsPerDay: 1, // field missing on client, default 1
                twitterPostsPerDay: ctx.twitterPostsPerDay,
                linkedinPostsPerDay: ctx.linkedinPostsPerDay,
                threadsPostsPerDay: ctx.threadsPostsPerDay,
                styleSample: ctx.styleSample,
                // Client doesn't have "connected" booleans, we derive from accounts
            };
            accounts = ctx.accounts;
        }
    }

    // Fallback to User/Personal
    if (!isClientContext) {
        prefs = (user.preferences as any) || {
            postsPerDay: 1,
            twitterPostsPerDay: 1,
            linkedinPostsPerDay: 1,
            threadsPostsPerDay: 1,
            styleSample: "",
            linkedinConnected: false,
            twitterConnected: false,
            threadsConnected: false
        };
        accounts = user.accounts;
    }

    // Determine subscription tier for gating the Workspaces tab
    const tier = getSubscriptionTier(user);
    const isAgency = tier === "AGENCY";

    // Fetch client profiles for the workspaces tab
    const initialClients = (await prisma.clientProfile.findMany({
        where: { userId: user.id },
        include: { accounts: true }
    })).map((c: any) => ({
        ...c,
        niche: c.niche || null,
        bio: c.bio || null,
        tone: c.tone || null,
        avatarUrl: c.avatarUrl || null,
        accounts: c.accounts || []
    }));

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-8">
            {/* Page Header */}
            <div className="relative overflow-hidden rounded-3xl bg-surface-container-low border border-outline-variant/20 p-8 sm:p-12">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Wand2 className="w-64 h-64 -translate-y-1/2 translate-x-1/4 rotate-12" />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
                        Settings
                    </h1>
                    <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
                        Customize your AI ghostwriter, manage connected accounts, and control your subscription.
                    </p>
                </div>
            </div>

            {/* Tabbed settings */}
            <SettingsTabs
                styleSample={prefs.styleSample || ""}
                isTwitterConnected={accounts.some((a: any) => a.provider === "twitter")}
                accounts={accounts}
                activeClientId={activeClientId || null}
                twitterPostsPerDay={prefs.twitterPostsPerDay}
                linkedinPostsPerDay={prefs.linkedinPostsPerDay}
                threadsPostsPerDay={prefs.threadsPostsPerDay}
                postsPerDay={prefs.postsPerDay}
                isAgency={isAgency}
                initialClients={initialClients}
                subscriptionStatus={user.subscriptionStatus || null}
                productIdPro={process.env.POLAR_PRODUCT_ID_PRO || ""}
                productIdAgencyMonthly={process.env.POLAR_PRODUCT_ID_AGENCY_MONTHLY || ""}
                productIdAgencyYearly={process.env.POLAR_PRODUCT_ID_AGENCY_YEARLY || ""}
            />
        </div>
    );
}
