"use client";

import { Loader2, PlayCircle } from "lucide-react";

interface TopicInputProps {
    input: string;
    setInput: (value: string) => void;
    handleGenerateScript: () => void;
    loading: boolean;
    hasScriptData: boolean;
    onNext: () => void;
}

export function TopicInput({
    input,
    setInput,
    handleGenerateScript,
    loading,
    hasScriptData,
    onNext
}: TopicInputProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant">What is your video about?</label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Example: 3 tips for staying productive while working from home..."
                    className="w-full h-40 bg-surface-variant/30 border border-transparent rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all placeholder:text-on-surface-variant/50"
                />
            </div>
            <div className="flex gap-4">
                <button
                    onClick={handleGenerateScript}
                    disabled={loading || !input}
                    className="flex-1 py-4 bg-primary hover:bg-primary/90 text-on-primary rounded-full font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md hover:shadow-lg hover:shadow-primary/25"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
                    {hasScriptData ? "Regenerate Script" : "Generate Script"}
                </button>

                {/* Show Continue button if script already exists */}
                {hasScriptData && (
                    <button
                        onClick={onNext}
                        className="px-8 py-4 bg-surface-variant/50 hover:bg-surface-variant text-on-surface rounded-full font-bold transition-all border border-outline-variant/10"
                    >
                        Continue →
                    </button>
                )}
            </div>
            {hasScriptData && <p className="text-xs text-tertiary text-center">*Regenerating will overwrite your current script.</p>}
        </div>
    );
}
