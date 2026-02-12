"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Sparkles, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface PremiumGateProps {
    title?: string;
    description?: string;
    features?: string[];
    requiredTier?: "PRO" | "AGENCY";
    children?: React.ReactNode;
}

export function PremiumGate({
    title = "Premium Feature",
    description = "Upgrade to unlock this powerful tool.",
    features = [],
    requiredTier = "PRO",
    children
}: PremiumGateProps) {
    return (
        <div className="relative w-full h-full min-h-[400px] flex items-center justify-center p-6">
            {/* Background Blur Effect */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
                <div className="w-full h-full opacity-30 blur-sm pointer-events-none select-none filter">
                    {children}
                </div>
                <div className="absolute inset-0 bg-surface/50 backdrop-blur-md z-10" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative z-20 max-w-md w-full"
            >
                <Card className="border-primary/20 shadow-2xl bg-surface-container">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                            <Lock className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-on-surface">{title}</CardTitle>
                        <CardDescription className="text-on-surface-variant font-medium mt-2">{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        {features.length > 0 && (
                            <ul className="space-y-3">
                                {features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-on-surface/80">
                                        <div className="p-1 rounded-full bg-primary/10 text-primary">
                                            <Sparkles className="w-3 h-3" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                    <CardFooter className="pt-2 pb-6">
                        <Link href="/dashboard/settings#billing" className="w-full">
                            <Button className="w-full font-bold shadow-lg shadow-primary/20" size="lg" variant="filled">
                                Upgrade to {requiredTier === "AGENCY" ? "Agency" : "Pro"}
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
