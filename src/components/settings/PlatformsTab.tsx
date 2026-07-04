"use client";

import { SocialConnection } from "@/components/settings/SocialConnection";
import { Card, CardContent } from "@/components/ui/Card";
import { Shield, Globe } from "lucide-react";

interface AccountInfo {
    provider: string;
    refresh_token?: string | null;
    expires_at?: number | null;
}

interface PlatformsTabProps {
    accounts: AccountInfo[];
    activeClientId?: string | null;
}

export function PlatformsTab({ accounts, activeClientId }: PlatformsTabProps) {
    const getAccount = (provider: string) =>
        accounts.find((a) => a.provider === provider);

    const checkExpired = (account: AccountInfo | undefined) => {
        if (!account) return false;
        if (account.refresh_token) return false;
        if (!account.expires_at) return false;
        return account.expires_at < Math.floor(Date.now() / 1000);
    };

    const linkedin = getAccount("linkedin");
    const twitter = getAccount("twitter");
    const threads = getAccount("threads");

    const connectedCount = [linkedin, twitter, threads].filter(Boolean).length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
                    <Globe className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-on-surface">
                        Connected Platforms
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                        {connectedCount}/3 platforms connected
                    </p>
                </div>
            </div>

            {/* Connection cards */}
            <Card className="border-outline-variant/30 shadow-sm bg-surface">
                <CardContent className="pt-6 space-y-4">
                    <p className="text-sm text-on-surface-variant mb-2">
                        Connect accounts to enable auto-publishing.
                    </p>

                    <SocialConnection
                        provider="twitter"
                        isConnected={!!twitter}
                        isExpired={checkExpired(twitter)}
                        clientId={activeClientId}
                    />
                    <SocialConnection
                        provider="linkedin"
                        isConnected={!!linkedin}
                        isExpired={checkExpired(linkedin)}
                        clientId={activeClientId}
                    />
                    <SocialConnection
                        provider="threads"
                        isConnected={!!threads}
                        isExpired={checkExpired(threads)}
                        clientId={activeClientId}
                    />
                </CardContent>
            </Card>

            {/* Security note */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
                <Shield className="w-5 h-5 text-on-surface-variant/60 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-sm font-medium text-on-surface">OAuth 2.0 Secured</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                        We never store your passwords. Tokens are encrypted at rest and auto-refresh when possible.
                    </p>
                </div>
            </div>
        </div>
    );
}
