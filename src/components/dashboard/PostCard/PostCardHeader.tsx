import { Linkedin, Twitter, Clock, LucideIcon, AtSign } from "lucide-react";

interface PostCardHeaderProps {
    platform: string;
    topic: string;
    createdAt: Date;
    status: string;
    scheduledFor?: Date | null;
    isRegenerating: boolean;
}

export function PostCardHeader({
    platform,
    topic,
    createdAt,
    status,
    scheduledFor,
    isRegenerating
}: PostCardHeaderProps) {
    const PlatformIcon: LucideIcon = platform === "LINKEDIN" ? Linkedin : platform === "THREADS" ? AtSign : Twitter;
    const platformColor = platform === "LINKEDIN" ? "text-[#0077b5]" : platform === "THREADS" ? "text-black dark:text-white" : "text-[#1DA1F2]";

    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
                <PlatformIcon className={`h-5 w-5 ${platformColor}`} />
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    {topic}
                </span>
                <span className="text-xs text-on-surface-variant">• {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <div className="flex items-center gap-2">
                {isRegenerating && <span className="text-xs text-primary animate-pulse font-medium">Regenerating...</span>}
                {status === "PUBLISHED" && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">PUBLISHED</span>
                )}
                {status === "FAILED" && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">FAILED</span>
                )}
                {(status === "APPROVED" && scheduledFor) && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        <Clock className="w-3 h-3" />
                        SCHEDULED
                    </span>
                )}
            </div>
        </div>
    );
}
