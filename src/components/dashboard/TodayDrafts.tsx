"use client";

import { useState, useTransition } from "react";
import { PostCard } from "@/components/dashboard/PostCard";
import { batchApproveAction } from "@/app/actions/batch";
import { Button } from "@/components/ui/Button";
import { CheckCheck, PartyPopper } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SerializedPost {
    id: string;
    content: string;
    platform: string;
    topic: string;
    createdAt: string;
    status: string;
    scheduledFor?: string | null;
    imageUrl?: string | null;
}

interface TodayDraftsProps {
    posts: SerializedPost[];
}

export function TodayDrafts({ posts }: TodayDraftsProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [allApproved, setAllApproved] = useState(false);

    function handleBatchApprove() {
        const postIds = posts.map((p) => p.id);
        startTransition(async () => {
            const result = await batchApproveAction(postIds);
            if (result.failed === 0) {
                setAllApproved(true);
                toast.success(`Approved all ${result.succeeded} drafts`);
            } else {
                toast.error(`${result.failed} draft(s) failed to approve`);
            }
            router.refresh();
        });
    }

    if (posts.length === 0 || allApproved) {
        return (
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-on-surface tracking-tight">
                        Today&apos;s Drafts
                    </h2>
                </div>
                <EmptyState
                    icon={PartyPopper}
                    title="All caught up for today!"
                    description="Your AI ghostwriter is crafting tomorrow's content. Take a break — you've earned it."
                    variant="celebration"
                />
            </section>
        );
    }

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-on-surface tracking-tight">
                        Today&apos;s Drafts
                    </h2>
                    <span className="inline-flex items-center justify-center h-6 min-w-[1.5rem] px-2 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {posts.length}
                    </span>
                </div>
                {posts.length >= 3 && (
                    <Button
                        variant="outlined"
                        size="sm"
                        onClick={handleBatchApprove}
                        disabled={isPending}
                        className="gap-1.5"
                    >
                        <CheckCheck className="h-4 w-4" />
                        {isPending ? "Approving…" : "Approve All"}
                    </Button>
                )}
            </div>

            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible md:pb-0 custom-scrollbar">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="min-w-[320px] md:min-w-0 snap-start"
                    >
                        <PostCard
                            id={post.id}
                            content={post.content}
                            platform={post.platform || "TWITTER"}
                            topic={post.topic || "General"}
                            createdAt={new Date(post.createdAt)}
                            status={post.status}
                            scheduledFor={
                                post.scheduledFor
                                    ? new Date(post.scheduledFor)
                                    : null
                            }
                            imageUrl={post.imageUrl}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
