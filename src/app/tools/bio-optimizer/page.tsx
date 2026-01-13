"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, User, Loader2, Copy, Check, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

export default function BioOptimizer() {
    const [currentBio, setCurrentBio] = useState("");
    const [goal, setGoal] = useState("Growth");
    const [niche, setNiche] = useState("");
    const [platform, setPlatform] = useState("Twitter");

    const [bios, setBios] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleGenerate = async () => {
        if (!niche) return;

        setIsLoading(true);
        setError("");
        setBios([]);

        try {
            const res = await fetch("/api/tools/bio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentBio, goal, niche, platform }),
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            if (data.bios && Array.isArray(data.bios)) {
                setBios(data.bios);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error: any) {
            console.error("Bio generation failed", error);
            setError(error.message || "Failed to generate bios. Please try again.");
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
                    <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                        <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-on-surface">AI Bio Optimizer</h1>
                    <p className="text-xl text-on-surface-variant">
                        Craft the perfect social media bio in seconds.
                        <br className="hidden md:block" /> Stand out, convert visitors, and grow your audience.
                    </p>
                </div>

                {/* Input Section */}
                <div className="max-w-2xl mx-auto space-y-8 bg-surface p-8 rounded-3xl border border-outline-variant/30 shadow-sm">

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-on-surface">Platform</label>
                        <Tabs value={platform} onValueChange={setPlatform} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="Twitter">Twitter / X</TabsTrigger>
                                <TabsTrigger value="LinkedIn">LinkedIn</TabsTrigger>
                                <TabsTrigger value="Instagram">Instagram</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-on-surface">Your Role / Niche</label>
                            <Input
                                placeholder="e.g. SaaS Founder, Fitness Coach"
                                value={niche}
                                onChange={(e) => setNiche(e.target.value)}
                                className="h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-on-surface">Primary Goal</label>
                            <div className="grid grid-cols-2 gap-2">
                                {["Growth", "Sales", "Authority", "Personal"].map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setGoal(g)}
                                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${goal === g
                                                ? "bg-primary text-on-primary ring-2 ring-primary ring-offset-2 ring-offset-surface"
                                                : "bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80"
                                            }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-on-surface">
                            Current Bio <span className="text-on-surface-variant font-normal">(Optional)</span>
                        </label>
                        <textarea
                            className="w-full h-24 p-4 rounded-xl bg-background border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all font-sans text-base"
                            placeholder="Paste your current bio here for a rewrite..."
                            value={currentBio}
                            onChange={(e) => setCurrentBio(e.target.value)}
                        />
                    </div>

                    <Button
                        size="lg"
                        className="w-full h-14 text-lg font-semibold rounded-xl"
                        onClick={handleGenerate}
                        disabled={!niche || isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin h-5 w-5" />
                                Optimizing Profile...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Generate Bios
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
                {bios.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <h3 className="text-lg font-semibold text-on-surface mb-2">Select your favorite:</h3>
                        {bios.map((bio, index) => (
                            <div key={index} className="bg-surface p-6 rounded-2xl border border-outline-variant/40 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md group relative">
                                <div className="pr-12">
                                    <p className="text-lg text-on-surface whitespace-pre-wrap leading-relaxed">{bio}</p>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(bio, index)}
                                    className="absolute top-6 right-6 p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Copy bio"
                                >
                                    {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        ))}

                        {/* CTA */}
                        <div className="text-center pt-8 mt-4">
                            <p className="text-on-surface-variant mb-4">
                                Now that your profile is ready, let's fill it with content.
                            </p>
                            <Link href="/login">
                                <Button size="lg" variant="outlined" className="rounded-full">
                                    Start Creating Content
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
