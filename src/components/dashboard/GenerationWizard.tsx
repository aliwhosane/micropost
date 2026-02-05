"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/Dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Sparkles, Wand2 } from "lucide-react";
import { triggerManualGeneration } from "@/lib/actions";

export function GenerationWizard() {
    const [isOpen, setIsOpen] = useState(false);
    const [thoughts, setThoughts] = useState("");
    const [framework, setFramework] = useState("");
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["TWITTER", "LINKEDIN", "THREADS"]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handlePlatformToggle = (platform: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        );
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        // We'll pass thoughts to the server action
        // Note: We need to update triggerManualGeneration to accept thoughts
        // Since we can't easily pass args to server actions in form action prop directly without binding,
        // we'll wrap it.
        const formData = new FormData();
        formData.append("thoughts", thoughts);
        formData.append("framework", framework);
        formData.append("platforms", JSON.stringify(selectedPlatforms));

        try {
            await triggerManualGeneration(formData); // We need to update this signature or handling
            setIsOpen(false);
            setThoughts("");
            setFramework("");
            // Reset platforms to default or keep user selection? Let's reset to all for fresh start.
            setSelectedPlatforms(["TWITTER", "LINKEDIN", "THREADS"]);
        } catch (error) {
            console.error("Generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="tonal" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                    Generate New Posts <Sparkles className="ml-2 h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5 text-primary" />
                        Generate Content
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-surface-variant/30 p-4 rounded-lg">
                        <label className="text-sm font-medium text-on-surface mb-3 block">
                            Target Platforms
                        </label>
                        <div className="flex gap-4">
                            {["TWITTER", "LINKEDIN", "THREADS"].map((platform) => (
                                <label key={platform} className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`
                                        w-5 h-5 rounded border flex items-center justify-center transition-colors
                                        ${selectedPlatforms.includes(platform)
                                            ? "bg-primary border-primary text-on-primary"
                                            : "border-outline text-transparent group-hover:border-primary"
                                        }
                                    `}>
                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={selectedPlatforms.includes(platform)}
                                        onChange={() => handlePlatformToggle(platform)}
                                    />
                                    <span className="text-sm font-medium text-on-surface capitalize">
                                        {platform.toLowerCase()}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-surface-variant/30 p-4 rounded-lg">
                        <label className="text-sm font-medium text-on-surface mb-2 block">
                            Choose a Framework
                        </label>
                        <Select value={framework} onValueChange={setFramework}>
                            <SelectTrigger className="w-full bg-surface">
                                <SelectValue placeholder="Select a framework (Optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">None (Freeform)</SelectItem>
                                <SelectItem value="PAS">PAS (Problem-Agitate-Solution)</SelectItem>
                                <SelectItem value="AIDA">AIDA (Attention-Interest-Desire-Action)</SelectItem>
                                <SelectItem value="BAB">BAB (Before-After-Bridge)</SelectItem>
                                <SelectItem value="STORYTELLING">Micro-Storytelling</SelectItem>
                                <SelectItem value="CONTRARIAN">Contrarian</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-on-surface-variant mt-2">
                            Give your post a proven structure for higher engagement.
                        </p>
                    </div>

                    <div className="bg-surface-variant/30 p-4 rounded-lg">
                        <label className="text-sm font-medium text-on-surface mb-2 block">
                            (Optional) What's on your mind right now?
                        </label>
                        <Textarea
                            placeholder="E.g. 'I just read an article about Vercel v0, let's talk about AI coding tools today.'"
                            className="bg-surface resize-none h-24"
                            value={thoughts}
                            onChange={(e) => setThoughts(e.target.value)}
                        />
                        <p className="text-xs text-on-surface-variant mt-2">
                            This will override your standard topic notes for this generation only.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="text" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleGenerate} disabled={isGenerating || selectedPlatforms.length === 0}>
                        {isGenerating ? (
                            <>Generating...</>
                        ) : (
                            <><Sparkles className="mr-2 h-4 w-4" /> Generate Now</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
