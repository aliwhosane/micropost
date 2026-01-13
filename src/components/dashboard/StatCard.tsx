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
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-on-surface-variant">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-on-surface-variant" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-on-surface">{value}</div>
                <p className="text-xs text-on-surface-variant mt-1">
                    <span className="text-primary font-medium">{trend}</span>
                </p>
            </CardContent>
        </Card>
    );
}
