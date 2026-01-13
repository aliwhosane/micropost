import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Clock, FileText, Hash, Sparkles } from "lucide-react";
import { PostCard } from "@/components/dashboard/PostCard";
import { triggerManualGeneration } from "@/lib/actions";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.email) return <div>Please log in</div>;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });

    if (!user) return <div>User not found</div>;

    const [pendingPosts, activeTopicsList, totalPostsCount, publishedPostsCount, activeTopicsCount] = await Promise.all([
        prisma.post.findMany({
            where: { userId: user.id, status: "PENDING" },
            orderBy: { createdAt: "desc" },
        }),
        prisma.topic.findMany({
            where: { userId: user.id, enabled: true },
            take: 5
        }),
        prisma.post.count({ where: { userId: user.id } }),
        prisma.post.count({ where: { userId: user.id, status: "PUBLISHED" } }),
        prisma.topic.count({ where: { userId: user.id, enabled: true } })
    ]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-on-surface">Overview</h2>
                <form action={triggerManualGeneration}>
                    <Button variant="tonal" type="submit">
                        Simulate Generation <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                </form>
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
                                : "No pending drafts. Generate some content!"}
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
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Hash className="h-5 w-5 text-tertiary" />
                                <span>Active Topics</span>
                            </CardTitle>
                            <CardDescription>Topics currently driving your content generation.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {activeTopicsList.map((topic: any) => (
                                    <div key={topic.id} className="group flex items-center justify-between p-3 rounded-xl bg-surface-variant/30 border border-transparent hover:border-outline-variant hover:bg-surface-variant/50 transition-all cursor-default">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                                                <Hash className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium text-on-surface group-hover:text-primary transition-colors">{topic.name}</span>
                                        </div>
                                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                                    </div>
                                ))}
                                {activeTopicsList.length === 0 && (
                                    <div className="text-center py-8 px-4 rounded-xl border border-dashed border-outline-variant/50">
                                        <p className="text-sm text-on-surface-variant">No active topics found.</p>
                                        <Button variant="text" className="mt-2 text-primary h-auto p-0" >
                                            Create your first topic &rarr;
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-on-surface-variant">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-on-surface-variant" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-on-surface">{value}</div>
                <p className="text-xs text-on-surface-variant mt-1">
                    <span className="text-primary font-medium">{trend}</span>
                </p>
            </CardContent>
        </Card>
    );
}
