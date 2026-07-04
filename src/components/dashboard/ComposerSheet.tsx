"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Twitter, Linkedin, AtSign } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { triggerManualGeneration } from "@/lib/actions";
import { useClient } from "@/components/dashboard/ClientSwitcher";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ComposerSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLATFORMS = [
  { id: "TWITTER", label: "Twitter", icon: Twitter },
  { id: "LINKEDIN", label: "LinkedIn", icon: Linkedin },
  { id: "THREADS", label: "Threads", icon: AtSign },
] as const;

export function ComposerSheet({ isOpen, onClose }: ComposerSheetProps) {
  const { activeClientId } = useClient();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [thoughts, setThoughts] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "TWITTER",
    "LINKEDIN",
    "THREADS",
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-focus textarea when sheet opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to wait for animation
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // Reset state when closed
      setThoughts("");
      setSelectedPlatforms(["TWITTER", "LINKEDIN", "THREADS"]);
    }
  }, [isOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [thoughts]);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!thoughts.trim()) return;
    setIsGenerating(true);

    const formData = new FormData();
    formData.append("thoughts", thoughts.trim());
    if (activeClientId) formData.append("clientId", activeClientId);
    formData.append("platforms", JSON.stringify(selectedPlatforms));

    try {
      const results = await triggerManualGeneration(formData);
      const count = results.reduce(
        (acc: number, r: any) => acc + (r.count || 0),
        0
      );

      if (count > 0) {
        toast.success(`Generated ${count} new posts!`);
      } else {
        toast.success("Posts are being generated!");
      }

      onClose();
      router.push("/dashboard/posts");
      router.refresh();
    } catch (error) {
      console.error("Generation failed", error);
      toast.error("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Scrim / Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-surface rounded-t-3xl shadow-2xl max-h-[80vh] overflow-auto"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-on-surface-variant/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3">
              <h2 className="text-lg font-semibold text-on-surface">
                What&apos;s on your mind?
              </h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full text-on-surface-variant hover:bg-surface-variant/30 transition-colors"
                aria-label="Close composer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 pb-[env(safe-area-inset-bottom,20px)]">
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                placeholder="Share an idea, topic, or draft…"
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                rows={2}
                className={cn(
                  "w-full resize-none rounded-2xl border border-outline/20 bg-surface-variant/10 px-4 py-3",
                  "text-base text-on-surface placeholder:text-on-surface-variant/50",
                  "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                  "transition-all duration-200 max-h-[160px]"
                )}
              />

              {/* Platform Pills */}
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs font-medium text-on-surface-variant/60 mr-1">
                  Platforms
                </span>
                {PLATFORMS.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                        isSelected
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-surface-variant/10 text-on-surface-variant/60 border-outline/20 hover:border-outline/40"
                      )}
                    >
                      <platform.icon className="w-3.5 h-3.5" />
                      {platform.label}
                    </button>
                  );
                })}
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={
                  isGenerating ||
                  !thoughts.trim() ||
                  selectedPlatforms.length === 0
                }
                className="w-full mt-5 mb-3 rounded-2xl py-6 text-base font-semibold gap-2"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Posts
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
