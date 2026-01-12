import { cn } from "@/lib/utils";

interface BrandLogoProps {
    className?: string; // For container sizing/positioning
    iconClassName?: string; // For explicit SVG styling if needed (e.g. text color)
    variant?: "icon-only" | "full";
    size?: "sm" | "md" | "lg" | "xl";
}

export function BrandLogo({ className, variant = "full", size = "md" }: BrandLogoProps) {
    // Size mapping for the container
    const sizeClasses = {
        sm: "h-6 text-lg",
        md: "h-8 text-xl",
        lg: "h-10 text-2xl",
        xl: "h-14 text-4xl",
    };

    const iconSizes = {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-10 w-10",
        xl: "h-14 w-14",
    };

    return (
        <div className={cn("flex items-center gap-2 font-bold tracking-tight text-primary", sizeClasses[size], className)}>
            <div className={cn("relative flex items-center justify-center", iconSizes[size])}>
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full text-primary"
                >
                    <path
                        d="M20 80V20L50 50L80 20V80"
                        stroke="currentColor"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                    />
                    <path
                        d="M20 80V20L50 50L80 20V80"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-50"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                            <stop stopColor="currentcolor" stopOpacity="0.2" />
                            <stop offset="1" stopColor="currentcolor" stopOpacity="0.8" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            {variant === "full" && <span>Micropost AI</span>}
        </div>
    );
}
