import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Sparkles, PenTool } from "lucide-react";
import { TopicCard } from "@/components/dashboard/TopicCard";
import { AddTopicForm } from "@/components/dashboard/AddTopicForm";
import { revalidatePath } from "next/cache";

export default async function TopicsPage() {
    const session = await auth();
    if (!session?.user?.email) return <div>Please log in</div>;

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const activeClientId = cookieStore.get("micropost_active_client_id")?.value;
    console.log("Topics Page Debug:", { activeClientId });

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            topics: {
                where: {
                    clientProfileId: activeClientId || null
                },
                orderBy: { createdAt: 'desc' }
            }
        },
    });

    if (!user) return <div>User not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-on-surface">Content Topics</h1>
                <p className="text-on-surface-variant mt-2">Manage the subjects you want your AI ghostwriter to focus on.</p>
            </div>

            <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Sparkles className="h-5 w-5" />
                        Add New Topic
                    </CardTitle>
                    <CardDescription text-class="text-on-surface-variant/80">
                        What subject should your AI ghostwriter focus on next?
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AddTopicForm />
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {(user as any).topics.map((topic: any) => (
                    <TopicCard key={topic.id} topic={topic} />
                ))}

                {(user as any).topics.length === 0 && (
                    <div className="col-span-2 text-center py-12 text-on-surface-variant border-2 border-dashed border-outline-variant rounded-xl">
                        <PenTool className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No topics added yet. Add your first topic to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
