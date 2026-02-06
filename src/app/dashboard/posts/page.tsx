import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { PostCard } from "@/components/dashboard/PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Sparkles, Archive, AlertCircle, CheckCircle2 } from "lucide-react";

export default async function PostsPage() {
    const session = await auth();
    if (!session?.user?.email) return <div>Please log in</div>;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            posts: {
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!user) return <div>User not found</div>;

    const posts = (user.posts || []).filter((p: any) => p.status !== "REJECTED");
    const pendingPosts = posts.filter((p: any) => p.status === "PENDING" || p.status === "DRAFT");
    const publishedPosts = posts.filter((p: any) => p.status === "PUBLISHED");
    const approvedPosts = posts.filter((p: any) => p.status === "APPROVED"); // Ready to publish but maybe failed or just approved
    const failedPosts = posts.filter((p: any) => p.status === "FAILED");
    const twitterPosts = posts.filter((p: any) => p.platform === "TWITTER");
    const linkedinPosts = posts.filter((p: any) => p.platform === "LINKEDIN");
    const threadsPosts = posts.filter((p: any) => p.platform === "THREADS");

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-on-surface">Content History</h2>
                <p className="text-on-surface-variant">Manage your generated posts and history.</p>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="all">All Platforms</TabsTrigger>
                    <TabsTrigger value="twitter" className="flex items-center gap-2">
                        <span className="text-[#1DA1F2]">𝕏</span> Twitter
                    </TabsTrigger>
                    <TabsTrigger value="linkedin" className="flex items-center gap-2">
                        <span className="text-[#0077b5]">in</span> LinkedIn
                    </TabsTrigger>
                    <TabsTrigger value="threads" className="flex items-center gap-2">
                        <span className="text-black dark:text-white">To</span> Threads
                    </TabsTrigger>
                </TabsList>

                {/* ALL PLATFORMS VIEW */}
                <TabsContent value="all" className="space-y-4">
                    <Tabs defaultValue="pending">
                        <TabsList>
                            <TabsTrigger value="all_status">All Statuses</TabsTrigger>
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="published">Published</TabsTrigger>
                            <TabsTrigger value="failed">Failed</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all_status" className="mt-4">
                            <div className="space-y-4">
                                {posts.map((post: any) => (
                                    <PostCard key={post.id} {...post} platform={post.platform || "TWITTER"} topic={post.topic || "General"} />
                                ))}
                                {posts.length === 0 && <p className="text-center py-8 text-on-surface-variant">No posts found.</p>}
                            </div>
                        </TabsContent>
                        <TabsContent value="pending" className="mt-4">
                            <div className="space-y-4">
                                {pendingPosts.map((post: any) => (
                                    <PostCard key={post.id} {...post} platform={post.platform || "TWITTER"} topic={post.topic || "General"} />
                                ))}
                                {pendingPosts.length === 0 && <p className="text-center py-8 text-on-surface-variant">No pending posts.</p>}
                            </div>
                        </TabsContent>
                        <TabsContent value="published" className="mt-4">
                            <div className="space-y-4">
                                {publishedPosts.map((post: any) => (
                                    <PostCard key={post.id} {...post} platform={post.platform || "TWITTER"} topic={post.topic || "General"} />
                                ))}
                                {publishedPosts.length === 0 && <p className="text-center py-8 text-on-surface-variant">No published posts.</p>}
                            </div>
                        </TabsContent>
                        <TabsContent value="failed" className="mt-4">
                            <div className="space-y-4">
                                {failedPosts.map((post: any) => (
                                    <PostCard key={post.id} {...post} platform={post.platform || "TWITTER"} topic={post.topic || "General"} />
                                ))}
                                {failedPosts.length === 0 && <p className="text-center py-8 text-on-surface-variant">No failed posts.</p>}
                            </div>
                        </TabsContent>
                    </Tabs>
                </TabsContent>

                {/* TWITTER VIEW */}
                <TabsContent value="twitter" className="space-y-4">
                    <Tabs defaultValue="pending">
                        <TabsList>
                            <TabsTrigger value="all_status">All Twitter</TabsTrigger>
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="published">Published</TabsTrigger>
                            <TabsTrigger value="failed">Failed</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all_status" className="mt-4">
                            <div className="space-y-4">
                                {twitterPosts.map((post: any) => (
                                    <PostCard key={post.id} {...post} platform="TWITTER" topic={post.topic || "General"} />
                                ))}
                                {twitterPosts.length === 0 && <p className="text-center py-8 text-on-surface-variant">No Twitter posts found.</p>}
                            </div>
                        </TabsContent>
                        <TabsContent value="pending" className="mt-4">
                            <div className="space-y-4">
                                {twitterPosts.filter((p: any) => p.status === "PENDING" || p.status === "DRAFT").map((post: any) => (
                                    <PostCard key={post.id} {...post} platform="TWITTER" topic={post.topic || "General"} />
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="published" className="mt-4">
                            <div className="space-y-4">
                                {twitterPosts.filter((p: any) => p.status === "PUBLISHED").map((post: any) => (
                                    <PostCard key={post.id} {...post} platform="TWITTER" topic={post.topic || "General"} />
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="failed" className="mt-4">
                            <div className="space-y-4">
                                {twitterPosts.filter((p: any) => p.status === "FAILED").map((post: any) => (
                                    <PostCard key={post.id} {...post} platform="TWITTER" topic={post.topic || "General"} />
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </TabsContent>

                {/* LINKEDIN VIEW */}
                <TabsContent value="linkedin" className="space-y-4">
                    <Tabs defaultValue="pending">
                        <TabsList>
                            <TabsTrigger value="all_status">All LinkedIn</TabsTrigger>
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="published">Published</TabsTrigger>
                            <TabsTrigger value="failed">Failed</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all_status" className="mt-4">
                            <div className="space-y-4">
                                {linkedinPosts.map((post: any) => (
                                    <PostCard key={post.id} {...post} platform="LINKEDIN" topic={post.topic || "General"} />
                                ))}
                                {linkedinPosts.length === 0 && <p className="text-center py-8 text-on-surface-variant">No LinkedIn posts found.</p>}
                            </div>
                        </TabsContent>
                        <TabsContent value="pending" className="mt-4">
                            <div className="space-y-4">
                                {linkedinPosts.filter((p: any) => p.status === "PENDING" || p.status === "DRAFT").map((post: any) => (
                                    <PostCard key={post.id} {...post} platform="LINKEDIN" topic={post.topic || "General"} />
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="published" className="mt-4">
                            <div className="space-y-4">
                                {linkedinPosts.filter((p: any) => p.status === "PUBLISHED").map((post: any) => (
                                    <PostCard key={post.id} {...post} platform="LINKEDIN" topic={post.topic || "General"} />
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="failed" className="mt-4">
                            <div className="space-y-4">
                                {linkedinPosts.filter((p: any) => p.status === "FAILED").map((post: any) => (
                                    <PostCard key={post.id} {...post} platform="LINKEDIN" topic={post.topic || "General"} />
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </TabsContent>

                {/* THREADS VIEW */}
                <TabsContent value="threads" className="space-y-4">
                    <Tabs defaultValue="pending">
                        <TabsList>
                            <TabsTrigger value="all_status">All Threads</TabsTrigger>
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="published">Published</TabsTrigger>
                            <TabsTrigger value="failed">Failed</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all_status" className="mt-4">
                            <div className="space-y-4">
                                {threadsPosts.map((post: any) => (
                                    <PostCard key={post.id} {...post} platform="THREADS" topic={post.topic || "General"} />
                                ))}
                                {threadsPosts.length === 0 && <p className="text-center py-8 text-on-surface-variant">No Threads posts found.</p>}
                            </div>
                        </TabsContent>
                        <TabsContent value="pending" className="mt-4">
                            <div className="space-y-4">
                                {threadsPosts.filter((p: any) => p.status === "PENDING" || p.status === "DRAFT").map((post: any) => (
                                    <PostCard key={post.id} {...post} platform="THREADS" topic={post.topic || "General"} />
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="published" className="mt-4">
                            <div className="space-y-4">
                                {threadsPosts.filter((p: any) => p.status === "PUBLISHED").map((post: any) => (
                                    <PostCard key={post.id} {...post} platform="THREADS" topic={post.topic || "General"} />
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="failed" className="mt-4">
                            <div className="space-y-4">
                                {threadsPosts.filter((p: any) => p.status === "FAILED").map((post: any) => (
                                    <PostCard key={post.id} {...post} platform="THREADS" topic={post.topic || "General"} />
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </TabsContent>
            </Tabs>
        </div>
    );
}
