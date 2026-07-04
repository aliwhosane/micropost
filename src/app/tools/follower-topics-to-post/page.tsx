"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Users, Loader2, Copy, Check, Sparkles, Twitter } from "lucide-react";

export default function FollowerTopicsGenerator() {
    const [platform] = useState("TWITTER");
    const [results, setResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError("");
        setResults(null);

        try {
            const res = await fetch("/api/tools/follower-topics-to-post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ platform }),
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            setResults(data);
        } catch (error: any) {
            console.error("Analysis failed", error);
            setError(error.message || "Failed to analyze follower topics. Please make sure your Twitter account is connected.");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container mx-auto py-12 px-6 max-w-5xl">
            <Link href="/tools" className="inline-flex items-center text-sm text-on-surface-variant hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tools
            </Link>

            <div className="space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                        <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-on-surface">Follower Topics to Post</h1>
                    <p className="text-xl text-on-surface-variant">
                        Analyze what the people you follow are talking about right now, and generate a post to join the conversation.
                    </p>
                </div>

                {/* Action Section */}
                <div className="max-w-2xl mx-auto bg-surface p-8 rounded-3xl border border-outline-variant/30 shadow-sm text-center">
                    <p className="text-on-surface-variant mb-6">
                        This tool fetches the latest posts from your Twitter/X timeline (the people you follow), analyzes the trending topics, and drafts a relevant, high-quality post.
                    </p>
                    <Button
                        size="lg"
                        className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-xl"
                        onClick={handleAnalyze}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin h-5 w-5" />
                                Analyzing Timeline...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Analyze & Generate
                            </div>
                        )}
                    </Button>
                </div>

                {error && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-center text-error font-medium max-w-2xl mx-auto">
                        {error}
                    </div>
                )}

                {/* Results Section */}
                {results && (
                    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
                        {/* Topics */}
                        <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
                            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-500" />
                                Top Trending Topics Detected
                            </h3>
                            <ul className="space-y-3">
                                {results.topics?.map((topic: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-on-surface">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
                                            {i + 1}
                                        </span>
                                        <span className="leading-relaxed">{topic}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-xs text-on-surface-variant mt-4 opacity-70">
                                Analyzed {results.sourceCount || "many"} recent posts from your timeline.
                            </p>
                        </div>

                        {/* Generated Post */}
                        <div className="bg-surface p-6 rounded-2xl border border-primary/20 shadow-md relative group">
                            <div className="absolute -top-3 left-6 text-xs font-bold text-primary bg-background px-3 py-1 rounded-full border border-primary/20 uppercase tracking-wider flex items-center gap-2">
                                <Twitter className="w-3 h-3" /> Suggested Post
                            </div>
                            <div className="whitespace-pre-wrap text-on-surface leading-relaxed mt-4 mb-6 font-medium text-[0.95rem]">
                                {results.post}
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                                <span className="text-xs text-on-surface-variant font-medium">
                                    {results.post?.length || 0} characters
                                </span>
                                <Button variant="outlined" size="sm" onClick={() => copyToClipboard(results.post)} className="flex items-center gap-2">
                                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                    {copied ? "Copied" : "Copy Post"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
