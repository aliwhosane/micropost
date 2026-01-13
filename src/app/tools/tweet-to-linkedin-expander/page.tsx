"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Maximize2, Loader2, Copy, Check, Linkedin } from "lucide-react";

export default function TweetToLinkedin() {
    const [tweet, setTweet] = useState("");
    const [variations, setVariations] = useState<{ type: string, content: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleExpand = async () => {
        if (!tweet) return;

        setIsLoading(true);
        setError("");
        setVariations([]);

        try {
            const res = await fetch("/api/tools/linkedin-expander", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tweet }),
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            if (data.variations && Array.isArray(data.variations)) {
                setVariations(data.variations);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error: any) {
            console.error("Expansion failed", error);
            setError(error.message || "Failed to expand tweet. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="container mx-auto py-12 px-6 max-w-4xl">
            <Link href="/tools" className="inline-flex items-center text-sm text-on-surface-variant hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tools
            </Link>

            <div className="space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="mx-auto w-16 h-16 bg-blue-700/10 rounded-2xl flex items-center justify-center mb-6">
                        <Maximize2 className="w-8 h-8 text-blue-700" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-on-surface">Tweet to LinkedIn</h1>
                    <p className="text-xl text-on-surface-variant">
                        Don't let your best thoughts die in the feed.
                        <br className="hidden md:block" /> Expand short tweets into high-performing LinkedIn posts.
                    </p>
                </div>

                {/* Input Section */}
                <div className="max-w-2xl mx-auto bg-surface p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
                    <label className="text-sm font-medium text-on-surface mb-2 block">Your Tweet / Short Thought</label>
                    <textarea
                        className="w-full h-32 p-4 rounded-xl bg-background border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all font-sans text-base"
                        placeholder="e.g. Most startups don't die from competition, they die from indigestion. Focus is the only strategy that matters."
                        value={tweet}
                        onChange={(e) => setTweet(e.target.value)}
                    />

                    <Button
                        size="lg"
                        className="w-full h-14 text-lg font-semibold rounded-xl mt-6"
                        onClick={handleExpand}
                        disabled={!tweet || isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin h-5 w-5" />
                                Expanding...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Maximize2 className="w-5 h-5" />
                                Expand for LinkedIn
                            </div>
                        )}
                    </Button>
                </div>

                {error && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-center text-error font-medium max-w-2xl mx-auto">
                        {error}
                    </div>
                )}

                {/* Results Grid */}
                {variations.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {variations.map((post, index) => (
                            <div key={index} className="bg-surface p-6 rounded-2xl border border-outline-variant/40 hover:border-blue-600/30 transition-colors shadow-sm hover:shadow-md group flex flex-col">
                                <div className="mb-4">
                                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-700/10 px-2 py-1 rounded">
                                        {post.type}
                                    </span>
                                </div>
                                <div className="flex-1 pr-1 custom-scrollbar overflow-y-auto max-h-[500px]">
                                    <p className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed">{post.content}</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                                    <Linkedin className="w-5 h-5 text-blue-700 opacity-50" />
                                    <Button variant="outlined" size="sm" onClick={() => copyToClipboard(post.content, index)} className="flex items-center gap-2">
                                        {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copiedIndex === index ? "Copied" : "Copy"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
