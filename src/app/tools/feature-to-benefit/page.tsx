"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Loader2, ArrowRight, Wand2 } from "lucide-react";

export default function FeatureToBenefit() {
    const [features, setFeatures] = useState("");
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleConvert = async () => {
        if (!features) return;

        setIsLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await fetch("/api/tools/benefits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ features }),
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            setResult(data);
        } catch (error: any) {
            console.error("Conversion failed", error);
            setError(error.message || "Failed to convert features. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-6 max-w-5xl">
            <Link href="/tools" className="inline-flex items-center text-sm text-on-surface-variant hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tools
            </Link>

            <div className="space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="mx-auto w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6">
                        <Wand2 className="w-8 h-8 text-pink-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-on-surface">Feature to Benefit</h1>
                    <p className="text-xl text-on-surface-variant">
                        Stop selling specs. Start selling the dream.
                        <br className="hidden md:block" /> Turn your boring features into irresistible emotional benefits.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Input Section */}
                    <div className="bg-surface p-8 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col h-full">
                        <label className="text-sm font-medium text-on-surface mb-2">Your Boring Features</label>
                        <textarea
                            className="w-full h-80 p-4 rounded-xl bg-background border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all font-sans text-base"
                            placeholder={"- 500GB Storage\n- 24/7 Support\n- AES-256 Encryption\n- Export to CSV"}
                            value={features}
                            onChange={(e) => setFeatures(e.target.value)}
                        />
                        <p className="text-xs text-on-surface-variant mt-2 text-right">Put each feature on a new line.</p>

                        <Button
                            size="lg"
                            className="w-full h-14 text-lg font-semibold rounded-xl mt-6"
                            onClick={handleConvert}
                            disabled={!features || isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin h-5 w-5" />
                                    Converting...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Wand2 className="w-5 h-5" />
                                    Convert to Benefits
                                </div>
                            )}
                        </Button>
                    </div>

                    {/* Results Section */}
                    <div className="space-y-4">
                        {!result && !isLoading && (
                            <div className="h-full bg-surface p-8 rounded-3xl border border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-center text-on-surface-variant opacity-60 min-h-[400px]">
                                <Wand2 className="w-12 h-12 mb-4" />
                                <p>Your marketing gold will appear here.</p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="h-full bg-surface p-8 rounded-3xl border border-outline-variant/30 flex flex-col items-center justify-center text-center min-h-[400px]">
                                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                                <p className="text-on-surface-variant">Finding the emotional hook...</p>
                            </div>
                        )}

                        {result && result.conversions.map((item: any, i: number) => (
                            <div key={i} className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                                    <div>
                                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Feature</p>
                                        <p className="text-on-surface font-medium opacity-80">{item.feature}</p>
                                    </div>

                                    <div className="hidden md:flex justify-center">
                                        <div className="bg-background rounded-full p-2 border border-outline-variant/50">
                                            <ArrowRight className="w-4 h-4 text-primary" />
                                        </div>
                                    </div>

                                    <div className="md:text-right">
                                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Benefit ({item.emotion})</p>
                                        <p className="text-lg font-bold text-on-surface leading-tight">{item.benefit}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
