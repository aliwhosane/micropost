"use client";

import { useState, useMemo } from "react";
import { createScriptAction, renderStoryboardAction, generateAudioAction } from "@/app/actions/shorts";
import { Clapperboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { TopicInput } from "./wizard/TopicInput";
import { ScriptReview } from "./wizard/ScriptReview";
import { StoryboardReview } from "./wizard/StoryboardReview";
import { VideoPreview } from "./wizard/VideoPreview";

export function ScriptWizard({ initialContent }: { initialContent?: string }) {
    const [step, setStep] = useState<"TOPIC" | "SCRIPT" | "STORYBOARD" | "PREVIEW">("TOPIC");
    const [input, setInput] = useState(initialContent || "");

    // Granular Loading States
    const [loadingState, setLoadingState] = useState({
        script: false,
        visuals: false,
        audio: false
    });

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
                <TopicInput
                    input={input}
                    setInput={setInput}
                    handleGenerateScript={handleGenerateScript}
                    loading={loadingState.script}
                    hasScriptData={!!scriptData}
                    onNext={() => setStep("SCRIPT")}
                />
            )}

            {/* Step 2: Script Review */}
            {step === "SCRIPT" && scriptData && (
                <ScriptReview
                    scriptData={scriptData}
                    setScriptData={setScriptData}
                    visualStyle={visualStyle}
                    setVisualStyle={setVisualStyle}
                    loading={loadingState.visuals}
                    handleRenderVisuals={handleRenderVisuals}
                    hasRenderedScenes={renderedScenes.length > 0}
                    onBack={() => setStep("TOPIC")}
                    onNext={() => setStep("STORYBOARD")}
                />
            )}

            {/* Step 3: Visuals Preview */}
            {step === "STORYBOARD" && (
                <StoryboardReview
                    renderedScenes={renderedScenes}
                    setRenderedScenes={setRenderedScenes}
                    selectedVoice={selectedVoice}
                    setSelectedVoice={setSelectedVoice}
                    loading={loadingState.audio}
                    handleGenerateAudio={handleGenerateAudio}
                    hasAudio={!!audioBase64}
                    visualStyle={visualStyle}
                    onBack={() => setStep("SCRIPT")}
                    onNext={() => setStep("PREVIEW")}
                />
            )}

            {/* Step 4: Video Preview */}
            {step === "PREVIEW" && remotionProps && (
                <VideoPreview
                    remotionProps={remotionProps}
                    handleGenerateAudio={handleGenerateAudio}
                    loading={loadingState.audio}
                    audioBase64={audioBase64}
                    onStartNew={() => {
                        setStep("TOPIC");
                        setMaxStepReached(1);
                        setScriptData(null);
                        setRenderedScenes([]);
                        setAudioBase64(null);
                        setInput("");
                    }}
                />
            )}
        </div>
    );
}
