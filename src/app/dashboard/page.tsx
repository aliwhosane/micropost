import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, Clock, Star, Users, Sparkles } from "lucide-react";
import { PostCard } from "@/components/dashboard/PostCard";
import { triggerManualGeneration } from "@/lib/actions";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.email) return <div>Please log in</div>;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            posts: {
                where: { status: "PENDING" },
                orderBy: { createdAt: "desc" },
            },
            topics: {
                where: { enabled: true },
                take: 5
            }
        },
    });

    if (!user) return <div>User not found</div>;

    const pendingPosts = user.posts || [];
    const activeTopics = user.topics || [];

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
                <StatCard title="Total Posts" value="0" icon={Star} trend="No history" />
                <StatCard title="Pending Review" value={pendingPosts.length.toString()} icon={Clock} trend="Needs attention" />
                <StatCard title="Engagement" value="0" icon={Users} trend="-- this week" />
                <StatCard title="Followers" value="0" icon={ArrowUpRight} trend="Not connected" />
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
                        <div className="space-y-4">
                            {pendingPosts.map((post: any) => (
                                <PostCard
                                    key={post.id}
                                    id={post.id}
                                    content={post.content}
                                    platform={post.platform || "TWITTER"}
                                    topic={post.topic || "General"}
                                    createdAt={post.createdAt}
                                    status={post.status}
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
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Active Topics</CardTitle>
                        <CardDescription>Currently being used for generation.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {activeTopics.map((topic: any) => (
                                <div key={topic.id} className="flex items-center p-3 rounded-lg hover:bg-surface-variant/20 transition-colors">
                                    <div className="h-2 w-2 rounded-full bg-tertiary mr-3" />
                                    <span className="text-on-surface">{topic.name}</span>
                                </div>
                            ))}
                            {activeTopics.length === 0 && (
                                <p className="text-sm text-on-surface-variant">No active topics. Go to "Topics" to add some.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
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
