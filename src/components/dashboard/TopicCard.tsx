"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent } from "@/components/ui/Card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { PenTool, CheckCircle2, XCircle, Trash2, Save, X, Edit2 } from "lucide-react";
import { deleteTopic, toggleTopic, updateTopicPreferences } from "@/lib/actions";

interface Topic {
    id: string;
    name: string;
    enabled: boolean;
    notes?: string | null;
    stance?: string | null;
}

export function TopicCard({ topic }: { topic: Topic }) {
    const [isEditing, setIsEditing] = useState(false);
    const [notes, setNotes] = useState(topic.notes || "");
    const [stance, setStance] = useState(topic.stance || "NEUTRAL");
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateTopicPreferences(topic.id, notes, stance);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update topic:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setNotes(topic.notes || "");
        setStance(topic.stance || "NEUTRAL");
        setIsEditing(false);
    };

    return (
        <Card className="relative overflow-hidden group transition-all hover:shadow-md">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">

                    {/* Icon & Main Info */}
                    <div className="flex items-start gap-3 flex-1">
                        <div className="h-10 w-10 rounded-lg bg-secondary-container flex items-center justify-center shrink-0 mt-1">
                            <PenTool className="h-5 w-5 text-on-secondary-container" />
                        </div>

                        <div className="space-y-2 w-full">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg text-on-surface leading-none">{topic.name}</h3>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium ${topic.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                    {topic.enabled ? "Active" : "Paused"}
                                </span>
                            </div>

                            {isEditing ? (
                                <div className="space-y-4 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-on-surface-variant">Stance</label>
                                            <Select value={stance} onValueChange={setStance}>
                                                <SelectTrigger className="h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PRO">Pro / Positive</SelectItem>
                                                    <SelectItem value="ANTI">Anti / Critical</SelectItem>
                                                    <SelectItem value="NEUTRAL">Neutral / Objective</SelectItem>
                                                    <SelectItem value="BOTH">Both Sides</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-on-surface-variant">Notes & Context</label>
                                        <Textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Add specific instructions, angles, or things to mention..."
                                            className="min-h-[80px] text-sm"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button size="sm" variant="text" onClick={handleCancel} disabled={isLoading}>
                                            <X className="h-4 w-4 mr-1" /> Cancel
                                        </Button>
                                        <Button size="sm" variant="filled" onClick={handleSave} disabled={isLoading}>
                                            <Save className="h-4 w-4 mr-1" /> Save
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2 mt-1">
                                    <div className="flex items-center gap-2 text-sm text-on-surface-variant/80">
                                        <span className="inline-flex items-center rounded-md bg-surface-container px-2 py-1 text-xs font-medium text-on-surface-variant ring-1 ring-inset ring-outline-variant/30">
                                            {stance}
                                        </span>
                                        {topic.notes && (
                                            <span className="text-xs truncate max-w-[200px] italic">
                                                "{topic.notes}"
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    {!isEditing && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 bg-surface/80 backdrop-blur-sm p-1 rounded-lg">
                            <Button size="icon" variant="text" onClick={() => setIsEditing(true)} title="Edit Details">
                                <Edit2 className="h-4 w-4 text-primary" />
                            </Button>

                            <form action={async () => {
                                await toggleTopic(topic.id, topic.enabled);
                            }}>
                                <Button size="icon" variant="text" title={topic.enabled ? "Disable" : "Enable"}>
                                    {topic.enabled ? <XCircle className="h-4 w-4 text-on-surface-variant" /> : <CheckCircle2 className="h-4 w-4 text-primary" />}
                                </Button>
                            </form>

                            <form action={async () => {
                                await deleteTopic(topic.id);
                            }}>
                                <Button size="icon" variant="text" title="Delete" className="text-error hover:bg-error/10">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </CardContent>
            {/* Decorative background element */}
            <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Card>
    );
}
