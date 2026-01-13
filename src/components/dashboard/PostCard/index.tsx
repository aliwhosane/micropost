"use client";

import { useState, useEffect, useRef } from "react";
import { approvePost, rejectPost, updatePostContent, regeneratePostAction } from "@/lib/actions";
import { usePostSelection } from "@/hooks/usePostSelection";
import { usePostScheduling } from "@/hooks/usePostScheduling";
import { PostCardHeader } from "./PostCardHeader";
import { PostCardActions } from "./PostCardActions";
import { SelectionPopover } from "./SelectionPopover";
import { SchedulingPopover } from "./SchedulingPopover";

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
    const [instruction, setInstruction] = useState("");

    // Refs
    const cardRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const schedulePopoverRef = useRef<HTMLDivElement>(null);

    // Custom Hooks
    const { selection, setSelection } = usePostSelection(isEditing, cardRef, contentRef);
    const {
        isScheduling,
        setIsScheduling,
        scheduleDate,
        setScheduleDate,
        handleConfirmSchedule,
        isSubmitting: isSchedulingSubmitting
    } = usePostScheduling(async (postId, date) => {
        setActionStatus("SCHEDULING");
        await approvePost(postId, date);
        setActionStatus("IDLE");
    });

    // Auto-resize textarea
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [isEditing, editedContent]);

    // Close scheduling popover on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isScheduling && schedulePopoverRef.current && !schedulePopoverRef.current.contains(e.target as Node)) {
                setIsScheduling(false);
            }
        };
        window.addEventListener("mousedown", handleClickOutside);
        return () => window.removeEventListener("mousedown", handleClickOutside);
    }, [isScheduling]);

    const handleRegenerate = async () => {
        if (!selection || !instruction.trim()) return;
        setActionStatus("REGENERATING");
        await regeneratePostAction(id, selection.text, instruction);
        setActionStatus("IDLE");
        setSelection(null);
        setInstruction("");
    };

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

    const handleCancel = () => {
        setEditedContent(content);
        setIsEditing(false);
    };

    return (
        <div ref={cardRef} className="relative flex flex-col p-5 rounded-xl bg-surface-variant/20 border border-outline-variant/20 gap-4 hover:border-outline-variant/40 transition-colors">

            {/* Selection Popover */}
            {selection && (
                <SelectionPopover
                    top={selection.top}
                    left={selection.left}
                    instruction={instruction}
                    isRegenerating={actionStatus === "REGENERATING"}
                    onClose={() => setSelection(null)}
                    onInstructionChange={setInstruction}
                    onRegenerate={handleRegenerate}
                />
            )}

            {/* Header */}
            <PostCardHeader
                platform={platform}
                topic={topic}
                createdAt={createdAt}
                status={initialStatus}
                scheduledFor={scheduledFor}
                isRegenerating={actionStatus === "REGENERATING"}
            />

            {/* Content Body */}
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

            {/* Footer Actions */}
            <div className="flex items-center justify-end pt-2 border-t border-outline-variant/10 relative">

                {isScheduling && (
                    <SchedulingPopover
                        ref={schedulePopoverRef}
                        scheduleDate={scheduleDate}
                        isScheduling={isSchedulingSubmitting}
                        onClose={() => setIsScheduling(false)}
                        onConfirm={() => handleConfirmSchedule(id)}
                        onDateChange={setScheduleDate}
                    />
                )}

                <PostCardActions
                    status={initialStatus}
                    isEditing={isEditing}
                    actionStatus={actionStatus}
                    scheduledFor={scheduledFor}
                    onEdit={() => setIsEditing(true)}
                    onCancel={handleCancel}
                    onSave={handleSave}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onToggleSchedule={() => setIsScheduling(!isScheduling)}
                />
            </div>
        </div>
    );
}
