"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Eraser, Loader2, AlertTriangle, CheckCircle } from "lucide-react";

export default function BuzzwordKiller() {
    const [text, setText] = useState("");
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        if (!text) return;

        setIsLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await fetch("/api/tools/buzzword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            setResult(data);
        } catch (error: any) {
            console.error("Analysis failed", error);
            setError(error.message || "Failed to analyze text. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-green-500";
        if (score >= 70) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <div className="container mx-auto py-12 px-6 max-w-4xl">
            <Link href="/tools" className="inline-flex items-center text-sm text-on-surface-variant hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tools
            </Link>

            <div className="space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="mx-auto w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6">
                        <Eraser className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-on-surface">Buzzword Killer</h1>
                    <p className="text-xl text-on-surface-variant">
                        Stop sounding like a bot. Sound human.
                        <br className="hidden md:block" /> Identify corporate fluff and replace it with punchy alternatives.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="bg-surface p-8 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col h-full">
                        <label className="text-sm font-medium text-on-surface mb-2">My "Professional" Text</label>
                        <textarea
                            className="w-full flex-1 p-4 rounded-xl bg-background border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all font-sans text-base min-h-[300px]"
                            placeholder="Paste your email, LinkedIn post, or memo here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <Button
                            size="lg"
                            className="w-full h-14 text-lg font-semibold rounded-xl mt-6"
                            onClick={handleAnalyze}
                            disabled={!text || isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin h-5 w-5" />
                                    Analyzing...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Eraser className="w-5 h-5" />
                                    Kill Jargon
                                </div>
                            )}
                        </Button>
                    </div>

                    {/* Results Section */}
                    <div className="bg-surface p-8 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col h-full relative overflow-hidden">
                        {!result && !isLoading && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center text-on-surface-variant opacity-60">
                                <AlertTriangle className="w-12 h-12 mb-4" />
                                <p>Analysis will appear here.</p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center">
                                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                                <p className="text-on-surface-variant">Hunting for "synergy"...</p>
                            </div>
                        )}

                        {result && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                                <div className="text-center border-b border-outline-variant/20 pb-6">
                                    <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">Human Score</p>
                                    <div className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
                                        {result.score}/100
                                    </div>
                                </div>

                                <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
                                    {result.matches.length === 0 ? (
                                        <div className="text-center py-8">
                                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                            <h3 className="text-lg font-bold text-on-surface">Clean as a whistle!</h3>
                                            <p className="text-on-surface-variant">You sound like a real person. Keep it up.</p>
                                        </div>
                                    ) : (
                                        result.matches.map((match: any, i: number) => (
                                            <div key={i} className="bg-background p-4 rounded-xl border border-outline-variant/40">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-bold text-red-500 line-through decoration-2">
                                                        {match.word}
                                                    </span>
                                                    <span className="font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded text-sm">
                                                        {match.alternative}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-on-surface-variant">{match.reason}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
