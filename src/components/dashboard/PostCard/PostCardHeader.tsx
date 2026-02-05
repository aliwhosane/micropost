import { Linkedin, Twitter, Clock, LucideIcon, AtSign, ChevronDown, ChevronUp } from "lucide-react";

interface PostCardHeaderProps {
    platform: string;
    topic: string;
    createdAt: Date;
    status: string;
    scheduledFor?: Date | null;
    isRegenerating: boolean;
    isCompact: boolean;
    onToggleCompact: () => void;
}

export function PostCardHeader({
    platform,
    topic,
    createdAt,
    status,
    scheduledFor,
    isRegenerating,
    isCompact,
    onToggleCompact
}: PostCardHeaderProps) {
    const PlatformIcon: LucideIcon = platform === "LINKEDIN" ? Linkedin : platform === "THREADS" ? AtSign : Twitter;
    const platformColor = platform === "LINKEDIN" ? "text-[#0077b5]" : platform === "THREADS" ? "text-black dark:text-white" : "text-[#1DA1F2]";

    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-full bg-white/5 border border-black/5 dark:border-white/10 ${platformColor} bg-opacity-10`}>
                    <PlatformIcon className={`h-4 w-4 ${platformColor}`} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface uppercase tracking-wide opacity-90">
                        {topic}
                    </span>
                    <span className="text-[10px] font-medium text-on-surface-variant/70">
                        {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {isRegenerating && <span className="text-xs text-primary animate-pulse font-medium">Regenerating...</span>}

                {/* Status Badges */}
                {!isCompact && (
                    <>
                        {status === "PUBLISHED" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">PUBLISHED</span>
                        )}
                        {status === "FAILED" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20">FAILED</span>
                        )}
                        {(status === "APPROVED" && scheduledFor) && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                                <Clock className="w-3 h-3" />
                                SCHEDULED
                            </span>
                        )}
                    </>
                )}

                {/* Toggle Button */}
                <button
                    onClick={onToggleCompact}
                    className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-on-surface-variant transition-colors"
                >
                    {isCompact ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}
