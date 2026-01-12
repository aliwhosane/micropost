"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { analyzeSocialStyleAction } from "@/lib/actions";
import { Sparkles } from "lucide-react";

interface AnalyzeButtonProps {
    platform: "TWITTER";
    isConnected: boolean;
}

export function AnalyzeButton({ platform, isConnected }: AnalyzeButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleAnalyze = () => {
        if (!isConnected) return;

        startTransition(async () => {
            try {
                await analyzeSocialStyleAction(platform);
                alert("Style analysis complete! Check the style sample box.");
            } catch (error) {
                console.error(error);
                alert("Failed to analyze style. Make sure you have enough recent original tweets (no replies).");
            }
        });
    };

    return (
        <Button
            type="button"
            variant="outlined"
            size="sm"
            onClick={handleAnalyze}
            disabled={!isConnected || isPending}
            className="w-full sm:w-auto"
        >
            <Sparkles className={`mr-2 h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
            {isPending ? "Analyzing..." : "Analyze My Tweets"}
        </Button>
    );
}
