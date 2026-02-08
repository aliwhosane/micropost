"use client";

import { useState, useMemo } from "react";
import { createScriptAction, renderStoryboardAction, generateAudioAction } from "@/app/actions/shorts";
import { Loader2, Clapperboard, PlayCircle, Image as ImageIcon, Volume2, Download, Video, Layers, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Player } from "@remotion/player";
import { ShortsComposition } from "@/remotion/Composition";
// We'll build a custom simple popover using absolute positioning since we don't know the exact UI lib setup.

export function ScriptWizard() {
    const [step, setStep] = useState<"TOPIC" | "SCRIPT" | "STORYBOARD" | "PREVIEW">("TOPIC");
    const [input, setInput] = useState("");

    // Granular Loading States
    const [loadingState, setLoadingState] = useState({
        script: false,
        visuals: false,
        audio: false
    });

    // Render State
    const [renderStatus, setRenderStatus] = useState<"IDLE" | "RENDERING" | "DONE" | "ERROR">("IDLE");
    const [renderProgress, setRenderProgress] = useState<number>(0);
    const [renderUrl, setRenderUrl] = useState<string | null>(null);

    const [scriptData, setScriptData] = useState<any>(null);
    const [renderedScenes, setRenderedScenes] = useState<any[]>([]);
    const [audioBase64, setAudioBase64] = useState<string | null>(null);

    // New State
    const [visualStyle, setVisualStyle] = useState<"MINIMAL" | "CINEMATIC">("MINIMAL");
    const [selectedVoice, setSelectedVoice] = useState<"Puck" | "Kore">("Kore");
    const [maxStepReached, setMaxStepReached] = useState<number>(1);

    const stepOrder = ["TOPIC", "SCRIPT", "STORYBOARD", "PREVIEW"];

    const updateMaxStep = (newStep: string) => {
        const newIndex = stepOrder.indexOf(newStep) + 1;
        if (newIndex > maxStepReached) {
            setMaxStepReached(newIndex);
        }
        setStep(newStep as any);
    };

    async function handleGenerateScript() {
        if (!input) return;
        setLoadingState(prev => ({ ...prev, script: true }));
        const res = await createScriptAction(input);
        setLoadingState(prev => ({ ...prev, script: false }));

        if (res.success) {
            setScriptData(res.script);
            // Invalidate downstream assets if regenerating
            setRenderedScenes([]);
            setAudioBase64(null);
            setMaxStepReached(2);
            setStep("SCRIPT");
        }
    }

    async function handleRenderVisuals() {
        setLoadingState(prev => ({ ...prev, visuals: true }));
        const res = await renderStoryboardAction(scriptData.scenes, visualStyle);
        setLoadingState(prev => ({ ...prev, visuals: false }));

        if (res.success && res.scenes) {
            setRenderedScenes(res.scenes);
            // Invalidate audio if visuals changed (though audio depends on text, this is a linear flow)
            setAudioBase64(null);
            updateMaxStep("STORYBOARD");
        }
    }

    async function handleGenerateAudio() {
        setLoadingState(prev => ({ ...prev, audio: true }));
        const fullScript = scriptData.scenes.map((s: any) => s.text).join(". ");
        const res = await generateAudioAction(fullScript, selectedVoice);
        setLoadingState(prev => ({ ...prev, audio: false }));

        if (res.success && res.audio) {
            setAudioBase64(res.audio);
            updateMaxStep("PREVIEW");
        }
    }

    // ... (rest of memo calculation same as before) ...
    const remotionProps = useMemo(() => {
        if (!renderedScenes.length) return null;
        const scenes = renderedScenes.map(scene => {
            const wordCount = scene.text.split(' ').length;
            const durationInSeconds = Math.max(3, wordCount / 2.5);
            return {
                text: scene.text,
                imageUrl: scene.imageUrl,
                durationInFrames: Math.round(durationInSeconds * 30),
                overlays: scene.overlays || []
            };
        });
        const totalDuration = scenes.reduce((acc, s) => acc + s.durationInFrames, 0);
        return {
            scenes,
            audioUrl: audioBase64 || undefined,
            durationInFrames: totalDuration
        };
    }, [renderedScenes, audioBase64]);

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

                <div className="flex items-center gap-2 text-sm overflow-x-auto">
                    {stepOrder.map((s, i) => {
                        const stepNum = i + 1;
                        const isAccessible = stepNum <= maxStepReached;
                        const isActive = step === s;

                        return (
                            <div key={s} className="flex items-center">
                                <button
                                    onClick={() => isAccessible && setStep(s as any)}
                                    disabled={!isAccessible}
                                    className={cn(
                                        "px-3 py-1 rounded-full whitespace-nowrap transition-colors",
                                        isActive ? "bg-primary/20 text-primary font-medium" :
                                            isAccessible ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-700 cursor-not-allowed"
                                    )}
                                >
                                    {stepNum}. {s.charAt(0) + s.slice(1).toLowerCase()}
                                </button>
                                {i < stepOrder.length - 1 && <span className="text-zinc-700 mx-2">→</span>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step 1: Input */}
            {step === "TOPIC" && (
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
                    <div className="flex gap-4">
                        <button
                            onClick={handleGenerateScript}
                            disabled={loadingState.script || !input}
                            className="flex-1 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {loadingState.script ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
                            {scriptData ? "Regenerate Script" : "Generate Script"}
                        </button>

                        {/* Show Continue button if script already exists */}
                        {scriptData && (
                            <button
                                onClick={() => setStep("SCRIPT")}
                                className="px-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold transition-all border border-zinc-700"
                            >
                                Continue →
                            </button>
                        )}
                    </div>
                    {scriptData && <p className="text-xs text-orange-400 text-center">*Regenerating will overwrite your current script.</p>}
                </div>
            )}

            {/* Step 2: Script Review */}
            {step === "SCRIPT" && scriptData && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white">Review Script</h3>
                            <p className="text-xs text-zinc-400">Edit the text below to refine your script.</p>
                        </div>
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
                                    <textarea
                                        value={scene.text}
                                        onChange={(e) => {
                                            const newScenes = [...scriptData.scenes];
                                            newScenes[idx] = { ...scene, text: e.target.value };
                                            setScriptData({ ...scriptData, scenes: newScenes });
                                        }}
                                        className="w-full bg-transparent text-white text-lg font-medium border-none p-0 focus:ring-0 resize-none"
                                        rows={Math.max(2, Math.ceil(scene.text.length / 50))}
                                    />
                                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                                        <ImageIcon className="w-3 h-3" />
                                        <span>Visual Cue: {scene.visualCue}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex items-center justify-between">
                        <div>
                            <h4 className="text-white font-medium">Visual Style</h4>
                            <p className="text-xs text-zinc-400">Choose how your slides should look.</p>
                        </div>
                        <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                            <button
                                onClick={() => setVisualStyle("MINIMAL")}
                                className={cn("px-4 py-2 rounded-md text-sm font-medium transition-all", visualStyle === "MINIMAL" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300")}
                            >
                                Minimal (Text)
                            </button>
                            <button
                                onClick={() => setVisualStyle("CINEMATIC")}
                                className={cn("px-4 py-2 rounded-md text-sm font-medium transition-all", visualStyle === "CINEMATIC" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300")}
                            >
                                Cinematic (AI Images)
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setStep("TOPIC")}
                            className="px-6 py-3 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-white transition-all"
                        >
                            Back
                        </button>

                        <button
                            onClick={handleRenderVisuals}
                            disabled={loadingState.visuals}
                            className="flex-1 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {loadingState.visuals ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                            {renderedScenes.length > 0 ? "Regenerate Visuals" : `Render ${visualStyle === "CINEMATIC" ? "Cinematic" : "Minimal"} Storyboard`}
                        </button>

                        {renderedScenes.length > 0 && (
                            <button
                                onClick={() => setStep("STORYBOARD")}
                                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold transition-all border border-zinc-700"
                            >
                                Continue →
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Step 3: Visuals Preview */}
            {step === "STORYBOARD" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-lg font-bold text-white text-center">Your Storyboard</h3>
                    {/* ... (scene list skipped for brevity, keeping existing logic) ... */}
                    <div className="flex gap-4 overflow-x-auto pb-6 snap-x min-h-[550px]">
                        {renderedScenes.map((scene: any, idx: number) => {
                            const activeOverlays = scene.overlays || [];
                            const toggleOverlay = (id: string) => {
                                // Simplified for replacement block
                                const newScenes = [...renderedScenes];
                                const current = newScenes[idx].overlays || [];
                                newScenes[idx].overlays = current.includes(id) ? current.filter((o: any) => o !== id) : [...current, id];
                                setRenderedScenes(newScenes);
                            };

                            return (
                                <div key={idx} className="snap-center shrink-0 w-[300px] flex flex-col gap-2 relative">
                                    <div className="aspect-[9/16] bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative group">
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
                                                        const btn = document.getElementById(`regen-btn-${idx}`);
                                                        if (btn) (btn as HTMLButtonElement).click();
                                                    }
                                                }}
                                                className="p-2 bg-zinc-900/80 text-white rounded-full hover:bg-black border border-white/20 backdrop-blur-sm"
                                                title="Edit Text"
                                            >
                                                <ImageIcon className="w-4 h-4" />
                                            </button>

                                            {/* Overlays Menu */}
                                            <div className="relative group/menu">
                                                <button
                                                    className="p-2 bg-zinc-900/80 text-white rounded-full hover:bg-black border border-white/20 backdrop-blur-sm"
                                                    title="Add Overlays"
                                                >
                                                    <Layers className="w-4 h-4" />
                                                </button>

                                                {/* Hover Menu for Overlays */}
                                                <div className="absolute right-0 top-10 w-48 bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl p-2 z-50 invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all">
                                                    <p className="text-xs font-bold text-zinc-500 px-2 py-1 uppercase tracking-wider">Cinematic</p>
                                                    {["VIGNETTE", "FILM_GRAIN", "FLASH", "WATERMARK"].map(id => (
                                                        <button
                                                            key={id}
                                                            onClick={() => toggleOverlay(id)}
                                                            className={cn("w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between hover:bg-zinc-800", activeOverlays.includes(id) ? "text-primary" : "text-zinc-400")}
                                                        >
                                                            {id.replace(/_/g, " ")}
                                                            {activeOverlays.includes(id) && <Check className="w-3 h-3" />}
                                                        </button>
                                                    ))}
                                                    <div className="h-px bg-zinc-800 my-1" />
                                                    <p className="text-xs font-bold text-zinc-500 px-2 py-1 uppercase tracking-wider">Engagement</p>
                                                    {["SUBSCRIBE", "LIKE_EXPLOSION", "CONFETTI", "WAIT_FOR_IT", "LINK_IN_BIO"].map(id => (
                                                        <button
                                                            key={id}
                                                            onClick={() => toggleOverlay(id)}
                                                            className={cn("w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between hover:bg-zinc-800", activeOverlays.includes(id) ? "text-primary" : "text-zinc-400")}
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
                                        <p className="text-xs text-zinc-500 font-mono text-center">Scene {idx + 1}</p>
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
                                                if (btn) btn.innerText = "Regenerate";
                                            }}
                                            className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-400 rounded-lg transition-all"
                                        >
                                            Update Image
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>


                    <div className="flex items-center gap-4 pt-8 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                        {/* ... (Voice Select) ... */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-zinc-400">Select Voice</label>
                            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                                <button onClick={() => setSelectedVoice("Puck")} className={cn("px-4 py-2 rounded-md text-sm font-medium transition-all", selectedVoice === "Puck" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300")}>Male</button>
                                <button onClick={() => setSelectedVoice("Kore")} className={cn("px-4 py-2 rounded-md text-sm font-medium transition-all", selectedVoice === "Kore" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300")}>Female</button>
                            </div>
                        </div>

                        <div className="flex-1 flex items-center gap-4 justify-end">
                            <button
                                onClick={() => setStep("SCRIPT")}
                                className="px-6 py-3 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-white transition-all"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleGenerateAudio}
                                disabled={loadingState.audio}
                                className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                {loadingState.audio ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                                {audioBase64 ? "Regenerate Audio" : "Generate Audio & Preview"}
                            </button>

                            {audioBase64 && (
                                <button
                                    onClick={() => setStep("PREVIEW")}
                                    className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold transition-all border border-zinc-700"
                                >
                                    Continue →
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Step 4: Video Preview */}
            {step === "PREVIEW" && remotionProps && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 text-center">
                    {/* ... (Video Player Logic) ... */}
                    <div className="bg-zinc-950 p-4 rounded-xl inline-block w-full max-w-sm mx-auto border border-zinc-800">
                        <h3 className="text-white font-bold mb-4">Final Output</h3>
                        <div className="aspect-[9/16] bg-black rounded-lg overflow-hidden">
                            <Player
                                component={ShortsComposition}
                                inputProps={{ scenes: remotionProps.scenes, audioUrl: remotionProps.audioUrl }}
                                durationInFrames={remotionProps.durationInFrames}
                                fps={30}
                                compositionWidth={1080}
                                compositionHeight={1920}
                                style={{ width: '100%', height: '100%' }}
                                controls
                            />
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => {
                                setStep("TOPIC");
                                setMaxStepReached(1);
                                setScriptData(null);
                                setRenderedScenes([]);
                                setAudioBase64(null);
                                setInput("");
                            }}
                            className="px-6 py-3 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-white transition-all"
                        >
                            Start New
                        </button>

                        <button
                            onClick={handleGenerateAudio}
                            disabled={loadingState.audio}
                            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            {loadingState.audio ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                            Regenerate Audio
                        </button>

                        {audioBase64 && (
                            <a
                                href={`data:audio/wav;base64,${audioBase64}`}
                                download="micropost-voiceover.wav"
                                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold flex items-center gap-2 transition-all"
                            >
                                <Download className="w-5 h-5" />
                                Download Audio
                            </a>
                        )}
                        <button
                            onClick={async () => {
                                if (!remotionProps) return;
                                setRenderStatus("RENDERING");
                                setRenderProgress(0);

                                try {
                                    const { renderVideoAction } = await import("@/app/actions/render-video");
                                    const { getRenderStatusAction } = await import("@/app/actions/render-status");

                                    const res = await renderVideoAction(remotionProps.scenes, remotionProps.audioUrl);

                                    if (res.success && res.renderId && res.bucketName) {
                                        const renderId = res.renderId;
                                        const bucketName = res.bucketName;

                                        // Poll for status
                                        const interval = setInterval(async () => {
                                            try {
                                                const statusRes = await getRenderStatusAction(renderId, bucketName);

                                                if (statusRes.success) {
                                                    if (statusRes.status === "done" && statusRes.url) {
                                                        clearInterval(interval);
                                                        setRenderStatus("DONE");
                                                        setRenderUrl(statusRes.url);
                                                    } else if (statusRes.status === "rendering") {
                                                        setRenderProgress(Math.round((statusRes.progress || 0) * 100));
                                                    } else if (statusRes.status === "error") {
                                                        clearInterval(interval);
                                                        setRenderStatus("ERROR");
                                                        console.error("Render failed:", statusRes.error);
                                                        alert(`Render failed: ${statusRes.error}`);
                                                    }
                                                } else {
                                                    // Network or server action error
                                                    clearInterval(interval);
                                                    setRenderStatus("ERROR");
                                                    console.error("Status check failed:", statusRes.error);
                                                    // Don't alert for every status check failure continuously
                                                }
                                            } catch (pollErr) {
                                                clearInterval(interval);
                                                console.error("Polling error:", pollErr);
                                                setRenderStatus("ERROR");
                                            }
                                        }, 2000);
                                    } else {
                                        setRenderStatus("ERROR");
                                        alert("Failed to start render");
                                    }
                                } catch (e) {
                                    console.error("Render trigger error:", e);
                                    setRenderStatus("ERROR");
                                    alert("Failed to trigger render");
                                }
                            }}
                            disabled={renderStatus === "RENDERING"}
                            className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            {renderStatus === "RENDERING" ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Rendering {renderProgress}%
                                </>
                            ) : (
                                <>
                                    <Video className="w-5 h-5" />
                                    {renderStatus === "DONE" ? "Render New MP4" : "Render MP4"}
                                </>
                            )}
                        </button>

                        {renderStatus === "DONE" && renderUrl && (
                            <a
                                href={renderUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold flex items-center gap-2 transition-all animate-in fade-in slide-in-from-left-4"
                            >
                                <Download className="w-5 h-5" />
                                Download MP4
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

