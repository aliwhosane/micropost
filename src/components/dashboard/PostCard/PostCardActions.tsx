import { Button } from "@/components/ui/Button";
import { Check, X, Pencil, Calendar as CalendarIcon } from "lucide-react";

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
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant="tonal"
                    className="bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80"
                    onClick={onEdit}
                >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit</span>
                </Button>
                <Button
                    size="sm"
                    variant="outlined"
                    className="border-error text-error hover:bg-error-container hover:text-on-error-container hover:border-error-container"
                    onClick={onReject}
                    isLoading={actionStatus === "REJECTING"}
                >
                    <X className="h-3.5 w-3.5" />
                    <span>Reject</span>
                </Button>
                <div className="flex items-center rounded-lg bg-emerald-600 p-[1px] hover:bg-emerald-700 hover:shadow-emerald-200/50 shadow-sm transition-all group">
                    <button
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-l-md hover:bg-black/10 transition-colors border-r border-emerald-500 disabled:opacity-70"
                        onClick={onApprove}
                        disabled={actionStatus === "APPROVING" || !isValid}
                    >
                        {status === "FAILED" ? (
                            <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Retry</span>
                            </>
                        ) : (
                            <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Approve</span>
                            </>
                        )}
                    </button>
                    <button
                        className="px-2 py-1.5 rounded-r-md text-emerald-100 hover:text-white hover:bg-black/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={onToggleSchedule}
                        title="Schedule for later"
                        disabled={!isValid}
                    >
                        <CalendarIcon className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
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
