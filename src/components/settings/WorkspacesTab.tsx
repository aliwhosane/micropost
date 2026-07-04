"use client";

import { ClientList } from "@/components/dashboard/ClientList";
import { Users } from "lucide-react";

type Client = {
    id: string;
    name: string;
    niche?: string | null;
    bio?: string | null;
    tone?: string | null;
    avatarUrl?: string | null;
    accounts?: any[];
};

interface WorkspacesTabProps {
    initialClients: Client[];
}

export function WorkspacesTab({ initialClients }: WorkspacesTabProps) {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-tertiary/10 text-tertiary">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-on-surface">
                        Client Workspaces
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                        Manage profiles, voice settings, and social accounts for each client.
                    </p>
                </div>
            </div>

            <ClientList initialClients={initialClients} />
        </div>
    );
}
