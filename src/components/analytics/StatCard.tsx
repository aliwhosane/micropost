import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: string | number;
    trend?: string;
    trendType?: "up" | "down" | "neutral";
    icon?: React.ReactNode;
    className?: string;
}

export function StatCard({ label, value, trend, trendType = "neutral", icon, className }: StatCardProps) {
    return (
        <Card className={cn("border-outline-variant/10 shadow-sm", className)}>
            <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-on-surface-variant">{label}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-on-surface tracking-tight">{value}</h3>
                        {trend && (
                            <span className={cn(
                                "text-xs font-medium px-1.5 py-0.5 rounded-full",
                                trendType === "up" ? "bg-green-500/10 text-green-600" :
                                    trendType === "down" ? "bg-red-500/10 text-red-600" :
                                        "bg-surface-variant text-on-surface-variant"
                            )}>
                                {trend}
                            </span>
                        )}
                    </div>
                </div>
                {icon && (
                    <div className="h-12 w-12 rounded-2xl bg-surface-variant/30 flex items-center justify-center text-on-surface-variant/80">
                        {icon}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
