"use client";

import { Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScriptReviewProps {
    scriptData: any;
    setScriptData: (data: any) => void;
    visualStyle: "MINIMAL" | "CINEMATIC";
    setVisualStyle: (style: "MINIMAL" | "CINEMATIC") => void;
    loading: boolean;
    handleRenderVisuals: () => void;
    hasRenderedScenes: boolean;
    onBack: () => void;
    onNext: () => void;
}

export function ScriptReview({
    scriptData,
    setScriptData,
    visualStyle,
    setVisualStyle,
    loading,
    handleRenderVisuals,
    hasRenderedScenes,
    onBack,
    onNext
}: ScriptReviewProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-on-surface">Review Script</h3>
                    <p className="text-xs text-on-surface-variant">Edit the text below to refine your script.</p>
                </div>
                <div className="text-xs font-mono text-on-surface-variant bg-surface-variant/50 border border-outline-variant/20 px-2 py-1 rounded-lg">
                    {scriptData.scenes.length} Scenes (~{scriptData.scenes.length * 5}s)
                </div>
            </div>

            <div className="grid gap-4">
                {scriptData.scenes.map((scene: any, idx: number) => (
                    <div key={idx} className="bg-surface-variant/30 border border-outline-variant/10 rounded-2xl p-4 flex gap-4 transition-all hover:bg-surface-variant/50">
                        <div className="flex flex-col items-center gap-2 min-w-[60px]">
                            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{scene.type}</span>
                            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-on-surface-variant text-sm font-mono border border-outline-variant/20 shadow-sm">
                                {idx + 1}
                            </div>
                        </div>
                        <div className="space-y-2 flex-1">
                            <textarea
                                value={scene.text}
                                onChange={(e) => {
                                    const newScenes = [...scriptData.scenes];
                                    newScenes[idx] = { ...scene, text: e.target.value };
                                    setScriptData({ ...scriptData, scenes: newScenes });
                                }}
                                className="w-full bg-transparent text-on-surface text-lg font-medium border-none p-0 focus:ring-0 resize-none placeholder:text-on-surface-variant/30"
                                rows={Math.max(2, Math.ceil(scene.text.length / 50))}
                            />
                            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                                <ImageIcon className="w-3 h-3" />
                                <span>Visual Cue: {scene.visualCue}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-surface border border-outline-variant/50 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                    <h4 className="text-on-surface font-medium">Visual Style</h4>
                    <p className="text-xs text-on-surface-variant">Choose how your slides should look.</p>
                </div>
                <div className="flex bg-surface-variant/30 p-1 rounded-xl border border-outline-variant/10">
                    <button
                        onClick={() => setVisualStyle("MINIMAL")}
                        className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", visualStyle === "MINIMAL" ? "bg-surface text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface")}
                    >
                        Minimal (Text)
                    </button>
                    <button
                        onClick={() => setVisualStyle("CINEMATIC")}
                        className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", visualStyle === "CINEMATIC" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface")}
                    >
                        Cinematic (AI Images)
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="px-6 py-3 rounded-full border border-outline-variant/20 hover:bg-surface-variant/30 text-on-surface transition-all"
                >
                    Back
                </button>

                <button
                    onClick={handleRenderVisuals}
                    disabled={loading}
                    className="flex-1 py-3 bg-primary hover:bg-primary/90 text-on-primary rounded-full font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md hover:shadow-primary/25"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                    {hasRenderedScenes ? "Regenerate Visuals" : `Render ${visualStyle === "CINEMATIC" ? "Cinematic" : "Minimal"} Storyboard`}
                </button>

                {hasRenderedScenes && (
                    <button
                        onClick={onNext}
                        className="px-6 py-3 bg-surface-variant/50 hover:bg-surface-variant text-on-surface rounded-full font-bold transition-all border border-outline-variant/10"
                    >
                        Continue →
                    </button>
                )}
            </div>
        </div>
    );
}
