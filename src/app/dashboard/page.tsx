import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getPendingPosts, getActiveTopics, getDashboardStats } from "@/lib/dashboard-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Clock, FileText, Hash, Sparkles } from "lucide-react";
import { PostCard } from "@/components/dashboard/PostCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActiveTopicsCard } from "@/components/dashboard/ActiveTopicsCard";
import { MagicComposer } from "@/components/dashboard/MagicComposer";
import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";

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

    const [pendingPosts, activeTopicsList, stats] = await Promise.all([
        getPendingPosts(user.id, activeClientIdStr),
        getActiveTopics(user.id, activeClientIdStr),
        getDashboardStats(user.id, activeClientIdStr)
    ]);

    const { totalPostsCount, publishedPostsCount, activeTopicsCount } = stats;

    const isEmptyState = totalPostsCount === 0 && pendingPosts.length === 0;

    const initialConnected = {
        twitter: user.accounts.some((a) => a.provider === "twitter"),
        linkedin: user.accounts.some((a) => a.provider === "linkedin"),
        threads: user.accounts.some((a) => a.provider === "threads"),
    };

    return (
        <div className="space-y-8 relative flex-1 h-full min-h-[calc(100vh-160px)]">
            {!isOnboardingComplete && <OnboardingWizard initialConnected={initialConnected} />}

            {/* If empty state, center the composer. Else, put it at top. */}
            {isEmptyState ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center -mt-20 pointer-events-none">
                    <div className="w-full pointer-events-auto">
                        <MagicComposer isHero={true} />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    <MagicComposer />
                </div>
            )}

            {/* Content Feed */}
            {!isEmptyState && (
                <>
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight text-on-surface">Overview</h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard title="Total Posts" value={totalPostsCount.toString()} icon={FileText} trend="All time" />
                        <StatCard title="Pending Review" value={pendingPosts.length.toString()} icon={Clock} trend="Action needed" />
                        <StatCard title="Published" value={publishedPostsCount.toString()} icon={CheckCircle2} trend="Success" />
                        <StatCard title="Active Topics" value={activeTopicsCount.toString()} icon={Hash} trend="Configuration" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>
                                    {pendingPosts.length > 0
                                        ? `You have ${pendingPosts.length} drafts waiting for approval.`
                                        : "No pending drafts."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {pendingPosts.map((post: any) => (
                                        <PostCard
                                            key={post.id}
                                            id={post.id}
                                            content={post.content}
                                            platform={post.platform || "TWITTER"}
                                            topic={post.topic || "General"}
                                            createdAt={post.createdAt}
                                            status={post.status}
                                            scheduledFor={post.scheduledFor}
                                        />
                                    ))}
                                    {pendingPosts.length === 0 && (
                                        <div className="text-center py-10 text-on-surface-variant">
                                            <Sparkles className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                            <p>All caught up!</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <div className="col-span-3 space-y-4">
                            <ActiveTopicsCard activeTopics={activeTopicsList} />
                        </div>
                    </div>
                </>
            )}


        </div>
    );
}


