import { Button } from "@/components/ui/Button";
import { Check, X, Pencil, Calendar as CalendarIcon, Clapperboard, Sparkles } from "lucide-react";

interface PostCardActionsProps {
    status: string;
    isEditing: boolean;
    actionStatus: string;
    scheduledFor?: Date | null;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
    onApprove: () => void;
    onReject: () => void;
    onToggleSchedule: () => void;
    onRepurpose: () => void;
    isValid?: boolean;
    isCompact?: boolean;
}

export function PostCardActions({
    status,
    isEditing,
    actionStatus,
    scheduledFor,
    onEdit,
    onCancel,
    onSave,
    onApprove,
    onReject,
    onToggleSchedule,
    onRepurpose,
    isValid = true,
    isCompact = false
}: PostCardActionsProps) {
    // In Compact mode, we only show minimal status info or primary action if needed
    // But design-wise, it's cleaner to just show status text or nothing, and let user expand to act.
    // However, fast approval might be desired. Let's keep Approve/Reject accessible but smaller?
    // For now, let's hide complex actions in compact mode to keep it clean, 
    // OR we can just show the Approve button slightly differently.

    // DECISION: In compact mode, we hide the heavy buttons to save space, but show a "Status" pill if not pending.
    // If PENDING, we might want to allow quick approve.

    if (isCompact) {
        if (status === "PENDING" || status === "DRAFT" || status === "FAILED") {
            return (
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onApprove(); }}
                        disabled={actionStatus === "APPROVING" || !isValid}
                        className="p-1.5 rounded-md hover:bg-green-500/10 text-green-600 transition-colors"
                        title="Quick Approve"
                    >
                        <Check className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onReject(); }}
                        disabled={actionStatus === "REJECTING"}
                        className="p-1.5 rounded-md hover:bg-red-500/10 text-red-600 transition-colors"
                        title="Quick Reject"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )
        }
        return <div className="text-xs font-medium text-on-surface-variant/50 italic">{status}</div>;
    }

    if (status === "PENDING" || status === "DRAFT" || status === "FAILED") {
        if (isEditing) {
            return (
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outlined"
                        className="border-outline-variant text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
                        onClick={onCancel}
                        disabled={actionStatus === "SAVING"}
                    >
                        <X className="h-3.5 w-3.5" />
                        <span>Cancel</span>
                    </Button>
                    <Button
                        size="sm"
                        variant="filled"
                        className="bg-primary hover:bg-primary/90 min-w-[80px]"
                        onClick={onSave}
                        isLoading={actionStatus === "SAVING"}
                        title="Save (⌘+Enter)"
                    >
                        <Check className="h-3.5 w-3.5" />
                        <span>Save</span>
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-between w-full">
                {/* Primary Action - Always Visible */}
                <div className="flex items-center rounded-full bg-emerald-600 p-[3px] shadow-sm hover:shadow-emerald-500/20 transition-all hover:scale-105"
                    onClick={(e) => e.stopPropagation()} // Stop click from toggling card
                >
                    <button
                        className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-l-full hover:bg-black/10 transition-colors border-r border-emerald-500 disabled:opacity-70"
                        onClick={onApprove}
                        disabled={actionStatus === "APPROVING" || !isValid}
                    >
                        {status === "FAILED" ? (
                            <>
                                <Check className="h-4 w-4" />
                                <span>Retry</span>
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4" />
                                <span>Approve</span>
                            </>
                        )}
                    </button>
                    <button
                        className="px-4 py-2 rounded-r-full text-emerald-100 hover:text-white hover:bg-black/10 transition-colors disabled:opacity-50"
                        onClick={onToggleSchedule}
                        title="Schedule"
                        disabled={!isValid}
                    >
                        <CalendarIcon className="h-4 w-4" />
                    </button>
                </div>

                {/* Secondary Actions - Hidden until hover */}
                <div className="flex items-center gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-purple-700 dark:text-purple-300 hover:bg-purple-600/10 h-10 w-10 p-2 rounded-full"
                        onClick={(e) => { e.stopPropagation(); onRepurpose(); }}
                        title="Turn into Short"
                    >
                        <Clapperboard className="w-5 h-5" />
                    </Button>
                    <div className="h-4 w-px bg-outline-variant/30 mx-1" />
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 h-10 w-10 p-2 rounded-full"
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        title="Edit Post"
                    >
                        <Pencil className="w-5 h-5" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-error/70 hover:text-error hover:bg-error/10 h-10 w-10 p-2 rounded-full"
                        onClick={(e) => { e.stopPropagation(); onReject(); }}
                        title="Reject Post"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {/* Repurpose Action for Published/Approved posts too! */}
            <Button
                size="sm"
                variant="ghost"
                className="text-purple-700 dark:text-purple-300 hover:text-purple-800 hover:bg-purple-600/10"
                onClick={onRepurpose}
                title="Repurpose as Video"
            >
                <div className="relative mr-1.5">
                    <Clapperboard className="w-3.5 h-3.5" />
                    <Sparkles className="w-2 h-2 absolute -top-1 -right-1 text-purple-500" />
                </div>
                <span>Make Short</span>
            </Button>
            <div className="h-4 w-px bg-outline-variant/30 mx-1" />

            {scheduledFor && status === "APPROVED" && (
                <span className="text-xs text-on-surface-variant mr-auto bg-surface-variant/50 px-2 py-1 rounded">
                    Scheduled: {new Date(scheduledFor).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </span>
            )}
            <div className="text-sm font-medium text-on-surface-variant/50 italic px-2">
                {status === "PUBLISHED" ? "Posted" : status}
            </div>
        </div>
    );
}
