"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Magnet, Loader2, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/Input";

export default function ViralHooksGenerator() {
    const [topic, setTopic] = useState("");
    const [hooks, setHooks] = useState<{ hook: string; category: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleGenerate = async () => {
        if (!topic) return;

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/tools/hooks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic }),
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            if (Array.isArray(data.hooks)) {
                setHooks(data.hooks);
            } else {
                // Fallback if the API response structure is slightly different (e.g. just the array)
                // This handles cases where my API route might return just the array or { hooks: [...] }
                // Based on my API route implementation, it returns { hooks: [...] }, so checking data.hooks is correct.
                if (Array.isArray(data)) {
                    setHooks(data);
                } else {
                    throw new Error("Invalid response format");
                }
            }
        } catch (error: any) {
            console.error("Hook generation failed", error);
            setError(error.message || "Failed to generate hooks. Please try again.");
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
                    <div className="mx-auto w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
                        <Magnet className="w-8 h-8 text-purple-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-on-surface">Viral API Hook Generator</h1>
                    <p className="text-xl text-on-surface-variant">
                        Stop the scroll with AI-generated opening lines.
                        <br className="hidden md:block" /> Perfect for LinkedIn & Twitter.
                    </p>
                </div>

                {/* Input Section */}
                <div className="max-w-2xl mx-auto space-y-2">
                    <label className="text-sm font-medium text-on-surface ml-1">
                        What is your post about?
                    </label>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="e.g. Remote Work, SaaS Marketing, AI Agents..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="h-14 text-lg"
                                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                            />
                        </div>
                        <Button
                            size="lg"
                            className="h-14 px-8 text-lg"
                            onClick={handleGenerate}
                            disabled={!topic || isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Generate Hooks"}
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-center text-error font-medium max-w-2xl mx-auto">
                        {error}
                    </div>
                )}

                {/* Results Grid */}
                {hooks.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {hooks.map((item, index) => (
                            <div key={index} className="bg-surface p-6 rounded-2xl border border-outline-variant/40 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                                        {item.category}
                                    </span>
                                    <button
                                        onClick={() => copyToClipboard(item.hook, index)}
                                        className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Copy hook"
                                    >
                                        {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-lg font-medium text-on-surface leading-snug">
                                    {item.hook}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                {hooks.length > 0 && (
                    <div className="text-center pt-8">
                        <p className="text-on-surface-variant mb-4">
                            Found a hook you like? Let Micropost write the rest.
                        </p>
                        <Link href="/login">
                            <Button size="lg" variant="outlined" className="rounded-full">
                                Start Writing for Free
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
