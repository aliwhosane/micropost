"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Hash } from "lucide-react";
import Link from "next/link";

interface Topic {
    id: string;
    name: string;
}

interface ActiveTopicsCardProps {
    activeTopics: Topic[];
}

export function ActiveTopicsCard({ activeTopics }: ActiveTopicsCardProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-tertiary" />
                    <span>Active Topics</span>
                </CardTitle>
                <CardDescription>Topics currently driving your content generation.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {activeTopics.map((topic) => (
                        <div key={topic.id} className="group flex items-center justify-between p-3 rounded-xl bg-surface-variant/30 border border-transparent hover:border-outline-variant hover:bg-surface-variant/50 transition-all cursor-default">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                                    <Hash className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-on-surface group-hover:text-primary transition-colors">{topic.name}</span>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                        </div>
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
