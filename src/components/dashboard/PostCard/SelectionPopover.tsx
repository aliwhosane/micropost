import { Button } from "@/components/ui/Button";
import { X, Sparkles } from "lucide-react";

interface SelectionPopoverProps {
    top: number;
    left: number;
    instruction: string;
    isRegenerating: boolean;
    onClose: () => void;
    onInstructionChange: (value: string) => void;
    onRegenerate: () => void;
}

export function SelectionPopover({
    top,
    left,
    instruction,
    isRegenerating,
    onClose,
    onInstructionChange,
    onRegenerate
}: SelectionPopoverProps) {
    return (
        <div
            className="selection-popover absolute z-50 bg-surface shadow-xl rounded-lg p-3 border border-outline-variant w-72 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-200"
            style={{ top, left }}
        >
            <div className="text-xs font-semibold text-on-surface-variant flex justify-between">
                <span>Refine Selection</span>
                <button onClick={onClose}><X className="h-3 w-3" /></button>
            </div>
            <textarea
                className="text-sm p-2 rounded bg-surface-variant/30 border-none focus:ring-1 focus:ring-primary h-16 resize-none"
                placeholder="e.g. Make it funnier..."
                value={instruction}
                onChange={(e) => onInstructionChange(e.target.value)}
                autoFocus
            />
            <Button
                size="sm"
                variant="filled"
                className="text-xs h-7 w-full flex justify-center gap-2"
                onClick={onRegenerate}
                isLoading={isRegenerating}
            >
                <Sparkles className="h-3 w-3" /> Regenerate
            </Button>
        </div>
    );
}
