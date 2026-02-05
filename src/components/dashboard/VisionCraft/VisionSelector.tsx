"use client";

import React, { useState } from "react";
import { Image, Quote, Camera, Loader2, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { generateVisionAction } from "@/app/actions/image";


interface VisionSelectorProps {
    postContent: string;
    platform: "TWITTER" | "LINKEDIN" | "THREADS";
    onImageSelect: (imageUrl: string) => void;
}

type VisionType = "SNAP" | "QUOTE" | "HOOK";

export function VisionSelector({ postContent, platform, onImageSelect }: VisionSelectorProps) {
    const [loading, setLoading] = useState<VisionType | null>(null);
    const [generatedImages, setGeneratedImages] = useState<Record<VisionType, string | null>>({
        SNAP: null,
        QUOTE: null,
        HOOK: null
    });

    const handleGenerate = async (type: VisionType) => {
        setLoading(type);
        try {
            const result = await generateVisionAction(type, postContent, platform);

            if (result) {
                setGeneratedImages(prev => ({ ...prev, [type]: result }));
                // Trigger callback so parent knows an image is ready (e.g. to attach to post)
                onImageSelect(result);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Wand2 className="text-purple-400" size={20} />
                <h3 className="text-lg font-semibold text-white">VisionCraft</h3>
                <span className="text-xs text-zinc-400 bg-white/5 px-2 py-1 rounded-full">Auto-Visuals</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Option A: Social Snap */}
                <Card
                    title="Social Snap"
                    icon={Camera}
                    desc="Authentic screenshot look"
                    image={generatedImages.SNAP}
                    loading={loading === "SNAP"}
                    onClick={() => handleGenerate("SNAP")}
                    onSelect={() => onImageSelect(generatedImages.SNAP!)}
                />

                {/* Option B: Pull Quote */}
                <Card
                    title="Pull Quote"
                    icon={Quote}
                    desc="High-impact typography"
                    image={generatedImages.QUOTE}
                    loading={loading === "QUOTE"}
                    onClick={() => handleGenerate("QUOTE")}
                    onSelect={() => onImageSelect(generatedImages.QUOTE!)}
                />

                {/* Option C: Visual Hook */}
                <Card
                    title="Visual Hook"
                    icon={Sparkles}
                    desc="AI-generated art"
                    image={generatedImages.HOOK}
                    loading={loading === "HOOK"}
                    onClick={() => handleGenerate("HOOK")}
                    onSelect={() => onImageSelect(generatedImages.HOOK!)}
                />
            </div>
        </div>
    );
}

function Card({ title, icon: Icon, desc, image, loading, onClick, onSelect }: any) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border border-white/10 bg-black/20 transition-all hover:border-white/20">
            {image ? (
                <div className="relative aspect-video w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button size="sm" onClick={onSelect} className="bg-white text-black hover:bg-zinc-200">
                            Use This
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={onClick}
                    className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Icon size={32} />}
                    <span className="text-xs font-medium">Generate</span>
                </div>
            )}

            <div className="p-3">
                <div className="flex items-center gap-2 font-medium text-white">
                    <Icon size={14} className="text-zinc-400" />
                    {title}
                </div>
                <p className="text-xs text-zinc-500">{desc}</p>
            </div>
        </div>
    );
}
