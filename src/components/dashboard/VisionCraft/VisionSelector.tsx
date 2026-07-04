"use client";

import React, { useState } from "react";
import { Image, Quote, Camera, Loader2, Sparkles, Wand2, StickyNote, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { generateVisionAction } from "@/app/actions/image";


interface VisionSelectorProps {
    postContent: string;
    platform: "TWITTER" | "LINKEDIN" | "THREADS";
    onImageSelect: (imageUrl: string) => void;
}

type VisionType = "SNAP" | "QUOTE" | "HOOK" | "NOTE";

export function VisionSelector({ postContent, platform, onImageSelect }: VisionSelectorProps) {
    const [loading, setLoading] = useState<VisionType | null>(null);
    const [generatedImages, setGeneratedImages] = useState<Record<VisionType, string | null>>({
        SNAP: null,
        QUOTE: null,
        HOOK: null,
        NOTE: null
    });

    // Zen Note Customization
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [noteText, setNoteText] = useState(postContent);

    const handleGenerate = async (type: VisionType, customContent?: string) => {
        setLoading(type);
        try {
            // Use custom content if provided (for Note), otherwise default postContent
            const contentToUse = customContent || postContent;

            const result = await generateVisionAction(type, contentToUse, platform);

            if (result) {
                setGeneratedImages(prev => ({ ...prev, [type]: result }));
                // Trigger callback so parent knows an image is ready
                onImageSelect(result);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(null);
            setIsEditingNote(false);
        }
    };

    return (
        <div className="space-y-4 rounded-xl border border-outline-variant bg-surface-variant/50 p-6 relative">
            <div className="flex items-center gap-2 mb-4">
                <Wand2 className="text-purple-400" size={20} />
                <h3 className="text-lg font-semibold text-on-surface">VisionCraft</h3>
                <span className="text-xs text-on-surface-variant bg-surface-variant px-2 py-1 rounded-full">Auto-Visuals</span>
            </div>

            {/* Note Editor Overlay */}
            {isEditingNote && (
                <div className="absolute inset-0 z-50 bg-surface/95 backdrop-blur-sm rounded-xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                        <h4 className="text-on-surface font-medium flex items-center gap-2">
                            <StickyNote size={16} />
                            Customize Note
                        </h4>
                        <button onClick={() => setIsEditingNote(false)} className="text-on-surface-variant hover:text-on-surface">✕</button>
                    </div>
                    <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="flex-1 bg-surface-variant border border-outline-variant rounded-lg p-3 text-on-surface text-sm resize-none focus:outline-none focus:border-primary/50"
                        placeholder="Write your note..."
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="text" size="sm" onClick={() => setIsEditingNote(false)}>Cancel</Button>
                        <Button size="sm" onClick={() => handleGenerate("NOTE", noteText)}>
                            {loading === "NOTE" && <Loader2 className="animate-spin mr-2" size={14} />}
                            Generate Note
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Option A: Social Snap */}
                <Card
                    title="Social Snap"
                    icon={Camera}
                    desc="Authentic screenshot"
                    image={generatedImages.SNAP}
                    loading={loading === "SNAP"}
                    onClick={() => handleGenerate("SNAP")}
                    onSelect={() => onImageSelect(generatedImages.SNAP!)}
                />

                {/* Option B: Pull Quote */}
                <Card
                    title="Pull Quote"
                    icon={Quote}
                    desc="High-impact type"
                    image={generatedImages.QUOTE}
                    loading={loading === "QUOTE"}
                    onClick={() => handleGenerate("QUOTE")}
                    onSelect={() => onImageSelect(generatedImages.QUOTE!)}
                />

                {/* Option C: Zen Note */}
                <Card
                    title="Zen Note"
                    icon={StickyNote}
                    desc="Minimalist note"
                    image={generatedImages.NOTE}
                    loading={loading === "NOTE"}
                    onClick={() => setIsEditingNote(true)}
                    onSelect={() => onImageSelect(generatedImages.NOTE!)}
                    hasEdit={true}
                    onEdit={() => setIsEditingNote(true)}
                />

                {/* Option D: Visual Hook */}
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

function Card({ title, icon: Icon, desc, image, loading, onClick, onSelect, hasEdit, onEdit }: any) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-variant/30 transition-all hover:border-outline">
            {image ? (
                <div className="relative aspect-video w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button size="sm" onClick={onSelect} className="bg-inverse-surface text-inverse-on-surface hover:bg-inverse-surface/80 h-8 text-xs">
                            Use
                        </Button>
                        {hasEdit && (
                            <Button size="icon" onClick={(e) => { e.stopPropagation(); onEdit(); }} className="bg-white/20 text-white hover:bg-white/30 h-8 w-8">
                                <Pencil size={12} />
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div
                    onClick={onClick}
                    className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 text-on-surface-variant transition-colors hover:bg-surface-variant/50 hover:text-on-surface"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Icon size={24} />}
                    <span className="text-xs font-medium">Generate</span>
                </div>
            )}

            <div className="p-3">
                <div className="flex items-center gap-2 font-medium text-on-surface text-sm">
                    <Icon size={14} className="text-on-surface-variant" />
                    {title}
                </div>
                <p className="text-[10px] text-on-surface-variant">{desc}</p>
            </div>
        </div>
    );
}
