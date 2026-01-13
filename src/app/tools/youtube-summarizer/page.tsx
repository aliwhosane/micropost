"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Youtube, Loader2, Copy, Check, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export default function YouTubeSummarizer() {
    const [url, setUrl] = useState("");
    const [transcript, setTranscript] = useState("");
    const [thread, setThread] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleGenerate = async (mode: 'url' | 'transcript') => {
        if (mode === 'url' && !url) return;
        if (mode === 'transcript' && !transcript) return;

        // Basic client-side validation
        if (mode === 'url' && (!url.includes("youtube.com") && !url.includes("youtu.be"))) {
            setError("Please enter a valid YouTube URL");
            return;
        }

        setIsLoading(true);
        setError("");
        setThread([]);

        try {
            const body = mode === 'url' ? { url } : { transcript };

            const res = await fetch("/api/tools/youtube", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            if (data.thread && Array.isArray(data.thread)) {
                setThread(data.thread);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error: any) {
            console.error("Generation failed", error);
            let msg = error.message || "Something went wrong. Please check the URL and try again.";
            if (msg.toLowerCase().includes("transcript") || msg.toLowerCase().includes("captions")) {
                msg += " (Try the 'Paste Transcript' tab instead)";
            }
            setError(msg);
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
                    <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                        <Youtube className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-on-surface">YouTube to Thread</h1>
                    <p className="text-xl text-on-surface-variant">
                        Turn long videos into viral Twitter threads. Paste a URL, get a thread.
                    </p>
                </div>

                {/* Input Section */}
                <div className="max-w-3xl mx-auto">
                    <Tabs defaultValue="url" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="url">YouTube URL</TabsTrigger>
                            <TabsTrigger value="transcript">Paste Transcript</TabsTrigger>
                        </TabsList>

                        <TabsContent value="url" className="mt-0">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Paste YouTube URL here (e.g. https://www.youtube.com/watch?v=...)"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="h-14 text-lg"
                                        onKeyDown={(e) => e.key === "Enter" && handleGenerate('url')}
                                    />
                                </div>
                                <Button
                                    size="lg"
                                    className="h-14 px-8 text-lg"
                                    onClick={() => handleGenerate('url')}
                                    disabled={!url || isLoading}
                                >
                                    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Summarize"}
                                </Button>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm text-on-surface-variant/80 justify-center">
                                <Info className="w-4 h-4" />
                                Works best with videos that have captions/transcripts enabled.
                            </div>
                        </TabsContent>

                        <TabsContent value="transcript" className="mt-0">
                            <div className="space-y-4">
                                <textarea
                                    className="w-full h-[300px] p-4 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all font-sans text-base"
                                    placeholder="Paste the raw video transcript here..."
                                    value={transcript}
                                    onChange={(e) => setTranscript(e.target.value)}
                                />
                                <Button
                                    size="lg"
                                    className="w-full h-14 text-lg"
                                    onClick={() => handleGenerate('transcript')}
                                    disabled={!transcript || isLoading}
                                >
                                    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Summarize Transcript"}
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {error && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-center text-error font-medium max-w-2xl mx-auto">
                        {error}
                    </div>
                )}

                {/* Results Section */}
                {thread.length > 0 && (
                    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="relative pl-8 border-l-2 border-outline-variant/30 space-y-8">
                            {thread.map((tweet, index) => (
                                <div key={index} className="relative group">
                                    {/* Thread Connector Node */}
                                    <div className="absolute -left-[41px] top-6 w-5 h-5 rounded-full bg-surface border-4 border-outline-variant group-hover:border-primary transition-colors z-10" />

                                    <div className="bg-surface p-6 rounded-2xl border border-outline-variant/40 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start gap-4">
                                            <p className="text-lg text-on-surface whitespace-pre-wrap leading-relaxed">{tweet}</p>
                                            <button
                                                onClick={() => copyToClipboard(tweet, index)}
                                                className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant hover:text-primary shrink-0"
                                                title="Copy tweet"
                                            >
                                                {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <div className="mt-4 flex justify-between items-center text-xs text-on-surface-variant font-mono">
                                            <span>{tweet.length}/280</span>
                                            <span>Tweet {index + 1}/{thread.length}</span>
                                        </div>
                                        {tweet.length > 280 && (
                                            <div className="mt-2 text-error text-xs font-medium">
                                                Warning: Exceeds character limit
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="text-center pt-8 bg-surface-variant/20 p-8 rounded-3xl">
                            <h3 className="text-2xl font-bold text-on-surface mb-4">Like this thread?</h3>
                            <p className="text-on-surface-variant mb-8">
                                Schedule it instantly with Micropost. We'll post it automatically at the best time.
                            </p>
                            <Link href="/login">
                                <Button size="lg" className="rounded-full shadow-lg shadow-primary/20">
                                    Schedule Thread for Free
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
