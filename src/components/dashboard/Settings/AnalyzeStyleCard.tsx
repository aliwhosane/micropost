"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Sparkles } from "lucide-react";
import { saveAnalyzedTone, analyzeStyleFromText } from "@/actions/onboarding";
import { AnalyzeButton } from "@/components/settings/AnalyzeButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AnalyzeStyleCardProps {
    initialSample?: string;
    onSave?: () => void;
    isTwitterConnected?: boolean;
}

export function AnalyzeStyleCard({ initialSample = "", onSave, isTwitterConnected = false }: AnalyzeStyleCardProps) {
    const [sample, setSample] = useState(initialSample);
    const [analyzing, setAnalyzing] = useState(false);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    // Sync state with prop when server updates
    useEffect(() => {
        setSample(initialSample);
    }, [initialSample]);

    const handleAnalysisComplete = () => {
        router.refresh();
        toast.success("Analysis complete! Review the results below.");
    };

    const handleAnalyze = async () => {
        if (!sample.trim() || sample.length < 50) {
            toast.error("Please provide a longer sample (at least 50 characters).");
            return;
        }

        setAnalyzing(true);
        try {
            const description = await analyzeStyleFromText(sample);
            setSample(description);
            toast.success("Analysis complete! Review the description below.");
        } catch (error) {
            console.error("Analysis failed", error);
            toast.error("Failed to analyze style. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };

    const handleSave = async () => {
        if (!sample.trim()) return;

        setSaving(true);
        try {
            // We use a default tone if we can't infer it, or perhaps we can ask the user later.
            // For now, "Professional" is a safe placeholder as styleSample is the key driver.
            await saveAnalyzedTone(sample, "Professional");
            toast.success("Style preferences saved!");
            onSave?.();
            router.refresh();
        } catch (error) {
            console.error("Save failed", error);
            toast.error("Failed to save style.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card className="border-outline-variant/30 shadow-sm bg-surface">
            <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-xl">Analyze My Style</CardTitle>
                </div>
                <CardDescription>
                    Paste your best recent posts. We'll analyze them to match your unique voice.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    name="styleSample"
                    placeholder="Paste 2-3 of your best performing posts here..."
                    className="min-h-[150px] bg-surface-container-lowest border-outline-variant focus-visible:ring-primary"
                    value={sample}
                    onChange={(e) => setSample(e.target.value)}
                />
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={handleAnalyze}
                        disabled={analyzing || saving || sample.length < 50}
                        variant="tonal"
                        className="flex-1"
                    >
                        {analyzing ? (
                            <>Analyzing... <Sparkles className="w-4 h-4 ml-2 animate-pulse" /></>
                        ) : (
                            <>Analyze Text <Sparkles className="w-4 h-4 ml-2" /></>
                        )}
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={analyzing || saving || !sample.trim()}
                        className="flex-1"
                    >
                        {saving ? (
                            <>Saving... <Loader2 className="w-4 h-4 ml-2 animate-spin" /></>
                        ) : (
                            "Save Style"
                        )}
                    </Button>
                </div>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-outline-variant/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-surface px-2 text-on-surface-variant">Or analyze existing posts</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <AnalyzeButton
                        platform="TWITTER"
                        isConnected={isTwitterConnected}
                        onAnalysisComplete={handleAnalysisComplete}
                    />
                    {!isTwitterConnected && (
                        <p className="text-xs text-on-surface-variant/70 text-center">
                            Connect Twitter to analyze your existing tweets.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
