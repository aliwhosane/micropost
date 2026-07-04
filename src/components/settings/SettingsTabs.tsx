"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { VoiceTab } from "@/components/settings/VoiceTab";
import { PlatformsTab } from "@/components/settings/PlatformsTab";
import { ContentTab } from "@/components/settings/ContentTab";
import { AutoApproveTab } from "@/components/settings/AutoApproveTab";
import { WorkspacesTab } from "@/components/settings/WorkspacesTab";
import { BillingTab } from "@/components/settings/BillingTab";
import { Mic, Globe, Wand2, Zap, Users, CreditCard } from "lucide-react";

type Client = {
    id: string;
    name: string;
    niche?: string | null;
    bio?: string | null;
    tone?: string | null;
    avatarUrl?: string | null;
    accounts?: any[];
};

interface SettingsTabsProps {
    // Voice
    styleSample: string;
    isTwitterConnected: boolean;
    // Platforms
    accounts: any[];
    activeClientId?: string | null;
    // Content
    twitterPostsPerDay: number;
    linkedinPostsPerDay: number;
    threadsPostsPerDay: number;
    postsPerDay: number;
    // Workspaces
    isAgency: boolean;
    initialClients: Client[];
    // Billing
    subscriptionStatus: string | null;
    productIdPro: string;
    productIdAgencyMonthly: string;
    productIdAgencyYearly: string;
}

export function SettingsTabs({
    styleSample,
    isTwitterConnected,
    accounts,
    activeClientId,
    twitterPostsPerDay,
    linkedinPostsPerDay,
    threadsPostsPerDay,
    postsPerDay,
    isAgency,
    initialClients,
    subscriptionStatus,
    productIdPro,
    productIdAgencyMonthly,
    productIdAgencyYearly,
}: SettingsTabsProps) {
    return (
        <Tabs defaultValue="voice" className="w-full">
            <TabsList className="mb-8 flex flex-wrap gap-1 bg-surface-container-low/80 backdrop-blur-sm border border-outline-variant/20 p-1.5 rounded-xl shadow-sm w-full sm:w-auto sm:inline-flex">
                <TabsTrigger value="voice" className="gap-2 rounded-lg px-4 py-2 text-sm">
                    <Mic className="w-4 h-4" />
                    Voice
                </TabsTrigger>
                <TabsTrigger value="platforms" className="gap-2 rounded-lg px-4 py-2 text-sm">
                    <Globe className="w-4 h-4" />
                    Platforms
                </TabsTrigger>
                <TabsTrigger value="content" className="gap-2 rounded-lg px-4 py-2 text-sm">
                    <Wand2 className="w-4 h-4" />
                    Content
                </TabsTrigger>
                <TabsTrigger value="automation" className="gap-2 rounded-lg px-4 py-2 text-sm">
                    <Zap className="w-4 h-4" />
                    Automation
                </TabsTrigger>
                {isAgency && (
                    <TabsTrigger value="workspaces" className="gap-2 rounded-lg px-4 py-2 text-sm">
                        <Users className="w-4 h-4" />
                        Workspaces
                    </TabsTrigger>
                )}
                <TabsTrigger value="billing" className="gap-2 rounded-lg px-4 py-2 text-sm">
                    <CreditCard className="w-4 h-4" />
                    Billing
                </TabsTrigger>
            </TabsList>

            <TabsContent value="voice">
                <VoiceTab
                    styleSample={styleSample}
                    isTwitterConnected={isTwitterConnected}
                />
            </TabsContent>

            <TabsContent value="platforms">
                <PlatformsTab
                    accounts={accounts}
                    activeClientId={activeClientId}
                />
            </TabsContent>

            <TabsContent value="content">
                <ContentTab
                    twitterPostsPerDay={twitterPostsPerDay}
                    linkedinPostsPerDay={linkedinPostsPerDay}
                    threadsPostsPerDay={threadsPostsPerDay}
                    postsPerDay={postsPerDay}
                />
            </TabsContent>

            <TabsContent value="automation">
                <AutoApproveTab />
            </TabsContent>

            {isAgency && (
                <TabsContent value="workspaces">
                    <WorkspacesTab initialClients={initialClients} />
                </TabsContent>
            )}

            <TabsContent value="billing">
                <BillingTab
                    subscriptionStatus={subscriptionStatus}
                    productIdPro={productIdPro}
                    productIdAgencyMonthly={productIdAgencyMonthly}
                    productIdAgencyYearly={productIdAgencyYearly}
                />
            </TabsContent>
        </Tabs>
    );
}
