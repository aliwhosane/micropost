"use client";

import React, { useState, useEffect } from "react";
import { TrendCard } from "@/components/dashboard/TrendSurfer/TrendCard";
import { Flame, RefreshCw, Loader2, PenTool } from "lucide-react";
import { fetchTrendsAction, generateTrendPostAction, getUserTopicsAction } from "@/app/actions/trends";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

export default function TrendsPage() {
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState<string[]>([]);
    const [activeTopic, setActiveTopic] = useState<string | null>(null);
    const [trends, setTrends] = useState<any[]>([]);

    // Draft Modal State
    const [isDraftOpen, setIsDraftOpen] = useState(false);
    const [selectedTrend, setSelectedTrend] = useState<any>(null);
    const [draftPlatform, setDraftPlatform] = useState<"LINKEDIN" | "TWITTER" | "THREADS">("TWITTER");
    const [draftInstructions, setDraftInstructions] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        // Load initial topics
        getUserTopicsAction().then(userTopics => {
            if (userTopics.length > 0) {
                setTopics(userTopics);
                setActiveTopic(userTopics[0]);
            } else {
                setTopics(["Tech", "Business"]); // Defaults
                setActiveTopic("Tech");
            }
        });
    }, []);

    useEffect(() => {
        if (activeTopic) {
            handleRefresh(activeTopic);
        }
    }, [activeTopic]);

    const handleRefresh = async (topic: string) => {
        setLoading(true);
        try {
            const data = await fetchTrendsAction(topic);
            setTrends(data);
        } catch (error) {
            console.error("Failed to fetch trends", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDraft = (trend: any) => {
        setSelectedTrend(trend);
        setIsDraftOpen(true);
    };

    const handleGenerateDraft = async () => {
        if (!selectedTrend) return;
        setIsGenerating(true);
        try {
            await generateTrendPostAction(draftPlatform, {
                title: selectedTrend.title,
                summary: selectedTrend.summary || selectedTrend.contentSnippet,
                link: selectedTrend.link
            }, draftInstructions);

            // Close and notify
            setIsDraftOpen(false);
            setDraftInstructions("");
            // Ideally trigger a toast or navigate to drafts
            window.location.href = "/dashboard/posts"; // Redirect to posts to review pending draft
        } catch (error) {
            console.error("Failed to generate draft", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Flame className="text-orange-500 fill-orange-500" />
                        TrendSurfer
                    </h1>
                    <p className="text-zinc-400">
                        Catch viral waves before they break. Real-time newsjacking for your niche.
                    </p>
                </div>

                <button
                    onClick={() => activeTopic && handleRefresh(activeTopic)}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                    Refresh Trends
                </button>
            </div>

            {/* Topic Filter */}
            <div className="mb-8 flex flex-wrap gap-2">
                {topics.map((topic) => (
                    <button
                        key={topic}
                        onClick={() => setActiveTopic(topic)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${activeTopic === topic
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                            : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        {topic}
                    </button>
                ))}
            </div>

            {/* Trends Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-zinc-500" size={32} />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {trends.map((trend, idx) => (
                        <TrendCard
                            key={trend.guid || idx} // fallback key
                            title={trend.title}
                            source={trend.source || "News"}
                            publishedAt={trend.pubDate}
                            viralScore={trend.viralScore}
                            summary={trend.aiSummary || trend.contentSnippet}
                            onDraft={() => handleOpenDraft(trend)}
                        />
                    ))}
                    {trends.length === 0 && !loading && (
                        <div className="col-span-full py-10 text-center text-zinc-500">
                            No trends found. Try refreshing or selecting a different topic.
                        </div>
                    )}
                </div>
            )}

            {/* Draft Logic Modal */}
            <Dialog open={isDraftOpen} onOpenChange={setIsDraftOpen}>
                <DialogContent className="sm:max-w-md bg-zinc-900 border border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Draft Trend Post</DialogTitle>
                    </DialogHeader>

                    {selectedTrend && (
                        <div className="space-y-4 py-4">
                            <div className="rounded-lg bg-white/5 p-3 text-sm text-zinc-300">
                                <span className="font-semibold text-white">Target Story:</span> {selectedTrend.title}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-200">Platform</label>
                                <div className="flex gap-2">
                                    {(["TWITTER", "LINKEDIN", "THREADS"] as const).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setDraftPlatform(p)}
                                            className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-all ${draftPlatform === p
                                                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                                                : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10"
                                                }`}
                                        >
                                            {p.charAt(0) + p.slice(1).toLowerCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-200">Special Instructions (Optional)</label>
                                <Textarea
                                    placeholder="E.g., Connect this to my startup's mission..."
                                    value={draftInstructions}
                                    onChange={(e) => setDraftInstructions(e.target.value)}
                                    className="bg-black/20 border-white/10 resize-none h-24"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="text" onClick={() => setIsDraftOpen(false)} className="text-zinc-400 hover:text-white">Cancel</Button>
                        <Button onClick={handleGenerateDraft} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-500 text-white">
                            {isGenerating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <PenTool className="mr-2 h-4 w-4" />}
                            {isGenerating ? "Drafting..." : "Generate Draft"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
