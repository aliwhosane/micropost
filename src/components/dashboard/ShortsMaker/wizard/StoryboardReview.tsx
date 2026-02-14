"use client";

import { useState } from "react";
import { Loader2, Clapperboard, PlayCircle, Image as ImageIcon, Volume2, Download, Video, Layers, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderStoryboardAction } from "@/app/actions/shorts";

interface StoryboardReviewProps {
    renderedScenes: any[];
    setRenderedScenes: (scenes: any[]) => void;
    selectedVoice: "Puck" | "Kore";
    setSelectedVoice: (voice: "Puck" | "Kore") => void;
    loading: boolean;
    handleGenerateAudio: () => void;
    hasAudio: boolean;
    visualStyle: "MINIMAL" | "CINEMATIC";
    onBack: () => void;
    onNext: () => void;
}

export function StoryboardReview({
    renderedScenes,
    setRenderedScenes,
    selectedVoice,
    setSelectedVoice,
    loading,
    handleGenerateAudio,
    hasAudio,
    visualStyle,
    onBack,
    onNext
}: StoryboardReviewProps) {

    const toggleOverlay = (idx: number, id: string) => {
        const newScenes = [...renderedScenes];
        const current = newScenes[idx].overlays || [];
        newScenes[idx].overlays = current.includes(id) ? current.filter((o: any) => o !== id) : [...current, id];
        setRenderedScenes(newScenes);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-lg font-bold text-on-surface text-center">Your Storyboard</h3>

            <div className="flex gap-4 overflow-x-auto pb-6 snap-x min-h-[550px]">
                {renderedScenes.map((scene: any, idx: number) => {
                    const activeOverlays = scene.overlays || [];

                    return (
                        <div key={idx} className="snap-center shrink-0 w-[300px] flex flex-col gap-2 relative">
                            <div className="aspect-[9/16] bg-black border border-outline-variant/10 rounded-2xl overflow-hidden shadow-lg relative group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={scene.imageUrl} alt={`Scene ${idx + 1}`} className="w-full h-full object-cover" />

                                {/* Edit Controls Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end p-2 gap-2">
                                    {/* Edit Text */}
                                    <button
                                        onClick={() => {
                                            const newText = prompt("Edit text for this scene:", scene.text);
                                            if (newText && newText !== scene.text) {
                                                const newScenes = [...renderedScenes];
                                                newScenes[idx] = { ...scene, text: newText };
                                                setRenderedScenes(newScenes);
                                                // Trigger Regen (Simulated click)
                                                // Ideally we call the update function directly, but button is below
                                                const btn = document.getElementById(`regen-btn-${idx}`);
                                                if (btn) (btn as HTMLButtonElement).click();
                                            }
                                        }}
                                        className="p-2 bg-surface/80 text-on-surface rounded-full hover:bg-surface border border-white/20 backdrop-blur-sm shadow-sm"
                                        title="Edit Text"
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                    </button>

                                    {/* Overlays Menu */}
                                    <div className="relative group/menu">
                                        <button
                                            className="p-2 bg-surface/80 text-on-surface rounded-full hover:bg-surface border border-white/20 backdrop-blur-sm shadow-sm"
                                            title="Add Overlays"
                                        >
                                            <Layers className="w-4 h-4" />
                                        </button>

                                        {/* Hover Menu for Overlays */}
                                        <div className="absolute right-0 top-10 w-48 bg-surface border border-outline-variant/10 rounded-xl shadow-xl p-2 z-50 invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all">
                                            <p className="text-xs font-bold text-on-surface-variant px-2 py-1 uppercase tracking-wider">Cinematic</p>
                                            {["VIGNETTE", "FILM_GRAIN", "FLASH", "WATERMARK"].map(id => (
                                                <button
                                                    key={id}
                                                    onClick={() => toggleOverlay(idx, id)}
                                                    className={cn("w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-surface-variant/30", activeOverlays.includes(id) ? "text-primary font-bold" : "text-on-surface-variant")}
                                                >
                                                    {id.replace(/_/g, " ")}
                                                    {activeOverlays.includes(id) && <Check className="w-3 h-3" />}
                                                </button>
                                            ))}
                                            <div className="h-px bg-outline-variant/10 my-1" />
                                            <p className="text-xs font-bold text-on-surface-variant px-2 py-1 uppercase tracking-wider">Engagement</p>
                                            {["SUBSCRIBE", "LIKE_EXPLOSION", "CONFETTI", "WAIT_FOR_IT", "LINK_IN_BIO"].map(id => (
                                                <button
                                                    key={id}
                                                    onClick={() => toggleOverlay(idx, id)}
                                                    className={cn("w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-surface-variant/30", activeOverlays.includes(id) ? "text-primary font-bold" : "text-on-surface-variant")}
                                                >
                                                    {id.replace(/_/g, " ")}
                                                    {activeOverlays.includes(id) && <Check className="w-3 h-3" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-on-surface-variant font-mono text-center">Scene {idx + 1}</p>
                                <button
                                    id={`regen-btn-${idx}`}
                                    onClick={async () => {
                                        const newScenes = [...renderedScenes];
                                        const btn = document.getElementById(`regen-btn-${idx}`);
                                        if (btn) btn.innerText = "...";
                                        const res = await renderStoryboardAction([newScenes[idx]], visualStyle);
                                        if (res.success && res.scenes && res.scenes[0]) {
                                            // Preserve overlays !!!
                                            const preservedOverlays = newScenes[idx].overlays || [];
                                            newScenes[idx] = { ...res.scenes[0], overlays: preservedOverlays };
                                            setRenderedScenes(newScenes);
                                        }
                                        if (btn) btn.innerText = "Update Image";
                                    }}
                                    className="w-full py-2 bg-surface-variant/30 hover:bg-surface-variant border border-outline-variant/10 text-xs text-on-surface-variant rounded-lg transition-all"
                                >
                                    Update Image
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>


            <div className="flex items-center gap-4 pt-8 bg-surface-variant/30 p-6 rounded-[2rem] border border-outline-variant/10">
                {/* Voice Select */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-on-surface-variant">Select Voice</label>
                    <div className="flex bg-surface p-1 rounded-xl border border-outline-variant/10">
                        <button onClick={() => setSelectedVoice("Puck")} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", selectedVoice === "Puck" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface")}>Male</button>
                        <button onClick={() => setSelectedVoice("Kore")} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", selectedVoice === "Kore" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface")}>Female</button>
                    </div>
                </div>

                <div className="flex-1 flex items-center gap-4 justify-end">
                    <button
                        onClick={onBack}
                        className="px-6 py-3 rounded-full border border-outline-variant/20 hover:bg-surface-variant/30 text-on-surface transition-all"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleGenerateAudio}
                        disabled={loading}
                        className="px-8 py-3 bg-primary hover:bg-primary/90 text-on-primary rounded-full font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md hover:shadow-primary/25"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                        {hasAudio ? "Regenerate Audio" : "Generate Audio & Preview"}
                    </button>

                    {hasAudio && (
                        <button
                            onClick={onNext}
                            className="px-6 py-3 bg-surface-variant/50 hover:bg-surface-variant text-on-surface rounded-full font-bold transition-all border border-outline-variant/10"
                        >
                            Continue →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
