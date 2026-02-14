"use client";

import { useState, useRef, useEffect } from "react";
import {
    Sparkles,
    Send,
    Twitter,
    Linkedin,
    AtSign,
    ChevronDown,
    Wand2,
    Palette
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/utils";
import { triggerManualGeneration } from "@/lib/actions";
import { useClient } from "@/components/dashboard/ClientSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const TEMPLATES = [
    {
        id: "launch",
        label: "🚀 Launching a new feature",
        template: (name: string) => `We just shipped [Feature Name]! 🚀\n\nIt helps [Target Audience] to [Benefit].\n\nThe best part? It allows you to [Specific Action].\n\nGive it a spin and let me know what you think!`
    },
    {
        id: "insight",
        label: "💡 Share an industry insight",
        template: (name: string) => `I've been noticing a trend in [Industry]: [Trend Observation].\n\nIt's interesting because [Reason].\n\nWhat are your thoughts on this?`
    },
    {
        id: "intro",
        label: "👋 Introduce myself",
        template: (name: string) => `Hi, I'm ${name || "[Name]"}. 👋\n\nI'm building [Project/Company] to help [Target Audience] with [Problem].\n\nI'm passionate about [Interest].\n\nConnect with me for [Type of Content]!`
    }
];

export function MagicComposer({ isHero = false, userName = "" }: { isHero?: boolean; userName?: string }) {
    const { activeClientId } = useClient();
    const [thoughts, setThoughts] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Configuration State
    const [platforms, setPlatforms] = useState(["TWITTER", "LINKEDIN", "THREADS"]);
    const [tone, setTone] = useState("Professional");
    const [framework, setFramework] = useState("");

    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleFocus = () => setIsExpanded(true);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            // Check if click is inside the main container
            if (containerRef.current && containerRef.current.contains(target)) {
                return;
            }

            // Check if click is inside a dropdown/popover (Radix UI portals usually have role="menu")
            if (target.closest('[role="menu"]') || target.closest('[role="dialog"]')) {
                return;
            }

            setIsExpanded(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const togglePlatform = (p: string) => {
        setPlatforms(prev =>
            prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
        );
    };

    const handleGenerate = async () => {
        if (!thoughts.trim()) return;

        setIsGenerating(true);
        const formData = new FormData();
        formData.append("thoughts", thoughts);
        formData.append("framework", framework);
        if (activeClientId) formData.append("clientId", activeClientId);
        formData.append("platforms", JSON.stringify(platforms));

        try {
            const results = await triggerManualGeneration(formData);

            // basic check if anything was generated
            const count = results.reduce((acc: number, r: any) => acc + (r.count || 0), 0);

            if (count > 0) {
                toast.success(`Generated ${count} new posts! Redirecting...`);
                setThoughts("");
                setIsExpanded(false);
                router.push("/dashboard/posts");
            } else {
                toast.error("No posts were generated. Check your account connections and limits.");
            }
        } catch (error) {
            console.error("Generation failed", error);
            toast.error("Failed to generate posts. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            handleGenerate();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [thoughts]);

    return (
        <motion.div
            ref={containerRef}
            initial={isHero ? { scale: 0.9, opacity: 0 } : false}
            animate={isHero ? { scale: 1, opacity: 1 } : false}
            className={cn(
                "w-full transition-all duration-500 ease-out relative z-20",
                isHero ? "max-w-2xl mx-auto py-10" : "mb-8"
            )}
        >
            <Card className={cn(
                "overflow-hidden border-2 transition-all duration-300",
                isExpanded ? "border-primary/50 shadow-lg ring-4 ring-primary/5" : "border-outline shadow-sm hover:border-outline-variant",
                "bg-surface"
            )}>
                <div className="p-4">
                    <Textarea
                        ref={textareaRef}
                        placeholder={isHero ? "What do you want to create today?" : "Draft a new post..."}
                        className={cn(
                            "resize-none border-0 focus-visible:ring-0 px-0 py-2 text-lg bg-transparent placeholder:text-on-surface-variant/50 max-h-[300px] overflow-y-auto",
                            isHero ? "text-2xl min-h-[60px]" : "min-h-[40px]"
                        )}
                        value={thoughts}
                        onChange={(e) => setThoughts(e.target.value)}
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                    />

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-4 flex flex-wrap gap-4 items-center justify-between border-t border-outline/10 mt-2">

                                    {/* Left Controls */}
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        {/* Platform Toggles */}
                                        <div className="flex bg-surface-variant/10 rounded-lg p-0.5 border border-outline/20">
                                            {[
                                                { id: "TWITTER", icon: Twitter },
                                                { id: "LINKEDIN", icon: Linkedin },
                                                { id: "THREADS", icon: AtSign }
                                            ].map(p => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => togglePlatform(p.id)}
                                                    className={cn(
                                                        "p-1.5 rounded-md transition-all",
                                                        platforms.includes(p.id)
                                                            ? "bg-surface text-primary shadow-sm"
                                                            : "text-on-surface-variant hover:text-on-surface"
                                                    )}
                                                    title={p.id}
                                                >
                                                    <p.icon className="w-4 h-4" />
                                                </button>
                                            ))}
                                        </div>

                                        {/* Tone Selector */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 gap-2 text-on-surface-variant">
                                                    <Palette className="w-3.5 h-3.5" />
                                                    {tone}
                                                    <ChevronDown className="w-3 h-3 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                {["Professional", "Casual", "Witty", "Storyteller", "Contrarian"].map(t => (
                                                    <DropdownMenuItem key={t} onClick={() => setTone(t)}>
                                                        {t}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        {/* Framework Selector */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 gap-2 text-on-surface-variant">
                                                    <Wand2 className="w-3.5 h-3.5" />
                                                    {framework || "Framework"}
                                                    <ChevronDown className="w-3 h-3 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => setFramework("")}>None</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setFramework("PAS")}>Problem-Agitate-Solution</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setFramework("AIDA")}>AIDA</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setFramework("BAB")}>Before-After-Bridge</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        onClick={handleGenerate}
                                        disabled={isGenerating || !thoughts.trim() || platforms.length === 0}
                                        className={cn(
                                            "rounded-full transition-all duration-300",
                                            isHero ? "px-8 py-6 text-lg" : ""
                                        )}
                                    >
                                        {isGenerating ? (
                                            <>Generating...</>
                                        ) : (
                                            <>
                                                Generate <Send className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Card>


            {/* Quick Prompts (Only in Hero Mode) */}
            {isHero && !thoughts && !isExpanded && (
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {TEMPLATES.map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setThoughts(item.template(userName));
                                setIsExpanded(true);
                                setTimeout(() => {
                                    textareaRef.current?.focus();
                                }, 100);
                            }}
                            className="bg-surface border border-outline/20 px-3 py-1.5 rounded-full text-sm text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
