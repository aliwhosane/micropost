"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { Plus } from "lucide-react";
import { addTopic } from "@/lib/actions";

export function AddTopicForm() {
    const [stance, setStance] = useState("NEUTRAL");

    return (
        <form action={addTopic} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Topic Name</label>
                    <Input
                        name="topic"
                        placeholder="e.g. 'React Server Components', 'SaaS Marketing'"
                        className="focus:border-primary"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Stance</label>
                    <Select value={stance} onValueChange={setStance}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a stance" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PRO">Pro / Positive</SelectItem>
                            <SelectItem value="ANTI">Anti / Critical</SelectItem>
                            <SelectItem value="NEUTRAL">Neutral / Objective</SelectItem>
                            <SelectItem value="BOTH">Both Sides</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* Hidden input to pass the selected stance value to the server action */}
                    <input type="hidden" name="stance" value={stance} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface">Notes / Context (Optional)</label>
                <Textarea
                    name="notes"
                    placeholder="Add any specific thoughts, angles, or instructions for this topic..."
                    className="focus:border-primary min-h-[80px]"
                />
            </div>

            <div className="flex justify-end pt-2">
                <Button type="submit" variant="filled" className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
                    <Plus className="mr-2 h-4 w-4" /> Add Topic
                </Button>
            </div>
        </form>
    );
}
