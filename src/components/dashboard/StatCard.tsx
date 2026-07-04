import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend: string;
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex flex-col space-y-1">
                    <CardTitle className="text-sm font-medium text-on-surface-variant/80 uppercase tracking-wide">
                        {title}
                    </CardTitle>
                    <div className="text-3xl font-bold text-on-surface">{value}</div>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-on-surface-variant mt-1 font-medium bg-surface-variant/50 inline-block px-2 py-1 rounded-full">
                    {trend}
                </p>
            </CardContent>
        </Card>
    );
}
