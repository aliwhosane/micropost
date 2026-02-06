"use client";

import { useState } from "react";
import { createScriptAction, renderStoryboardAction } from "@/app/actions/shorts";
import { Loader2, Clapperboard, PlayCircle, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming utils exist

export function ScriptWizard() {
    const [step, setStep] = useState<"INPUT" | "SCRIPT" | "VISUALS">("INPUT");
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [scriptData, setScriptData] = useState<any>(null);
    const [renderedScenes, setRenderedScenes] = useState<any[]>([]);

    async function handleGenerateScript() {
        if (!input) return;
        setIsLoading(true);
        const res = await createScriptAction(input);
        setIsLoading(false);

        if (res.success) {
            setScriptData(res.script);
            setStep("SCRIPT");
        }
    }

    async function handleRenderVisuals() {
        setIsLoading(true);
        const res = await renderStoryboardAction(scriptData.scenes);
        setIsLoading(false);

        if (res.success && res.scenes) {
            setRenderedScenes(res.scenes);
            setStep("VISUALS");
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-8 min-h-[600px]">
            {/* Progress Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <Clapperboard className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">ShortsMaker</h2>
                        <p className="text-sm text-zinc-400">Text to Vertical Video Script</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <span className={cn("px-3 py-1 rounded-full", step === "INPUT" ? "bg-primary/20 text-primary" : "text-zinc-600")}>1. Topic</span>
                    <span className="text-zinc-700">→</span>
                    <span className={cn("px-3 py-1 rounded-full", step === "SCRIPT" ? "bg-primary/20 text-primary" : "text-zinc-600")}>2. Script</span>
                    <span className="text-zinc-700">→</span>
                    <span className={cn("px-3 py-1 rounded-full", step === "VISUALS" ? "bg-primary/20 text-primary" : "text-zinc-600")}>3. Storyboard</span>
                </div>
            </div>

            {/* Step 1: Input */}
            {step === "INPUT" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">What is your video about?</label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Example: 3 tips for staying productive while working from home..."
                            className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                        />
                    </div>
                    <button
                        onClick={handleGenerateScript}
                        disabled={isLoading || !input}
                        className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
                        Generate Script
                    </button>
                </div>
            )}

            {/* Step 2: Script Review */}
            {step === "SCRIPT" && scriptData && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">Review Script</h3>
                        <div className="text-xs font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                            {scriptData.scenes.length} Scenes (~{scriptData.scenes.length * 5}s)
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {scriptData.scenes.map((scene: any, idx: number) => (
                            <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex gap-4">
                                <div className="flex flex-col items-center gap-2 min-w-[60px]">
                                    <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">{scene.type}</span>
                                    <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 text-sm font-mono border border-zinc-800">
                                        {idx + 1}
                                    </div>
                                </div>
                                <div className="space-y-2 flex-1">
                                    <p className="text-white text-lg font-medium">"{scene.text}"</p>
                                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                                        <ImageIcon className="w-3 h-3" />
                                        <span>Visual Cue: {scene.visualCue}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setStep("INPUT")}
                            className="px-6 py-3 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-white transition-all"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleRenderVisuals}
                            disabled={isLoading}
                            className="flex-1 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                            Render Storyboard
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Visuals Preview */}
            {step === "VISUALS" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-lg font-bold text-white text-center">Your Storyboard</h3>

                    {/* Horizontal Scroll for Vertical Cards */}
                    <div className="flex gap-4 overflow-x-auto pb-6 snap-x">
                        {renderedScenes.map((scene: any, idx: number) => (
                            <div key={idx} className="snap-center shrink-0 w-[280px] group relative">
                                <div className="aspect-[9/16] bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={scene.imageUrl} alt={`Scene ${idx + 1}`} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-10 left-0 w-full text-center">
                                    <span className="text-xs font-mono text-zinc-500">Scene {idx + 1}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center pt-8">
                        <button
                            onClick={() => setStep("INPUT")}
                            className="px-6 py-3 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-white transition-all"
                        >
                            Create Another
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
