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
        } else {
            console.error("Render Visuals Error:", res.error);
            alert(`Failed to render visuals: ${res.error || "Unknown error"}`);
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
        <div className="w-full max-w-4xl mx-auto p-6 bg-surface border border-outline-variant/50 rounded-[2rem] space-y-8 min-h-[600px] shadow-sm">
            {/* Progress Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/50 pb-4">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-2xl text-primary">
                        <Clapperboard className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-on-surface">ShortsMaker</h2>
                        <p className="text-sm text-on-surface-variant">Text to Vertical Video Script</p>
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
                                        isActive ? "bg-primary/20 text-primary font-bold" :
                                            isAccessible ? "text-on-surface-variant hover:text-on-surface" : "text-on-surface-variant/50 cursor-not-allowed"
                                    )}
                                >
                                    {stepNum}. {s.charAt(0) + s.slice(1).toLowerCase()}
                                </button>
                                {i < stepOrder.length - 1 && <span className="text-on-surface-variant/50 mx-2">→</span>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step 1: Input */}
            {step === "TOPIC" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-on-surface-variant">What is your video about?</label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Example: 3 tips for staying productive while working from home..."
                            className="w-full h-40 bg-surface-variant/30 border border-transparent rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all placeholder:text-on-surface-variant/50"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleGenerateScript}
                            disabled={loadingState.script || !input}
                            className="flex-1 py-4 bg-primary hover:bg-primary/90 text-on-primary rounded-full font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md hover:shadow-lg hover:shadow-primary/25"
                        >
                            {loadingState.script ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
                            {scriptData ? "Regenerate Script" : "Generate Script"}
                        </button>

                        {/* Show Continue button if script already exists */}
                        {scriptData && (
                            <button
                                onClick={() => setStep("SCRIPT")}
                                className="px-8 py-4 bg-surface-variant/50 hover:bg-surface-variant text-on-surface rounded-full font-bold transition-all border border-outline-variant/10"
                            >
                                Continue →
                            </button>
                        )}
                    </div>
                    {scriptData && <p className="text-xs text-tertiary text-center">*Regenerating will overwrite your current script.</p>}
                </div>
            )}

            {/* Step 2: Script Review */}
            {step === "SCRIPT" && scriptData && (
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
                            onClick={() => setStep("TOPIC")}
                            className="px-6 py-3 rounded-full border border-outline-variant/20 hover:bg-surface-variant/30 text-on-surface transition-all"
                        >
                            Back
                        </button>

                        <button
                            onClick={handleRenderVisuals}
                            disabled={loadingState.visuals}
                            className="flex-1 py-3 bg-primary hover:bg-primary/90 text-on-primary rounded-full font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md hover:shadow-primary/25"
                        >
                            {loadingState.visuals ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                            {renderedScenes.length > 0 ? "Regenerate Visuals" : `Render ${visualStyle === "CINEMATIC" ? "Cinematic" : "Minimal"} Storyboard`}
                        </button>

                        {renderedScenes.length > 0 && (
                            <button
                                onClick={() => setStep("STORYBOARD")}
                                className="px-6 py-3 bg-surface-variant/50 hover:bg-surface-variant text-on-surface rounded-full font-bold transition-all border border-outline-variant/10"
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
                    <h3 className="text-lg font-bold text-on-surface text-center">Your Storyboard</h3>
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
                                                            onClick={() => toggleOverlay(id)}
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
                                                            onClick={() => toggleOverlay(id)}
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
                                                if (btn) btn.innerText = "Regenerate";
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
                        {/* ... (Voice Select) ... */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-on-surface-variant">Select Voice</label>
                            <div className="flex bg-surface p-1 rounded-xl border border-outline-variant/10">
                                <button onClick={() => setSelectedVoice("Puck")} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", selectedVoice === "Puck" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface")}>Male</button>
                                <button onClick={() => setSelectedVoice("Kore")} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", selectedVoice === "Kore" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface")}>Female</button>
                            </div>
                        </div>

                        <div className="flex-1 flex items-center gap-4 justify-end">
                            <button
                                onClick={() => setStep("SCRIPT")}
                                className="px-6 py-3 rounded-full border border-outline-variant/20 hover:bg-surface-variant/30 text-on-surface transition-all"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleGenerateAudio}
                                disabled={loadingState.audio}
                                className="px-8 py-3 bg-primary hover:bg-primary/90 text-on-primary rounded-full font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md hover:shadow-primary/25"
                            >
                                {loadingState.audio ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                                {audioBase64 ? "Regenerate Audio" : "Generate Audio & Preview"}
                            </button>

                            {audioBase64 && (
                                <button
                                    onClick={() => setStep("PREVIEW")}
                                    className="px-6 py-3 bg-surface-variant/50 hover:bg-surface-variant text-on-surface rounded-full font-bold transition-all border border-outline-variant/10"
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
                    <div className="bg-surface-variant/30 p-4 rounded-3xl inline-block w-full max-w-sm mx-auto border border-outline-variant/10 shadow-lg">
                        <h3 className="text-on-surface font-bold mb-4">Final Output</h3>
                        <div className="aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-inner">
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

                    <div className="flex justify-center gap-4 flex-wrap">
                        <button
                            onClick={() => {
                                setStep("TOPIC");
                                setMaxStepReached(1);
                                setScriptData(null);
                                setRenderedScenes([]);
                                setAudioBase64(null);
                                setInput("");
                            }}
                            className="px-6 py-3 rounded-full border border-outline-variant/20 hover:bg-surface-variant/30 text-on-surface transition-all"
                        >
                            Start New
                        </button>

                        <button
                            onClick={handleGenerateAudio}
                            disabled={loadingState.audio}
                            className="px-6 py-3 bg-surface-variant/50 hover:bg-surface-variant text-on-surface rounded-full font-bold flex items-center gap-2 transition-all disabled:opacity-50 border border-outline-variant/10"
                        >
                            {loadingState.audio ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                            Regenerate Audio
                        </button>

                        {audioBase64 && (
                            <a
                                href={`data:audio/wav;base64,${audioBase64}`}
                                download="micropost-voiceover.wav"
                                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-green-500/25"
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

                                    const res = await renderVideoAction(
                                        remotionProps.scenes,
                                        remotionProps.audioUrl,
                                        remotionProps.durationInFrames
                                    );

                                    if (res.success && res.renderId && res.bucketName) {
                                        const renderId = res.renderId;
                                        const bucketName = res.bucketName;

                                        // Poll for status
                                        const interval = setInterval(async () => {
                                            try {
                                                const statusRes = await getRenderStatusAction(renderId, bucketName);

                                                console.log("Poll Status:", statusRes);
                                                if (statusRes.success) {
                                                    if (statusRes.status === "done") {
                                                        clearInterval(interval);
                                                        setRenderStatus("DONE");
                                                        if (statusRes.url) {
                                                            setRenderUrl(statusRes.url);
                                                        } else {
                                                            console.error("Render done but no URL found");
                                                            alert("Render completed but video URL is missing.");
                                                        }
                                                    } else if (statusRes.status === "rendering" || !statusRes.done) {
                                                        // Remotion sometimes returns status="rendering" or just done=false
                                                        setRenderProgress(Math.round((statusRes.progress || 0) * 100));
                                                    } else if (statusRes.status === "error" || statusRes.fatalErrorEncountered) {
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
                            className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-md hover:shadow-purple-500/25"
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
                                className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold flex items-center gap-2 transition-all animate-in fade-in slide-in-from-left-4 shadow-md hover:shadow-green-500/25"
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

