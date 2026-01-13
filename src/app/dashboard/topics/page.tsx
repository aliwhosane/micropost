import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { addTopic, deleteTopic, toggleTopic } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Trash2, Plus, PenTool, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function TopicsPage() {
    const session = await auth();
    if (!session?.user?.email) return <div>Please log in</div>;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { topics: true },
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
                    <form action={addTopic} className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <Input
                                name="topic"
                                placeholder="e.g. 'React Server Components', 'SaaS Marketing', 'Personal Finance'"
                                className="bg-surface border-outline-variant focus:border-primary h-11"
                                required
                            />
                        </div>
                        <Button type="submit" variant="filled" className="h-11 px-6 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
                            <Plus className="mr-2 h-4 w-4" /> Create Topic
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {user.topics.map((topic: any) => (
                    <Card key={topic.id} className="relative overflow-hidden group">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-secondary-container flex items-center justify-center">
                                    <PenTool className="h-5 w-5 text-on-secondary-container" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-on-surface">{topic.name}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${topic.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                        {topic.enabled ? "Active" : "Paused"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <form action={async () => {
                                    "use server";
                                    await toggleTopic(topic.id, topic.enabled);
                                }}>
                                    <Button size="icon" variant="text" title={topic.enabled ? "Disable" : "Enable"}>
                                        {topic.enabled ? <XCircle className="h-5 w-5 text-on-surface-variant" /> : <CheckCircle2 className="h-5 w-5 text-primary" />}
                                    </Button>
                                </form>

                                <form action={async () => {
                                    "use server";
                                    await deleteTopic(topic.id);
                                }}>
                                    <Button size="icon" variant="text" title="Delete" className="text-error hover:bg-error/10">
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                        {/* Decorative background element */}
                        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Card>
                ))}

                {user.topics.length === 0 && (
                    <div className="col-span-2 text-center py-12 text-on-surface-variant border-2 border-dashed border-outline-variant rounded-xl">
                        <PenTool className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No topics added yet. Add your first topic to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
