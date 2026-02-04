"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Lightbulb, Loader2, Copy, Check, Sparkles, Linkedin, Twitter, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export default function IdeaToPostGenerator() {
    const [idea, setIdea] = useState("");
    const [tone, setTone] = useState("Professional");
    const [results, setResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

    const tones = ["Professional", "Viral/Hype", "Storyteller", "Educational", "Funny", "Controversial"];

    const handleGenerate = async () => {
        if (!idea) return;

        setIsLoading(true);
        setError("");
        setResults(null);

        try {
            const res = await fetch("/api/tools/idea-to-post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idea, tone }),
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            setResults(data);
        } catch (error: any) {
            console.error("Generation failed", error);
            setError(error.message || "Failed to generate posts. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(id);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="container mx-auto py-12 px-6 max-w-5xl">
            <Link href="/tools" className="inline-flex items-center text-sm text-on-surface-variant hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tools
            </Link>

            <div className="space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
                        <Lightbulb className="w-8 h-8 text-amber-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-on-surface">Idea to Social Posts</h1>
                    <p className="text-xl text-on-surface-variant">
                        Turn one thought into a week of content.
                        <br className="hidden md:block" /> Generate optimized posts for LinkedIn, Twitter, and Threads instantly.
                    </p>
                </div>

                {/* Input Section */}
                <div className="max-w-3xl mx-auto bg-surface p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
                    <div>
                        <label className="text-sm font-medium text-on-surface mb-2 block">Your Idea / Concept</label>
                        <textarea
                            className="w-full h-32 p-4 rounded-xl bg-background border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all font-sans text-base"
                            placeholder="e.g. Remote work actually increases productivity because..."
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-on-surface mb-3 block">Select Tone</label>
                        <div className="flex flex-wrap gap-2">
                            {tones.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTone(t)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tone === t
                                            ? "bg-primary text-on-primary shadow-lg shadow-primary/25"
                                            : "bg-surface-variant text-on-surface-variant hover:bg-outline-variant/50"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="w-full h-14 text-lg font-semibold rounded-xl mt-2"
                        onClick={handleGenerate}
                        disabled={!idea || isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin h-5 w-5" />
                                Generating Content...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Generate Posts
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
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <Tabs defaultValue="linkedin" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-8 max-w-md mx-auto h-auto p-1 bg-surface-variant/50 rounded-xl">
                                <TabsTrigger value="linkedin" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 rounded-lg flex items-center gap-2">
                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                </TabsTrigger>
                                <TabsTrigger value="twitter" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 rounded-lg flex items-center gap-2">
                                    <Twitter className="w-4 h-4" /> Twitter
                                </TabsTrigger>
                                <TabsTrigger value="threads" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 rounded-lg flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4" /> Threads
                                </TabsTrigger>
                            </TabsList>

                            {/* LinkedIn Content */}
                            <TabsContent value="linkedin" className="space-y-6">
                                {results.linkedin.map((post: any, idx: number) => (
                                    <PostCard
                                        key={`li-${idx}`}
                                        content={post.content}
                                        platform="LinkedIn"
                                        index={idx}
                                        onCopy={(text) => copyToClipboard(text, `li-${idx}`)}
                                        isCopied={copiedIndex === `li-${idx}`}
                                    />
                                ))}
                            </TabsContent>

                            {/* Twitter Content */}
                            <TabsContent value="twitter" className="space-y-6">
                                {results.twitter.map((post: any, idx: number) => (
                                    <PostCard
                                        key={`tw-${idx}`}
                                        content={post.content}
                                        platform="Twitter"
                                        index={idx}
                                        onCopy={(text) => copyToClipboard(text, `tw-${idx}`)}
                                        isCopied={copiedIndex === `tw-${idx}`}
                                    />
                                ))}
                            </TabsContent>

                            {/* Threads Content */}
                            <TabsContent value="threads" className="space-y-6">
                                {results.threads.map((post: any, idx: number) => (
                                    <PostCard
                                        key={`th-${idx}`}
                                        content={post.content}
                                        platform="Threads"
                                        index={idx}
                                        onCopy={(text) => copyToClipboard(text, `th-${idx}`)}
                                        isCopied={copiedIndex === `th-${idx}`}
                                    />
                                ))}
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </div>
        </div>
    );
}

function PostCard({ content, platform, index, onCopy, isCopied }: { content: string, platform: string, index: number, onCopy: (t: string) => void, isCopied: boolean }) {
    return (
        <div className="bg-surface p-6 rounded-2xl border border-outline-variant/40 hover:border-primary/30 transition-colors shadow-sm hover:shadow-md group relative">
            <div className="absolute top-4 right-4 text-xs font-semibold text-on-surface-variant/50 uppercase tracking-wider bg-surface-variant/50 px-2 py-1 rounded">
                Option {index + 1}
            </div>
            <div className="whitespace-pre-wrap text-on-surface leading-relaxed mb-6 font-medium text-[0.95rem]">
                {content}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                <span className="text-xs text-on-surface-variant font-medium">
                    {content.length} characters
                </span>
                <Button variant="outlined" size="sm" onClick={() => onCopy(content)} className="flex items-center gap-2">
                    {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {isCopied ? "Copied" : "Copy Post"}
                </Button>
            </div>
        </div>
    );
}
