"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/Textarea";
import { Sparkles, Wand2 } from "lucide-react";
import { triggerManualGeneration } from "@/lib/actions";

export function GenerationWizard() {
    const [isOpen, setIsOpen] = useState(false);
    const [thoughts, setThoughts] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        // We'll pass thoughts to the server action
        // Note: We need to update triggerManualGeneration to accept thoughts
        // Since we can't easily pass args to server actions in form action prop directly without binding,
        // we'll wrap it.
        const formData = new FormData();
        formData.append("thoughts", thoughts);

        try {
            await triggerManualGeneration(formData); // We need to update this signature or handling
            setIsOpen(false);
            setThoughts("");
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
                    <Button onClick={handleGenerate} disabled={isGenerating}>
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
