"use client";

import { Button } from "@/components/ui/Button";
import { Linkedin, Twitter, Check, AtSign, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { disconnectAccount } from "@/lib/actions";

interface SocialConnectionProps {
    provider: "twitter" | "linkedin" | "threads";
    isConnected: boolean;
    isExpired?: boolean;
    clientId?: string | null;
}

export function SocialConnection({ provider, isConnected, isExpired, clientId }: SocialConnectionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const handleConnect = async () => {
        setIsLoading(true);
        // Set cookie so server-side linkAccount knows which profile to attach to
        if (clientId) {
            document.cookie = `micropost_connecting_client_id=${clientId}; path=/; max-age=300`;
        } else {
            // Clear it if connecting for personal (explicit null)
            document.cookie = "micropost_connecting_client_id=; path=/; max-age=0";
        }

        try {
            await signIn(provider, { callbackUrl: "/dashboard/settings" });
        } catch (error) {
            console.error("Failed to connect:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleDisconnect = async () => {
        setIsLoading(true);
        try {
            await disconnectAccount(provider);
        } catch (error) {
            console.error("Failed to disconnect:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const isTwitter = provider === "twitter";
    const isThreads = provider === "threads";

    const brandColor = isTwitter ? "text-[#1DA1F2]" : isThreads ? "text-black dark:text-white" : "text-[#0077b5]";
    const brandBg = isTwitter ? "bg-[#1DA1F2]/10" : isThreads ? "bg-black/5 dark:bg-white/10" : "bg-[#0077b5]/10";
    const label = isTwitter ? "Twitter / X" : isThreads ? "Threads" : "LinkedIn";

    return (
        <div className={cn(
            "flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
            isConnected && !isExpired
                ? "bg-surface border-primary/20 shadow-sm"
                : isExpired
                    ? "bg-error/5 border-error/20"
                    : "bg-surface-container-low border-transparent hover:border-outline-variant/30"
        )}>
            <div className="flex items-center gap-4">
                <div className={cn("p-2.5 rounded-lg", brandBg, brandColor)}>
                    {isTwitter ? <Twitter className="h-5 w-5 fill-current" /> : isThreads ? <AtSign className="h-5 w-5" /> : <Linkedin className="h-5 w-5 fill-current" />}
                </div>
                <div>
                    <div className="font-semibold text-sm text-on-surface">{label}</div>
                    <div className="text-xs text-on-surface-variant flex items-center mt-0.5">
                        {isConnected && !isExpired ? (
                            <span className="text-primary flex items-center font-medium">
                                <Check className="h-3 w-3 mr-1" /> Connected
                            </span>
                        ) : isExpired ? (
                            <span className="text-error flex items-center font-medium">
                                <AlertCircle className="h-3 w-3 mr-1" /> Session Expired
                            </span>
                        ) : (
                            "Not connected"
                        )}
                    </div>
                </div>
            </div>
            {isConnected && !isExpired ? (
                <Button
                    size="sm"
                    variant="outlined"
                    className="border-outline-variant/50 text-on-surface-variant hover:text-error hover:border-error/30 hover:bg-error/5 h-8 px-3"
                    onClick={handleDisconnect}
                    disabled={isLoading}
                >
                    Disconnect
                </Button>
            ) : isExpired ? (
                <Button
                    size="sm"
                    variant="tonal"
                    className="h-8 px-4 bg-error/10 text-error hover:bg-error/20"
                    onClick={handleConnect}
                    isLoading={isLoading}
                >
                    Reconnect
                </Button>
            ) : (
                <Button
                    size="sm"
                    variant="tonal"
                    className="h-8 px-4"
                    onClick={handleConnect}
                    isLoading={isLoading}
                >
                    Connect
                </Button>
            )}
        </div>
    );
}
