"use client";

import React from "react";
import { ArrowRight, Flame, Share2, Sparkles } from "lucide-react";

interface TrendCardProps {
    title: string;
    source: string;
    publishedAt: string;
    viralScore: number;
    summary: string;
    onDraft: () => void;
}

export const TrendCard: React.FC<TrendCardProps> = ({
    title,
    source,
    publishedAt,
    viralScore,
    summary,
    onDraft,
}) => {
    // Determine color based on viral score
    const scoreColor =
        viralScore >= 80 ? "text-red-500" : viralScore >= 50 ? "text-orange-500" : "text-yellow-500";
    const bgGradient =
        viralScore >= 80
            ? "bg-gradient-to-r from-red-500/10 to-orange-500/10"
            : viralScore >= 50
                ? "bg-gradient-to-r from-orange-500/10 to-yellow-500/10"
                : "bg-gradient-to-r from-yellow-500/10 to-blue-500/10";

    return (
        <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm transition-all hover:border-white/20 hover:shadow-lg backdrop-blur-md">
            {/* Viral Badge */}
            <div className="mb-3 flex items-center justify-between">
                <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${bgGradient} ${scoreColor}`}>
                    <Flame size={12} className={viralScore >= 80 ? "fill-red-500" : ""} />
                    <span>Viral Score: {viralScore}/100</span>
                </div>
                <div className="text-xs text-zinc-400">{source} • {new Date(publishedAt).toLocaleDateString()}</div>
            </div>

            {/* Content */}
            <h3 className="mb-2 text-lg font-semibold leading-tight text-white group-hover:text-blue-400 transition-colors">
                {title}
            </h3>
            <p className="mb-4 text-sm text-zinc-400 line-clamp-3">
                {summary}
            </p>

            {/* Footer / Actions */}
            <div className="flex items-center justify-end border-t border-white/5 pt-4">
                <button
                    onClick={onDraft}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 active:scale-95 group/btn"
                >
                    <Sparkles size={16} />
                    <span>Draft Post</span>
                    <ArrowRight size={14} className="opacity-0 -ml-1 transition-all group-hover/btn:opacity-100 group-hover/btn:ml-0" />
                </button>
            </div>
        </div>
    );
};
