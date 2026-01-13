"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Loader2, Copy, Check, Type } from "lucide-react";

export default function ThumbnailTitleGenerator() {
    const [videoTitle, setVideoTitle] = useState("");
    const [ideas, setIdeas] = useState<{ text: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [previewColor, setPreviewColor] = useState("bg-red-600");

    const handleGenerate = async () => {
        if (!videoTitle) return;

        setIsLoading(true);
        setError("");
        setIdeas([]);

        try {
            const res = await fetch("/api/tools/thumbnail-title", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ videoTitle }),
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            if (data.ideas && Array.isArray(data.ideas)) {
                setIdeas(data.ideas);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error: any) {
            console.error("Generation failed", error);
            setError(error.message || "Failed to generate titles. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const colors = [
        { name: "Red", value: "bg-red-600" },
        { name: "Blue", value: "bg-blue-600" },
        { name: "Green", value: "bg-green-600" },
        { name: "Black", value: "bg-neutral-900" },
    ];

    return (
        <div className="container mx-auto py-12 px-6 max-w-4xl">
            <Link href="/tools" className="inline-flex items-center text-sm text-on-surface-variant hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tools
            </Link>

            <div className="space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="mx-auto w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mb-6">
                        <ImageIcon className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-on-surface">Thumbnail Text Generator</h1>
                    <p className="text-xl text-on-surface-variant">
                        Stop using your video title on your thumbnail.
                        <br className="hidden md:block" /> Generate short, punchy overlays that get clicks.
                    </p>
                </div>

                {/* Input Section */}
                <div className="max-w-2xl mx-auto bg-surface p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
                    <label className="text-sm font-medium text-on-surface mb-2 block">Video Title / Concept</label>
                    <textarea
                        className="w-full h-32 p-4 rounded-xl bg-background border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all font-sans text-base"
                        placeholder="e.g. I spent 24 hours in a haunted hotel"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                    />

                    <Button
                        size="lg"
                        className="w-full h-14 text-lg font-semibold rounded-xl mt-6"
                        onClick={handleGenerate}
                        disabled={!videoTitle || isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin h-5 w-5" />
                                Generating Ideas...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Type className="w-5 h-5" />
                                Generate Overlays
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
                {ideas.length > 0 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex justify-center gap-4 mb-6">
                            {colors.map((c) => (
                                <button
                                    key={c.name}
                                    onClick={() => setPreviewColor(c.value)}
                                    className={`w-8 h-8 rounded-full ${c.value} border-2 ${previewColor === c.value ? 'border-primary scale-110' : 'border-transparent opacity-70 hover:opacity-100'} transition-all`}
                                    title={`Preview in ${c.name}`}
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {ideas.map((idea, index) => (
                                <div key={index} className="bg-surface p-6 rounded-2xl border border-outline-variant/40 hover:border-red-600/30 transition-colors shadow-sm hover:shadow-md group flex flex-col">
                                    {/* Preview Mockup */}
                                    <div className={`aspect-video ${previewColor} rounded-xl mb-4 flex items-center justify-center p-4 relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-black/20" /> {/* Subtle overlay for depth */}
                                        <span className="relative text-white font-black text-3xl md:text-4xl text-center uppercase leading-tight drop-shadow-xl" style={{ textShadow: "0 4px 8px rgba(0,0,0,0.5)" }}>
                                            {idea.text}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center mt-auto pt-2">
                                        <span className="text-sm text-on-surface-variant font-medium">Character Count: {idea.text.length}</span>
                                        <Button variant="outlined" size="sm" onClick={() => copyToClipboard(idea.text, index)} className="flex items-center gap-2">
                                            {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            {copiedIndex === index ? "Copied" : "Copy"}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
