"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Hash, Sparkles, ThumbsUp, ThumbsDown, Scale, HelpCircle, Save, X } from "lucide-react";
import Link from "next/link";
import { updateTopicPreferences } from "@/lib/actions";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface Topic {
    id: string;
    name: string;
    notes?: string | null;
    stance?: string | null;
}

interface ActiveTopicsCardProps {
    activeTopics: Topic[];
}

export function ActiveTopicsCard({ activeTopics }: ActiveTopicsCardProps) {
    const [editingId, setEditingId] = useState<string | null>(null);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-tertiary" />
                    <span>Active Topics</span>
                </CardTitle>
                <CardDescription>Customize your stance and notes for better AI alignment.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activeTopics.map((topic) => (
                        <TopicItem
                            key={topic.id}
                            topic={topic}
                            isEditing={editingId === topic.id}
                            onEdit={() => setEditingId(topic.id)}
                            onCancel={() => setEditingId(null)}
                            onSave={() => setEditingId(null)}
                        />
                    ))}
                    {activeTopics.length === 0 && (
                        <div className="text-center py-8 px-4 rounded-xl border border-dashed border-outline-variant/50">
                            <p className="text-sm text-on-surface-variant">No active topics found.</p>
                            <Link href="/dashboard/topics">
                                <Button variant="text" className="mt-2 text-primary h-auto p-0" >
                                    Create your first topic &rarr;
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function TopicItem({
    topic,
    isEditing,
    onEdit,
    onCancel,
    onSave
}: {
    topic: Topic;
    isEditing: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
}) {
    const [notes, setNotes] = useState(topic.notes || "");
    const [stance, setStance] = useState(topic.stance || "NEUTRAL");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateTopicPreferences(topic.id, notes, stance);
            onSave();
        } catch (error) {
            console.error("Failed to save topic preferences", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isEditing) {
        return (
            <div className="p-4 rounded-3xl bg-surface-variant/30 border border-primary/20 space-y-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-on-surface text-lg">{topic.name}</span>
                    <Button size="icon" variant="ghost" onClick={onCancel} disabled={isSaving} className="h-8 w-8 rounded-full">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Your Stance</label>
                    <div className="flex gap-2">
                        <StanceButton current={stance} value="PRO" onClick={setStance} icon={ThumbsUp} label="Pro" />
                        <StanceButton current={stance} value="ANTI" onClick={setStance} icon={ThumbsDown} label="Critic" />
                        <StanceButton current={stance} value="NEUTRAL" onClick={setStance} icon={Scale} label="Neutral" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Standing Notes</label>
                    <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="E.g. Focus on technical details..."
                        className="bg-surface text-sm rounded-2xl border-outline-variant/20 focus:border-primary/50 text-base"
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <Button size="sm" onClick={handleSave} disabled={isSaving} className="rounded-full px-6">
                        {isSaving ? "Saving..." : <><Save className="mr-2 h-3 w-3" /> Save Changes</>}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onEdit}
            className="group flex flex-col p-4 rounded-3xl bg-surface hover:bg-surface-variant/30 border border-outline-variant/10 hover:border-primary/20 transition-all cursor-pointer shadow-sm hover:shadow-md"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110", getStanceColor(topic.stance))}>
                        {getStanceIcon(topic.stance)}
                    </div>
                    <div>
                        <span className="font-bold text-on-surface group-hover:text-primary transition-colors text-base">{topic.name}</span>
                        {topic.stance && topic.stance !== "NEUTRAL" && (
                            <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant font-bold uppercase tracking-wider">{topic.stance}</span>
                        )}
                    </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">
                    Edit
                </div>
            </div>
            {topic.notes && (
                <p className="mt-3 text-sm text-on-surface-variant line-clamp-2 pl-4 border-l-2 border-primary/20 ml-5 font-medium opacity-80">
                    {topic.notes}
                </p>
            )}
        </div>
    );
}

function StanceButton({ current, value, onClick, icon: Icon, label }: { current?: string | null, value: string, onClick: (val: string) => void, icon: any, label: string }) {
    const isSelected = current === value;
    return (
        <button
            onClick={() => onClick(value)}
            className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-all ${isSelected
                ? "bg-primary/10 border-primary text-primary"
                : "bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-variant"
                }`}
        >
            <Icon className={`h-4 w-4 ${isSelected ? "fill-current" : ""}`} />
            <span>{label}</span>
        </button>
    );
}

function getStanceIcon(stance?: string | null) {
    switch (stance) {
        case "PRO": return <ThumbsUp className="h-4 w-4" />;
        case "ANTI": return <ThumbsDown className="h-4 w-4" />;
        case "NEUTRAL": return <Scale className="h-4 w-4" />;
        default: return <Hash className="h-4 w-4" />;
    }
}

function getStanceColor(stance?: string | null) {
    switch (stance) {
        case "PRO": return "bg-green-100 text-green-700";
        case "ANTI": return "bg-red-100 text-red-700";
        case "NEUTRAL": return "bg-blue-100 text-blue-700";
        default: return "bg-tertiary/10 text-tertiary";
    }
}
