"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Download, X } from "lucide-react";
import { approvePost, rejectPost, updatePostContent, regeneratePostAction } from "@/lib/actions";
import { usePostSelection } from "@/hooks/usePostSelection";
import { usePostScheduling } from "@/hooks/usePostScheduling";
import { PostCardHeader } from "./PostCardHeader";
import { PostCardActions } from "./PostCardActions";
import { SelectionPopover } from "./SelectionPopover";
import { SchedulingPopover } from "./SchedulingPopover";
import { CharacterCount } from "./CharacterCount";
import { VisionSelector } from "../VisionCraft/VisionSelector";
import { savePostImageAction } from "@/app/actions/image";
import { uploadImageAction } from "@/app/actions/upload";
import { toast } from "sonner";


interface PostCardProps {
    id: string;
    content: string;
    platform: string;
    topic: string;
    createdAt: Date;
    status: string;
    scheduledFor?: Date | null;
    imageUrl?: string | null;
}

export function PostCard({ id, content, platform, topic, createdAt, status: initialStatus, scheduledFor, imageUrl: initialImageUrl }: PostCardProps) {
    const router = useRouter();
    const [actionStatus, setActionStatus] = useState<"IDLE" | "APPROVING" | "REJECTING" | "SAVING" | "REGENERATING" | "SCHEDULING">("IDLE");
    const [imageUrl, setImageUrl] = useState(initialImageUrl);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const [instruction, setInstruction] = useState("");
    const [showVisionSelector, setShowVisionSelector] = useState(false);
    const [isCompact, setIsCompact] = useState(false); // Default to expanded for now, could be prop controlled later

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

    const handleRepurpose = () => {
        router.push(`/dashboard/shortsmaker?source_post_id=${id}`);
    };

    const handleDownload = () => {
        if (!imageUrl) return;
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `micropost-image-${id.slice(0, 8)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Character Count Logic
    const currentContent = isEditing ? editedContent : content;
    const charCount = currentContent.length;
    let limit = 10000; // Default high limit
    if (platform === "TWITTER") limit = 275;
    if (platform === "THREADS") limit = 490;

    const isValid = charCount <= limit;
    const isOverLimit = !isValid;

    return (
        <div
            ref={cardRef}
            className={`relative flex flex-col rounded-[2rem] border transition-all duration-300 group/card cursor-pointer
                ${isCompact ? "p-4 gap-3" : "p-6 gap-5"}
                bg-surface border-outline-variant/10 shadow-sm 
                hover:shadow-md hover:border-primary/20 hover:bg-surface-variant/10
            `}
            onClick={(e) => {
                // Prevent toggling if selecting text or clicking interactive elements
                if (window.getSelection()?.toString().length) return;
                // If isCompact is true, clicking anywhere expands it.
                // If expanded, clicking non-interactive areas could collapse it? 
                // Let's stick to "Click to expand" primarily. 
                // User can use the chevron to collapse.
                if (isCompact) {
                    setIsCompact(false);
                }
            }}
        >

            {/* Selection Popover */}
            {selection && !isCompact && (
                <SelectionPopover
                    top={selection.top}
                    left={selection.left}
                    selectedText={selection.text}
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
                isCompact={isCompact}
                onToggleCompact={() => setIsCompact(!isCompact)}
            />

            {/* Content Body */}
            <div className="w-full">
                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        className={`w-full p-3 rounded-lg bg-surface border text-base text-on-surface focus:outline-none focus:ring-2 font-medium leading-relaxed resize-none shadow-inner overflow-hidden ${isOverLimit
                            ? "border-error focus:ring-error"
                            : "border-outline-variant focus:ring-primary"
                            }`}
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        onKeyDown={(e) => {
                            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                                e.preventDefault();
                                handleSave();
                            }
                            if (e.key === "Escape") {
                                e.preventDefault();
                                handleCancel();
                            }
                        }}
                        disabled={actionStatus === "SAVING"}
                        rows={1}
                    />
                ) : (
                    <div
                        ref={contentRef}
                        className={`font-medium text-on-surface whitespace-pre-wrap text-[15px] leading-7 cursor-text p-1 transition-all
                            ${isCompact ? "line-clamp-2 text-sm leading-snug text-on-surface/80" : ""}
                        `}
                        onClick={() => isCompact && setIsCompact(false)} // Expand on click if compact
                    >
                        {selection && !isCompact ? (
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

                {/* Character Count Display */}
                {!isCompact && (platform === "TWITTER" || platform === "THREADS") && (
                    <div className="flex justify-end mt-2 px-1">
                        <CharacterCount current={charCount} limit={limit} />
                    </div>
                )}
            </div>

            {/* VisionCraft / Image Attachment */}
            {/* Show selector if no image and status is pending/draft/failed */}
            {!isCompact && !imageUrl && (initialStatus === "PENDING" || initialStatus === "DRAFT" || initialStatus === "FAILED") && !isEditing && (
                <div className="pt-2 border-t border-outline-variant/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 ease-in-out">
                    {!showVisionSelector ? (
                        <div className="flex items-center gap-2 mt-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowVisionSelector(true);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors px-3 py-2 rounded-xl hover:bg-surface-variant/30 border border-transparent hover:border-outline-variant/20 group/btn"
                            >
                                <span className="text-lg group-hover/btn:scale-110 transition-transform">✨</span>
                                <span>Add Visual</span>
                            </button>

                            {/* Custom Upload */}
                            <label className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors px-3 py-2 rounded-xl hover:bg-surface-variant/30 border border-transparent hover:border-outline-variant/20 cursor-pointer group/btn">
                                <span className="text-lg group-hover/btn:scale-110 transition-transform">📤</span>
                                <span>Upload</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onClick={(e) => e.stopPropagation()} // Stop click propagation for input too
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        const formData = new FormData();
                                        formData.append("file", file);

                                        toast.promise(
                                            uploadImageAction(formData).then(async (res) => {
                                                if (res.success && res.url) {
                                                    setImageUrl(res.url);
                                                    await savePostImageAction(id, res.url);
                                                    router.refresh();
                                                    return "Image uploaded!";
                                                }
                                                throw new Error(res.error);
                                            }),
                                            {
                                                loading: 'Uploading...',
                                                success: 'Image uploaded!',
                                                error: 'Upload failed'
                                            }
                                        );
                                    }}
                                />
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowVisionSelector(false)}
                                    className="text-xs text-on-surface-variant hover:text-on-surface transition-colors"
                                >
                                    Close VisionCraft
                                </button>
                            </div>
                            <VisionSelector
                                postContent={content}
                                platform={(platform === "TWITTER" || platform === "LINKEDIN" || platform === "THREADS") ? platform : "TWITTER"}
                                onImageSelect={async (url) => {
                                    setImageUrl(url);
                                    setShowVisionSelector(false); // Close after selection
                                    const result = await savePostImageAction(id, url);
                                    if (result.newContent && result.newContent !== content) {
                                        setEditedContent(result.newContent);
                                        router.refresh();
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Show Attached Image */}
            {imageUrl && !isCompact && (
                <div className="relative w-full rounded-lg overflow-hidden border border-white/10 mt-2 shadow-inner group/image max-h-[400px]">
                    {/* Aspect-video is good but we want max-height cap. object-cover will handle cropping if we force height */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Attached visual" className="w-full h-full object-cover max-h-[400px] transition-transform duration-700 hover:scale-105" />

                    {/* Image Actions Overlay */}
                    <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover/image:opacity-100 transition-opacity">
                        <button
                            onClick={handleDownload}
                            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors backdrop-blur-sm"
                            title="Download image"
                        >
                            <Download size={16} />
                        </button>

                        {/* Remove Action */}
                        {!isEditing && (initialStatus === "PENDING" || initialStatus === "DRAFT" || initialStatus === "FAILED") && (
                            <button
                                onClick={async () => {
                                    setImageUrl(null);
                                    await import("@/app/actions/image").then(mod => mod.removePostImageAction(id));
                                }}
                                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors backdrop-blur-sm"
                                title="Remove image"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Footer Actions */}
            <div className="relative w-fit">
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
                    onRepurpose={handleRepurpose}
                    isValid={isValid}
                />
            </div>
        </div>
    );
}
