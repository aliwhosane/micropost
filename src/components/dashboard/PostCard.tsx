"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { approvePost, rejectPost, updatePostContent, regeneratePostAction } from "@/lib/actions";
import { Check, X, Linkedin, Twitter, Pencil, Sparkles, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface PostCardProps {
    id: string;
    content: string;
    platform: string;
    topic: string;
    createdAt: Date;
    status: string;
    scheduledFor?: Date | null;
}

export function PostCard({ id, content, platform, topic, createdAt, status: initialStatus, scheduledFor }: PostCardProps) {
    const [actionStatus, setActionStatus] = useState<"IDLE" | "APPROVING" | "REJECTING" | "SAVING" | "REGENERATING" | "SCHEDULING">("IDLE");
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);

    // Scheduling State
    const [isScheduling, setIsScheduling] = useState(false);
    const [scheduleDate, setScheduleDate] = useState("");

    // Selection State
    const [selection, setSelection] = useState<{ text: string; top: number; left: number } | null>(null);
    const [instruction, setInstruction] = useState("");
    const cardRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const schedulePopoverRef = useRef<HTMLDivElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [isEditing, editedContent]);

    // Reset selection when editing starts
    useEffect(() => {
        if (isEditing) {
            setSelection(null);
        }
    }, [isEditing]);

    // Handle selection changes globally to catch drags ending outside the div
    useEffect(() => {
        const handleDocumentMouseUp = () => {
            if (isEditing) return;
            // Ensure cardRef is available
            if (!cardRef.current) return;

            const sel = window.getSelection();
            if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
                // Don't clear immediately on mouseup if interacting with popover?
                // Actually relying on click-outside for clearing is better.
                // But valid selection logic needs to run here.
                return;
            }

            const text = sel.toString().trim();
            if (!text) return;

            // Verify selection is within our content
            if (contentRef.current &&
                contentRef.current.contains(sel.anchorNode) &&
                contentRef.current.contains(sel.focusNode)) {

                const range = sel.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                const cardRect = cardRef.current.getBoundingClientRect();

                setSelection({
                    text,
                    // Calculate position relative to the card container
                    top: rect.bottom - cardRect.top + 10,
                    left: rect.left - cardRect.left,
                });
            }
        };

        document.addEventListener("mouseup", handleDocumentMouseUp);
        return () => document.removeEventListener("mouseup", handleDocumentMouseUp);
    }, [isEditing]);

    const handleRegenerate = async () => {
        if (!selection || !instruction.trim()) return;

        setActionStatus("REGENERATING");
        await regeneratePostAction(id, selection.text, instruction);
        setActionStatus("IDLE");
        setSelection(null);
        setInstruction("");
        // Optimistic update or wait for revalidation? 
        // Revalidation is handled in action, but we might want to refetch or just wait.
        // For smoother UX, we might want local update if action returned new content.
    };

    // Close popover on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (selection && !(e.target as HTMLElement).closest(".selection-popover")) {
                setSelection(null);
            }
            if (isScheduling && schedulePopoverRef.current && !schedulePopoverRef.current.contains(e.target as Node)) {
                setIsScheduling(false);
            }
        };
        window.addEventListener("mousedown", handleClickOutside);
        return () => window.removeEventListener("mousedown", handleClickOutside);
    }, [selection, isScheduling]);

    const handleApprove = async () => {
        setActionStatus("APPROVING");
        await approvePost(id);
        setActionStatus("IDLE");
    };

    const handleReject = async () => {
        setActionStatus("REJECTING");
        await rejectPost(id);
        setActionStatus("IDLE");
    };

    const handleSave = async () => {
        if (editedContent.trim() === content) {
            setIsEditing(false);
            return;
        }
        setActionStatus("SAVING");
        await updatePostContent(id, editedContent);
        setActionStatus("IDLE");
        setIsEditing(false);
    };

    const handleSchedule = async () => {
        if (!scheduleDate) return;
        setActionStatus("SCHEDULING");
        // Convert local time to UTC ISO string to preserve the correct instant
        const isoDate = new Date(scheduleDate).toISOString();
        await approvePost(id, isoDate);
        setActionStatus("IDLE");
        setIsScheduling(false);
    }

    const handleCancel = () => {
        setEditedContent(content);
        setIsEditing(false);
    };

    const PlatformIcon = platform === "LINKEDIN" ? Linkedin : Twitter;
    const platformColor = platform === "LINKEDIN" ? "text-[#0077b5]" : "text-[#1DA1F2]";

    return (
        <div ref={cardRef} className="relative flex flex-col p-5 rounded-xl bg-surface-variant/20 border border-outline-variant/20 gap-4 hover:border-outline-variant/40 transition-colors">

            {/* Selection Popover */}
            {selection && (
                <div
                    className="selection-popover absolute z-50 bg-surface shadow-xl rounded-lg p-3 border border-outline-variant w-72 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-200"
                    style={{ top: selection.top, left: selection.left }}
                >
                    <div className="text-xs font-semibold text-on-surface-variant flex justify-between">
                        <span>Refine Selection</span>
                        <button onClick={() => setSelection(null)}><X className="h-3 w-3" /></button>
                    </div>
                    <textarea
                        className="text-sm p-2 rounded bg-surface-variant/30 border-none focus:ring-1 focus:ring-primary h-16 resize-none"
                        placeholder="e.g. Make it funnier..."
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        autoFocus
                    />
                    <Button
                        size="sm"
                        variant="filled"
                        className="text-xs h-7 w-full flex justify-center gap-2"
                        onClick={handleRegenerate}
                        isLoading={actionStatus === "REGENERATING"}
                    >
                        <Sparkles className="h-3 w-3" /> Regenerate
                    </Button>
                </div>
            )}

            {/* Header: Platform & Metadata */}
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <PlatformIcon className={`h-5 w-5 ${platformColor}`} />
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        {topic}
                    </span>
                    <span className="text-xs text-on-surface-variant">• {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="flex items-center gap-2">
                    {actionStatus === "REGENERATING" && <span className="text-xs text-primary animate-pulse font-medium">Regenerating...</span>}
                    {initialStatus === "PUBLISHED" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">PUBLISHED</span>
                    )}
                    {initialStatus === "FAILED" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">FAILED</span>
                    )}
                    {(initialStatus === "APPROVED" && scheduledFor) && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            <Clock className="w-3 h-3" />
                            SCHEDULED
                        </span>
                    )}
                </div>
            </div>



            {/* Body: Content */}
            <div className="w-full">
                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        className="w-full p-3 rounded-lg bg-surface border border-outline-variant text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium leading-relaxed resize-none shadow-inner overflow-hidden"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        disabled={actionStatus === "SAVING"}
                        rows={1}
                    />
                ) : (
                    <div
                        ref={contentRef}
                        className="font-medium text-on-surface whitespace-pre-wrap text-[15px] leading-7 cursor-text p-1"
                    >
                        {selection ? (
                            <>
                                {content.split(selection.text).map((part, index, array) => {
                                    if (index === array.length - 1) return part;
                                    return (
                                        <span key={index}>
                                            {part}
                                            <span className="bg-primary/20 text-primary-dark">{selection.text}</span>
                                        </span>
                                    );
                                })}
                            </>
                        ) : (
                            content
                        )}
                    </div>
                )}
            </div>

            {/* Footer: Actions */}
            <div className="flex items-center justify-end pt-2 border-t border-outline-variant/10 relative">

                {/* Scheduling Popover */}
                {isScheduling && (
                    <div ref={schedulePopoverRef} className="absolute bottom-full right-0 mb-2 z-20 w-72 bg-surface rounded-xl shadow-2xl border border-outline-variant p-4 animate-in fade-in zoom-in-95 slide-in-from-bottom-2">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-on-surface">Schedule Post</h4>
                                <Button size="sm" variant="text" onClick={() => setIsScheduling(false)} className="h-6 w-6 p-0 text-on-surface-variant"><X className="h-3 w-3" /></Button>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-on-surface-variant font-medium ml-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-2.5 rounded-lg bg-surface-variant/30 border border-outline-variant text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        value={scheduleDate.split("T")[0]}
                                        min={new Date().toLocaleDateString('en-CA')} // 'en-CA' gives YYYY-MM-DD in local time
                                        onChange={(e) => {
                                            // Preserve existing time if set, or default to 09:00
                                            const current = scheduleDate ? new Date(scheduleDate) : new Date();
                                            current.setHours(9, 0, 0, 0); // Default 9 AM

                                            // Set new date parts from input
                                            const [y, m, d] = e.target.value.split('-').map(Number);
                                            current.setFullYear(y, m - 1, d);

                                            // Use local string format compatible with datetime-local logic for consistency or state
                                            // Actually, let's keep scheduleDate as a full ISO string or Date object in state?
                                            // For simplicity, let's store as a string YYYY-MM-DDTHH:mm

                                            const timePart = scheduleDate.includes("T") ? scheduleDate.split("T")[1] : "09:00";
                                            setScheduleDate(`${e.target.value}T${timePart}`);
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-on-surface-variant font-medium ml-1">Time</label>
                                    <select
                                        className="w-full p-2.5 rounded-lg bg-surface-variant/30 border border-outline-variant text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                                        value={scheduleDate.split("T")[1] || "09:00"}
                                        onChange={(e) => {
                                            const datePart = scheduleDate.split("T")[0] || new Date().toISOString().split("T")[0];
                                            setScheduleDate(`${datePart}T${e.target.value}`);
                                        }}
                                    >
                                        <option value="" disabled>Select time</option>
                                        {Array.from({ length: 48 }).map((_, i) => {
                                            const hour = Math.floor(i / 2);
                                            const minute = (i % 2) * 30;
                                            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

                                            // Format for display (e.g. 9:00 AM)
                                            const date = new Date();
                                            date.setHours(hour, minute);
                                            const display = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

                                            return <option key={timeString} value={timeString}>{display}</option>
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-2">
                                <Button size="sm" variant="outlined" className="flex-1 border-outline-variant hover:bg-surface-variant" onClick={() => setIsScheduling(false)}>Cancel</Button>
                                <Button
                                    size="sm"
                                    variant="filled"
                                    className="flex-1 bg-primary text-on-primary"
                                    onClick={handleSchedule}
                                    disabled={!scheduleDate || !scheduleDate.includes("T")}
                                    isLoading={actionStatus === "SCHEDULING"}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    </div>
                )}


                {(initialStatus === "PENDING" || initialStatus === "DRAFT") ? (
                    <>
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outlined"
                                    className="border-outline-variant text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
                                    onClick={handleCancel}
                                    disabled={actionStatus === "SAVING"}
                                >
                                    <X className="h-3.5 w-3.5" />
                                    <span>Cancel</span>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="filled"
                                    className="bg-primary hover:bg-primary/90 min-w-[80px]"
                                    onClick={handleSave}
                                    isLoading={actionStatus === "SAVING"}
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Save</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="tonal"
                                    className="bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    <span>Edit</span>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outlined"
                                    className="border-error text-error hover:bg-error-container hover:text-on-error-container hover:border-error-container"
                                    onClick={handleReject}
                                    isLoading={actionStatus === "REJECTING"}
                                >
                                    <X className="h-3.5 w-3.5" />
                                    <span>Reject</span>
                                </Button>
                                <div className="flex items-center rounded-lg bg-emerald-600 p-[1px] hover:bg-emerald-700 hover:shadow-emerald-200/50 shadow-sm transition-all group">
                                    <button
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-l-md hover:bg-black/10 transition-colors border-r border-emerald-500 disabled:opacity-70"
                                        onClick={handleApprove}
                                        disabled={actionStatus === "APPROVING"}
                                    >
                                        <Check className="h-3.5 w-3.5" />
                                        <span>Approve</span>
                                    </button>
                                    <button
                                        className="px-2 py-1.5 rounded-r-md text-emerald-100 hover:text-white hover:bg-black/10 transition-colors"
                                        onClick={() => setIsScheduling(!isScheduling)}
                                        title="Schedule for later"
                                    >
                                        <CalendarIcon className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                        {scheduledFor && initialStatus === "APPROVED" && (
                            <span className="text-xs text-on-surface-variant mr-auto bg-surface-variant/50 px-2 py-1 rounded">
                                Scheduled: {new Date(scheduledFor).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                        )}
                        <div className="text-sm font-medium text-on-surface-variant/50 italic px-2">
                            {initialStatus === "PUBLISHED" ? "Posted" : initialStatus}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
