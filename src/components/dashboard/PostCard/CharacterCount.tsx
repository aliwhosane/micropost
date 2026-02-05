import { cva } from "class-variance-authority";

interface CharacterCountProps {
    current: number;
    limit: number;
}

const circleVariants = cva("transition-all duration-300 ease-in-out", {
    variants: {
        status: {
            safe: "text-emerald-500",
            warning: "text-amber-500",
            danger: "text-red-500",
        },
    },
    defaultVariants: {
        status: "safe",
    },
});

export function CharacterCount({ current, limit }: CharacterCountProps) {
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min((current / limit) * 100, 100);
    const dashoffset = circumference - (percentage / 100) * circumference;

    let status: "safe" | "warning" | "danger" = "safe";
    const remaining = limit - current;

    if (remaining <= 0) status = "danger";
    else if (remaining <= 20) status = "warning";

    return (
        <div className="relative flex items-center justify-center group">
            {/* Tooltip on hover */}
            <div className={`absolute -top-8 right-0 bg-surface-variant text-on-surface text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none ${remaining < 0 ? 'text-error' : ''}`}>
                {remaining} chars left
            </div>

            <svg className="transform -rotate-90 w-6 h-6">
                {/* Background Circle */}
                <circle
                    cx="12"
                    cy="12"
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-outline-variant/20"
                />
                {/* Progress Circle */}
                <circle
                    cx="12"
                    cy="12"
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    strokeLinecap="round"
                    className={circleVariants({ status })}
                />
            </svg>

            {/* Text fallback for screen readers or if visual is not enough */}
            <span className="sr-only">{current} / {limit} characters</span>
        </div>
    );
}
