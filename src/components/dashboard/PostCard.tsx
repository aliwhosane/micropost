"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { approvePost, rejectPost, updatePostContent } from "@/lib/actions";
import { Check, X, Linkedin, Twitter, Pencil } from "lucide-react";
import { useState } from "react";

interface PostCardProps {
    id: string;
    content: string;
    platform: string;
    topic: string;
    createdAt: Date;
    status: string;
}

export function PostCard({ id, content, platform, topic, createdAt, status: initialStatus }: PostCardProps) {
    const [actionStatus, setActionStatus] = useState<"IDLE" | "APPROVING" | "REJECTING" | "SAVING">("IDLE");
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);

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

    const PlatformIcon = platform === "LINKEDIN" ? Linkedin : Twitter;
    const platformColor = platform === "LINKEDIN" ? "text-[#0077b5]" : "text-[#1DA1F2]";

    return (
        <div className="flex flex-col sm:flex-row items-start justify-between p-4 rounded-lg bg-surface-variant/20 border border-outline-variant/20 gap-4">
            <div className="space-y-2 flex-1 w-full">
                <div className="flex items-center gap-2">
                    <PlatformIcon className={`h-4 w-4 ${platformColor}`} />
                    <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                        {topic}
                    </span>
                    <span className="text-xs text-on-surface-variant">• {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {initialStatus === "PUBLISHED" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 ml-2">PUBLISHED</span>
                    )}
                    {initialStatus === "FAILED" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 ml-2">FAILED</span>
                    )}
                </div>
                {isEditing ? (
                    <textarea
                        className="w-full min-h-[100px] p-2 rounded-md bg-surface border border-outline-variant text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        disabled={actionStatus === "SAVING"}
                    />
                ) : (
                    <p className="font-medium text-on-surface whitespace-pre-wrap text-sm leading-relaxed">
                        {content}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-2 self-end sm:self-start">
                {(initialStatus === "PENDING" || initialStatus === "DRAFT") ? (
                    <>
                        {isEditing ? (
                            <>
                                <Button
                                    size="sm"
                                    variant="outlined"
                                    className="h-8 w-8 p-0 rounded-full border-outline-variant text-on-surface-variant hover:bg-surface-variant"
                                    onClick={handleCancel}
                                    disabled={actionStatus === "SAVING"}
                                    aria-label="Cancel Edit"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="filled"
                                    className="h-8 w-8 p-0 rounded-full bg-primary hover:bg-primary/90"
                                    onClick={handleSave}
                                    isLoading={actionStatus === "SAVING"}
                                    aria-label="Save Changes"
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    size="sm"
                                    variant="outlined"
                                    className="h-8 w-8 p-0 rounded-full border-outline-variant text-on-surface-variant hover:bg-surface-variant"
                                    onClick={() => setIsEditing(true)}
                                    aria-label="Edit Post"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outlined"
                                    className="h-8 w-8 p-0 rounded-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700"
                                    onClick={handleReject}
                                    isLoading={actionStatus === "REJECTING"}
                                    aria-label="Reject Post"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="filled"
                                    className="h-8 w-8 p-0 rounded-full bg-green-600 hover:bg-green-700"
                                    onClick={handleApprove}
                                    isLoading={actionStatus === "APPROVING"}
                                    aria-label="Approve Post"
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </>
                ) : (
                    <div className="text-sm font-medium text-on-surface-variant/50 italic">
                        {initialStatus === "PUBLISHED" ? "Posted" : initialStatus}
                    </div>
                )}
            </div>
        </div>
    );
}
