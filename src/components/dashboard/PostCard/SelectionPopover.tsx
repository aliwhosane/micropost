import { Button } from "@/components/ui/Button";
import { X, Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOTION } from "@/lib/motion";

interface SelectionPopoverProps {
    top: number;
    left: number;
    selectedText: string;
    instruction: string;
    isRegenerating: boolean;
    onClose: () => void;
    onInstructionChange: (value: string) => void;
    onRegenerate: (instruction?: string) => void;
}

export function SelectionPopover({
    top,
    left,
    selectedText,
    instruction,
    isRegenerating,
    onClose,
    onInstructionChange,
    onRegenerate
}: SelectionPopoverProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(selectedText);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const handleQuickAction = (action: string) => {
        onInstructionChange(action);
        onRegenerate(action);
    };

    return (
        <motion.div
            className="selection-popover absolute z-50 bg-surface shadow-xl rounded-xl p-3 border border-outline-variant w-72 flex flex-col gap-2"
            style={{ top, left }}
            {...MOTION.popover}
            onKeyDown={(e) => {
                if (e.key === 'Escape') {
                    e.stopPropagation();
                    onClose();
                }
            }}
        >
            <div className="text-xs font-semibold text-on-surface-variant flex justify-between">
                <span>Refine Selection</span>
                <button onClick={onClose} aria-label="Close refinement popover"><X className="h-3 w-3" /></button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar" role="group" aria-label="Quick refinement actions">
                {["Shorten", "Fix Grammar", "More Persuasive", "Fun"].map((action) => (
                    <button
                        key={action}
                        onClick={() => handleQuickAction(action)}
                        className={cn(
                            "text-[10px] whitespace-nowrap px-2 py-1 rounded-full border transition-colors",
                            instruction === action
                                ? "bg-primary/20 border-primary/40 text-primary"
                                : "bg-surface-variant border-outline-variant/50 hover:bg-primary/10 hover:border-primary/30"
                        )}
                    >
                        {action}
                    </button>
                ))}
            </div>

            <textarea
                className="text-sm p-2 rounded bg-surface-variant/30 border-none focus:ring-1 focus:ring-primary h-16 resize-none"
                placeholder="e.g. Make it funnier..."
                value={instruction}
                onChange={(e) => onInstructionChange(e.target.value)}
                onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                        e.preventDefault();
                        onRegenerate();
                    }
                    if (e.key === 'Escape') {
                        e.stopPropagation();
                        onClose();
                    }
                }}
                autoFocus
            />
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="filled"
                    className="text-xs h-7 flex-1 flex justify-center gap-2"
                    onClick={() => onRegenerate()}
                    isLoading={isRegenerating}
                >
                    <Sparkles className="h-3 w-3" /> Regenerate
                </Button>
                <Button
                    size="sm"
                    variant="outlined"
                    className="text-xs h-7 w-20 flex justify-center gap-2 border-outline-variant text-on-surface hover:bg-surface-variant"
                    onClick={handleCopy}
                >
                    {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    {isCopied ? "Copied" : "Copy"}
                </Button>
            </div>
        </motion.div>
    );
}
