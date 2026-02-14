"use client";

import { useState } from "react";
import { Loader2, Volume2, Download, Video } from "lucide-react";
import { Player } from "@remotion/player";
import { ShortsComposition } from "@/remotion/Composition";

interface VideoPreviewProps {
    remotionProps: {
        scenes: any[];
        audioUrl?: string;
        durationInFrames: number;
    };
    handleGenerateAudio: () => void;
    loading: boolean;
    audioBase64: string | null;
    onStartNew: () => void;
}

export function VideoPreview({
    remotionProps,
    handleGenerateAudio,
    loading,
    audioBase64,
    onStartNew
}: VideoPreviewProps) {
    const [renderStatus, setRenderStatus] = useState<"IDLE" | "RENDERING" | "DONE" | "ERROR">("IDLE");
    const [renderProgress, setRenderProgress] = useState<number>(0);
    const [renderUrl, setRenderUrl] = useState<string | null>(null);

    const handleRenderVideo = async () => {
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
                        }
                    } catch (pollErr) {
                        clearInterval(interval);
                        console.error("Polling error:", pollErr);
                        setRenderStatus("ERROR");
                    }
                }, 15000);
            } else {
                setRenderStatus("ERROR");
                alert("Failed to start render");
            }
        } catch (e) {
            console.error("Render trigger error:", e);
            setRenderStatus("ERROR");
            alert("Failed to trigger render");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 text-center">
            {/* Video Player */}
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
                    onClick={onStartNew}
                    className="px-6 py-3 rounded-full border border-outline-variant/20 hover:bg-surface-variant/30 text-on-surface transition-all"
                >
                    Start New
                </button>

                <button
                    onClick={handleGenerateAudio}
                    disabled={loading}
                    className="px-6 py-3 bg-surface-variant/50 hover:bg-surface-variant text-on-surface rounded-full font-bold flex items-center gap-2 transition-all disabled:opacity-50 border border-outline-variant/10"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
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
                    onClick={handleRenderVideo}
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
    );
}
