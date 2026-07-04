"use client";

import { AnalyzeStyleCard } from "@/components/dashboard/Settings/AnalyzeStyleCard";
import { ProfileOptimizerSection } from "@/components/dashboard/Settings/ProfileOptimizerSection";
import { Sparkles, Mic } from "lucide-react";

interface VoiceTabProps {
    styleSample: string;
    isTwitterConnected: boolean;
}

export function VoiceTab({ styleSample, isTwitterConnected }: VoiceTabProps) {
    return (
        <div className="space-y-10">
            {/* Hero section for the Voice tab */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-surface to-tertiary/5 border border-outline-variant/20 p-8 sm:p-10">
                <div className="absolute top-4 right-4 opacity-[0.06]">
                    <Mic className="w-48 h-48 -rotate-12" />
                </div>
                <div className="relative z-10 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        Your Unique Voice
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface mb-3">
                        {styleSample
                            ? "Your writing style has been captured"
                            : "Define your writing voice"}
                    </h3>
                    <p className="text-on-surface-variant leading-relaxed">
                        {styleSample
                            ? "The AI ghostwriter mimics your tone, rhythm, and vocabulary. Update it anytime by pasting new samples."
                            : "Paste your best-performing posts below. We'll analyze your unique voice and match it across all generated content."}
                    </p>
                </div>
            </div>

            {/* Style Analyzer */}
            <section className="space-y-6">
                <AnalyzeStyleCard
                    initialSample={styleSample}
                    isTwitterConnected={isTwitterConnected}
                />
            </section>

            {/* Bio / Profile Optimizer */}
            <ProfileOptimizerSection />
        </div>
    );
}
