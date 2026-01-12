"use client";

import { Button } from "@/components/ui/Button";
import { Linkedin, Twitter } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface SocialConnectionProps {
    provider: "twitter" | "linkedin";
    isConnected: boolean;
}

export function SocialConnection({ provider, isConnected }: SocialConnectionProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleConnect = async () => {
        setIsLoading(true);
        try {
            // Sign in with the provider. 
            // If the user is already logged in, NextAuth (with Prisma Adapter) 
            // should check for existing accounts or link this new one.
            // Note: In some setups, you might need to handle 'allowDangerousEmailAccountLinking: true' 
            // in auth config if emails conflict, but for 'Connect' button flow 
            // we assume the user is triggering it to link.
            await signIn(provider, { callbackUrl: "/dashboard/settings" });
        } catch (error) {
            console.error("Failed to connect:", error);
            alert(`Failed to connect: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisconnect = async () => {
        // Disconnection usually requires a server action to delete the Account record
        // We will implement this as a prop or call a separate action.
        // For now, imply that this functionality is coming.
        alert("Disconnection logic requires deleting the account connection from the database.");
    };

    const icon = provider === "twitter" ? (
        <Twitter className={`h-5 w-5 ${isConnected ? "text-[#1DA1F2]" : "text-on-surface-variant"}`} />
    ) : (
        <Linkedin className={`h-5 w-5 ${isConnected ? "text-[#0077b5]" : "text-on-surface-variant"}`} />
    );

    const label = provider === "twitter" ? "Twitter / X" : "LinkedIn";

    return (
        <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant/30 bg-surface-variant/10">
            <div className="flex items-center gap-3">
                {icon}
                <span className="font-medium text-sm">{label}</span>
            </div>
            {isConnected ? (
                <Button
                    size="sm"
                    variant="outlined"
                    className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={handleDisconnect}
                    disabled={isLoading}
                >
                    Disconnect
                </Button>
            ) : (
                <Button
                    size="sm"
                    variant="filled"
                    onClick={handleConnect}
                    isLoading={isLoading}
                >
                    Connect
                </Button>
            )}
        </div>
    );
}
