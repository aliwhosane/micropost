import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/analytics/StatCard";
import { ActivityChart } from "@/components/analytics/ActivityChart";
import { BarChart3, TrendingUp, Share2, Layers } from "lucide-react";
import { getSubscriptionTier } from "@/lib/subscription";
import { PremiumGate } from "@/components/dashboard/PremiumGate";

export default async function AnalyticsPage() {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) return redirect("/login");

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { subscriptionStatus: true, subscriptionPlanId: true }
    });

    const tier = getSubscriptionTier(user || {});

    if (tier === "STARTER") {
        return (
            <div className="space-y-8 p-8 max-w-7xl mx-auto relative min-h-screen">
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                    <PremiumGate
                        title="Unlock Analytics"
                        description="Track your growth, engagement, and consistency with Pro Analytics."
                        features={["Engagement Trends", "Consistency Score", "Platform Breakdown", "Growth Tracking"]}
                        requiredTier="PRO"
                    />
                </div>
                {/* Blurred Preview Background */}
                <div className="space-y-8 filter blur-md pointer-events-none opacity-50 select-none">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-on-surface">Analytics</h1>
                        <p className="text-on-surface-variant">Track your content performance and growth.</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Total Posts" value={128} trend="+12%" trendType="up" icon={<Layers className="w-6 h-6" />} />
                        <StatCard label="Published" value={42} trend="+5%" trendType="up" icon={<Share2 className="w-6 h-6" />} />
                        <StatCard label="Est. Reach" value="12.5k" trend="+8%" trendType="up" icon={<TrendingUp className="w-6 h-6" />} />
                        <StatCard label="Consistency" value={85} trend="Good" trendType="up" icon={<BarChart3 className="w-6 h-6" />} />
                    </div>
                </div>
            </div>
        );
    }

    // Fetch metrics
    const totalPosts = await prisma.post.count({
        where: { userId }
    });

    const publishedPosts = await prisma.post.count({
        where: { userId, status: "PUBLISHED" }
    });

    const twitterPosts = await prisma.post.count({
        where: { userId, platform: "TWITTER" }
    });

    const linkedinPosts = await prisma.post.count({
        where: { userId, platform: "LINKEDIN" }
    });

    const threadsPosts = await prisma.post.count({
        where: { userId, platform: "THREADS" }
    });

    // Mock Engagement Data (for now, as we don't have real engagement storage yet)
    // In Phase 2 we would fetch this from an 'Analytics' table or external API
    const estimatedViews = publishedPosts * 142; // arbitrary multiplier for demo

    // Consistency Score Calculation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const postsLast30Days = await prisma.post.findMany({
        where: {
            userId,
            createdAt: { gte: thirtyDaysAgo }
        },
        select: { createdAt: true }
    });

    // Count unique days with at least one post
    const activeDays = new Set(postsLast30Days.map(post => post.createdAt.toISOString().split('T')[0])).size;

    // Score Formula: (Active Days / 30) * 100
    // But let's be generous: 15 days active = 100% consistent (every other day strategy)
    // Adjusted: (Active Days / 15) * 100, capped at 100
    const rawScore = (activeDays / 15) * 100;
    const consistencyScore = Math.min(Math.round(rawScore), 100);

    // Trend calculation (compare to previous 30 days - mocked for now or simple "Keep it up")
    const consistencyTrend = consistencyScore >= 80 ? "Excellent" : consistencyScore >= 50 ? "Good" : "Needs Work";
    const consistencyTrendType = consistencyScore >= 50 ? "up" : "neutral";

    // Chart Data (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // The instruction provided `recentActivity` but then used `postsLast30Days` to filter.
    // To be faithful to the instruction, we will use `postsLast30Days` for the chart data.
    // If `postsLast30Days` is not available, `recentActivity` would be a good alternative.
    // For now, `postsLast30Days` is available and covers the last 7 days.

    // Fill in missing days for the chart
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dateKey = d.toISOString().split('T')[0];

        // Find count for this day (prisma groupBy might return dates with time, so we need to match broadly or normalize above)
        // Since we are grouping by createdAt which is a DateTime, groupBy is granular. 
        // Better approach for chart: Use the fetched postsLast30Days and filter in JS to avoid complex groupBY Date hacking in Prisma/SQLite
        const count = postsLast30Days.filter(p => p.createdAt.toISOString().split('T')[0] === dateKey).length;

        chartData.push({ label: dayStr, value: count });
    }

    // Trend Calculation Helpers
    const calculateTrend = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? "+100%" : "0%";
        const change = ((current - previous) / previous) * 100;
        return `${change > 0 ? "+" : ""}${Math.round(change)}%`;
    };

    const getTrendType = (current: number, previous: number): "up" | "down" | "neutral" => {
        if (current === previous) return "neutral";
        return current > previous ? "up" : "down";
    }

    const previous30Days = new Date();
    previous30Days.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch previous period stats
    const postsPreviousPeriod = await prisma.post.count({
        where: {
            userId,
            createdAt: {
                gte: previous30Days,
                lt: thirtyDaysAgo
            }
        }
    });

    const publishedPreviousPeriod = await prisma.post.count({
        where: {
            userId,
            status: "PUBLISHED",
            createdAt: {
                gte: previous30Days,
                lt: thirtyDaysAgo
            }
        }
    });

    // Current Period Stats (Last 30 Days) - we need to fetch these specifically for "Trend" 
    // (Total Posts is lifetime, but trend is usually "vs last 30 days" or similar. 
    // Let's make the "Trend" be "Last 30 Days vs Previous 30 Days" even if the big number is lifetime total?
    // Actually, usually specific period stats have period trends. Lifetime stats have... growth rate?
    // Let's stick to "Last 30 Days" gain for the trend indicator.

    // Re-fetch current *period* counts for accurate trend comparison
    const postsCurrentPeriod = await prisma.post.count({
        where: {
            userId,
            createdAt: { gte: thirtyDaysAgo }
        }
    });

    const publishedCurrentPeriod = await prisma.post.count({
        where: {
            userId,
            status: "PUBLISHED",
            createdAt: { gte: thirtyDaysAgo }
        }
    });

    const totalPostsTrend = calculateTrend(postsCurrentPeriod, postsPreviousPeriod);
    const totalPostsTrendType = getTrendType(postsCurrentPeriod, postsPreviousPeriod);

    const publishedTrend = calculateTrend(publishedCurrentPeriod, publishedPreviousPeriod);
    const publishedTrendType = getTrendType(publishedCurrentPeriod, publishedPreviousPeriod);

    // Reach Trend (Mock based on published count for now)
    // In real app, we'd sum 'views' column
    const reachCurrent = publishedCurrentPeriod * 150;
    const reachPrevious = publishedPreviousPeriod * 150;
    const reachTrend = calculateTrend(reachCurrent, reachPrevious);
    const reachTrendType = getTrendType(reachCurrent, reachPrevious);


    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-on-surface">Analytics</h1>
                <p className="text-on-surface-variant">Track your content performance and growth.</p>
            </div>

            {/* Key Metrics Row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Posts"
                    value={totalPosts}
                    trend={totalPostsTrend}
                    trendType={totalPostsTrendType}
                    icon={<Layers className="w-6 h-6" />}
                />
                <StatCard
                    label="Published"
                    value={publishedPosts}
                    trend={publishedTrend}
                    trendType={publishedTrendType}
                    icon={<Share2 className="w-6 h-6" />}
                />
                <StatCard
                    label="Est. Reach"
                    value={estimatedViews.toLocaleString()}
                    trend={reachTrend}
                    trendType={reachTrendType}
                    icon={<TrendingUp className="w-6 h-6" />}
                />
                <StatCard
                    label="Consistency Score"
                    value={consistencyScore}
                    trend={consistencyTrend}
                    trendType={consistencyTrendType}
                    icon={<BarChart3 className="w-6 h-6" />}
                />
            </div>

            {/* Charts & Platform Breakdown */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Activity Chart */}
                <div className="md:col-span-2 bg-surface border border-outline-variant/10 rounded-[2rem] p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-on-surface">Posting Activity</h3>
                            <p className="text-sm text-on-surface-variant">Your content output over the last 7 days.</p>
                        </div>
                    </div>
                    <ActivityChart data={chartData} />
                </div>

                {/* Platform Distribution */}
                <div className="bg-surface border border-outline-variant/10 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold text-on-surface">Platform Split</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-on-surface-variant">Twitter / X</span>
                                <span className="text-on-surface">{twitterPosts}</span>
                            </div>
                            <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                                <div className="h-full bg-[#1DA1F2]" style={{ width: `${(twitterPosts / totalPosts || 0) * 100}%` }} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-on-surface-variant">LinkedIn</span>
                                <span className="text-on-surface">{linkedinPosts}</span>
                            </div>
                            <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                                <div className="h-full bg-[#0077b5]" style={{ width: `${(linkedinPosts / totalPosts || 0) * 100}%` }} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-on-surface-variant">Threads</span>
                                <span className="text-on-surface">{threadsPosts}</span>
                            </div>
                            <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                                <div className="h-full bg-black dark:bg-white" style={{ width: `${(threadsPosts / totalPosts || 0) * 100}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
