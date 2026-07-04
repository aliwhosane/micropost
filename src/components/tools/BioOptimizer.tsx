"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { UserCog, Loader2, Copy, Check, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface BioOptimizerProps {
    initialBio?: string;
    onSave?: (bio: string) => void;
    saveLabel?: string;
}

export function BioOptimizer({ initialBio = "", onSave, saveLabel = "Save to Profile" }: BioOptimizerProps) {
    const [currentBio, setCurrentBio] = useState(initialBio);
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
        <div className="space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <UserCog className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-on-surface">AI Bio Optimizer</h1>
                <p className="text-xl text-on-surface-variant">
                    Craft the perfect social media bio in seconds.
                    <br className="hidden md:block" /> Stand out, convert visitors, and grow your audience.
                </p>
            </div>

            {/* Input Section */}
            <div className="max-w-2xl mx-auto space-y-8 bg-surface p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm">

                <div className="space-y-4">
                    <label className="text-sm font-medium text-on-surface">Platform</label>
                    <div className="grid grid-cols-3 gap-2 bg-surface-variant/30 p-1 rounded-2xl">
                        {["Twitter", "LinkedIn", "Instagram"].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPlatform(p)}
                                className={`py-2 rounded-xl text-sm font-medium transition-all ${platform === p
                                    ? "bg-surface text-on-surface shadow-sm"
                                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface/50"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-on-surface">Your Role / Niche</label>
                        <Input
                            placeholder="e.g. SaaS Founder, Fitness Coach"
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                            className="h-14 rounded-2xl bg-surface-variant/30 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-on-surface">Primary Goal</label>
                        <div className="grid grid-cols-2 gap-2">
                            {["Growth", "Sales", "Authority", "Personal"].map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setGoal(g)}
                                    className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${goal === g
                                        ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                                        : "bg-surface-variant/30 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
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
                        className="w-full h-32 p-4 rounded-3xl bg-surface-variant/30 border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all font-sans text-base text-on-surface placeholder:text-on-surface-variant/50 shadow-sm"
                        placeholder="Paste your current bio here for a rewrite..."
                        value={currentBio}
                        onChange={(e) => setCurrentBio(e.target.value)}
                    />
                </div>

                <Button
                    size="lg"
                    className="w-full h-16 text-lg font-bold rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
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
                <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
                    <h3 className="text-xl font-bold text-on-surface text-center mb-4">Select your favorite:</h3>
                    {bios.map((bio, index) => (
                        <div key={index} className="bg-surface p-8 rounded-[2rem] border border-outline-variant/10 hover:border-primary/20 transition-all shadow-sm hover:shadow-lg hover:shadow-primary/5 group relative">
                            <div className="pr-12">
                                <p className="text-lg text-on-surface whitespace-pre-wrap leading-relaxed">{bio}</p>
                            </div>
                            <div className="absolute top-6 right-6 flex items-center gap-2">
                                <button
                                    onClick={() => copyToClipboard(bio, index)}
                                    className="p-3 bg-surface-variant/30 hover:bg-surface-variant text-on-surface-variant hover:text-primary rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                    title="Copy bio"
                                >
                                    {copiedIndex === index ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                </button>
                                {onSave && (
                                    <Button
                                        size="sm"
                                        variant="tonal"
                                        onClick={() => onSave(bio)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                                    >
                                        {saveLabel}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
