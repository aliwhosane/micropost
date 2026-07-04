import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getPendingPosts, getActiveTopics, getDashboardStats } from "@/lib/dashboard-data";
import { MagicComposer } from "@/components/dashboard/MagicComposer";
import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";
import { TodayDrafts } from "@/components/dashboard/TodayDrafts";
import { PowerToolsSection } from "@/components/dashboard/PowerToolsSection";
import { Greeting } from "@/components/dashboard/Greeting";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.email) return <div>Please log in</div>;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            id: true,
            preferences: true,
            accounts: {
                select: { provider: true } // Minimal fetch
            }
        }
    });

    if (!user) return <div>User not found</div>;

    // Check onboarding status
    const isOnboardingComplete = (user.preferences as any)?.onboardingCompleted ?? false;

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const activeClientId = cookieStore.get("micropost_active_client_id")?.value;

    const activeClientIdStr = activeClientId || null;

    const [pendingPosts, activeTopics, stats] = await Promise.all([
        getPendingPosts(user.id, activeClientIdStr),
        getActiveTopics(user.id, activeClientIdStr),
        getDashboardStats(user.id, activeClientIdStr)
    ]);

    const topicNames = (activeTopics as any[]).map((t: any) => t.name);

    const { totalPostsCount } = stats;

    const isEmptyState = totalPostsCount === 0 && pendingPosts.length === 0;

    const initialConnected = {
        twitter: user.accounts.some((a) => a.provider === "twitter"),
        linkedin: user.accounts.some((a) => a.provider === "linkedin"),
        threads: user.accounts.some((a) => a.provider === "threads"),
    };

    const firstName = session.user.name?.split(" ")[0] || "there";

    // Serialize dates for client components
    const serializedPosts = pendingPosts.map((post: any) => ({
        id: post.id,
        content: post.content,
        platform: post.platform || "TWITTER",
        topic: post.topic || "General",
        createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : String(post.createdAt),
        status: post.status,
        scheduledFor: post.scheduledFor
            ? (post.scheduledFor instanceof Date ? post.scheduledFor.toISOString() : String(post.scheduledFor))
            : null,
        imageUrl: post.imageUrl || null,
    }));

    return (
        <div className="space-y-8 relative flex-1 h-full min-h-[calc(100vh-160px)]">
            {!isOnboardingComplete && <OnboardingWizard initialConnected={initialConnected} />}

            {/* Greeting */}
            <Greeting firstName={firstName} pendingCount={pendingPosts.length} />

            {/* If empty state, center the composer. Else, put it at top. */}
            {isEmptyState ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-full">
                        <MagicComposer isHero={true} topics={topicNames} />
                    </div>
                </div>
            ) : (
                <MagicComposer topics={topicNames} />
            )}

            {/* Today's Drafts */}
            {!isEmptyState && <TodayDrafts posts={serializedPosts} />}

            {/* Power Tools */}
            <PowerToolsSection />
        </div>
    );
}
