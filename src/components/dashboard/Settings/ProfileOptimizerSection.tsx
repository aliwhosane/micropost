"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { UserCog } from "lucide-react";
import { BioOptimizer } from "@/components/tools/BioOptimizer";

export function ProfileOptimizerSection() {
    return (
        <section id="profile" className="scroll-mt-24 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                    <UserCog className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">Profile Optimizer</h2>
            </div>
            <Card className="overflow-hidden border-outline-variant/30 shadow-sm bg-surface">
                <CardHeader className="border-b border-outline-variant/10 pb-6">
                    <CardTitle className="text-lg">AI Bio Generator</CardTitle>
                    <CardDescription className="mt-1">
                        Create a high-converting bio for your social profiles.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <BioOptimizer
                        saveLabel="Copy to Clipboard"
                        onSave={(bio) => {
                            if (typeof navigator !== "undefined") {
                                navigator.clipboard.writeText(bio);
                            }
                        }}
                    />
                </CardContent>
            </Card>
        </section>
    );
}
