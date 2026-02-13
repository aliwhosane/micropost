"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check,
    Twitter,
    Wand2,
    PenTool,
    Sparkles,
    Send,
    X,
    ChevronRight,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface GettingStartedProps {
    progress: {
        twitterConnected: boolean;
        contentAnalyzed: boolean;
        topicsAdded: boolean;
        generatedInfo: boolean;
        postPublished: boolean;
    };
}

export function GettingStarted({ progress }: GettingStartedProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();

    const steps = [
        {
            id: "twitterConnected",
            title: "Connect Twitter",
            shortTitle: "Connect",
            description: "Link account",
            icon: Twitter,
            href: "/dashboard/settings#connections",
            completed: progress.twitterConnected,
            action: "Connect",
        },
        {
            id: "contentAnalyzed",
            title: "Analyze Content",
            shortTitle: "Analyze",
            description: "Train AI",
            icon: Wand2,
            href: "/dashboard/settings#content",
            completed: progress.contentAnalyzed,
            action: "Analyze",
        },
        {
            id: "topicsAdded",
            title: "Add Topics",
            shortTitle: "Topics",
            description: "Define niche",
            icon: PenTool,
            href: "/dashboard/topics",
            completed: progress.topicsAdded,
            action: "Add",
        },
        {
            id: "generatedInfo",
            title: "Generate Post",
            shortTitle: "Generate",
            description: "Create draft",
            icon: Sparkles,
            href: "/dashboard",
            completed: progress.generatedInfo,
            action: "Generate",
        },
        {
            id: "postPublished",
            title: "Publish Post",
            shortTitle: "Publish",
            description: "Go live",
            icon: Send,
            href: "/dashboard/posts",
            completed: progress.postPublished,
            action: "Publish",
        },
    ];

    // Find the index of the first incomplete step
    const activeStepIndex = steps.findIndex((step) => !step.completed);
    // If all completed, activeIndex is -1, so we default to last step or a success state
    const effectiveActiveIndex = activeStepIndex === -1 ? steps.length : activeStepIndex;

    const completedCount = steps.filter((step) => step.completed).length;
    const isAllComplete = completedCount === steps.length;

    useEffect(() => {
        const dismissed = localStorage.getItem("micropost_getting_started_dismissed");
        // Only show if NOT dismissed AND NOT complete
        if (!dismissed && !isAllComplete) {
            setIsVisible(true);
        }
    }, [isAllComplete]);

    useEffect(() => {
        if (isAllComplete && isVisible) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isAllComplete, isVisible]);

    const handleDismiss = () => {
        localStorage.setItem("micropost_getting_started_dismissed", "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <>
            {showConfetti && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />}

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <Card className="border-outline-variant/40 bg-surface shadow-sm overflow-hidden relative">
                    {/* Progress Track Background */}
                    <div className="absolute bottom-0 left-0 h-1 bg-surface-variant/20 w-full" />
                    <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-primary z-10"
                        initial={{ width: 0 }}
                        animate={{ width: `${(completedCount / steps.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />

                    <div className="p-4 sm:p-5 flex flex-col md:flex-row items-center gap-6">
                        {/* Header Section (Left) */}
                        <div className="flex items-center gap-4 min-w-[180px] border-b md:border-b-0 md:border-r border-outline-variant/20 pb-4 md:pb-0 md:pr-6 w-full md:w-auto justify-between md:justify-start">
                            <div>
                                <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider flex items-center gap-2">
                                    Getting Started
                                    {isAllComplete && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Done!</span>}
                                </h3>
                                <p className="text-xs text-on-surface-variant mt-1">
                                    {completedCount} of {steps.length} steps completed
                                </p>
                            </div>
                            <Button
                                variant="text"
                                size="icon"
                                onClick={handleDismiss}
                                className="text-on-surface-variant hover:text-on-surface h-8 w-8 md:hidden"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Steps Stepper (Right / Main) */}
                        <div className="flex-1 w-full flex items-center justify-between md:justify-start gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                            {steps.map((step, index) => {
                                const isActive = index === effectiveActiveIndex;
                                const isCompleted = step.completed;

                                return (
                                    <div
                                        key={step.id}
                                        className={cn(
                                            "flex items-center gap-3 transition-all duration-300",
                                            isActive ? "flex-[2] min-w-[200px]" : "flex-shrink-0"
                                        )}
                                    >
                                        {/* Step Circle/Icon */}
                                        <div
                                            className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 border",
                                                isCompleted ? "bg-primary border-primary text-on-primary" :
                                                    isActive ? "bg-surface border-primary text-primary ring-2 ring-primary/20" :
                                                        "bg-surface-container border-outline-variant text-on-surface-variant"
                                            )}
                                        >
                                            {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                                        </div>

                                        {/* Expanded Content for Active Step */}
                                        {isActive && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex-1 whitespace-nowrap"
                                            >
                                                <h4 className="text-sm font-semibold text-on-surface">{step.title}</h4>
                                                <p className="text-xs text-on-surface-variant">{step.description}</p>
                                            </motion.div>
                                        )}

                                        {/* Action Button for Active Step */}
                                        {isActive && (
                                            <Link href={step.href}>
                                                <Button size="sm" className="h-8 px-3 text-xs bg-primary text-on-primary hover:bg-primary/90 shadow-sm whitespace-nowrap">
                                                    {step.action}
                                                    <ArrowRight className="w-3 h-3 ml-1.5" />
                                                </Button>
                                            </Link>
                                        )}

                                        {/* Divider Line (except last) */}
                                        {index < steps.length - 1 && !isActive && (
                                            <div className={cn(
                                                "h-px w-4 md:w-8 transition-colors duration-300",
                                                isCompleted ? "bg-primary/50" : "bg-outline-variant/30"
                                            )} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop Close Button */}
                        <Button
                            variant="text"
                            size="icon"
                            onClick={handleDismiss}
                            className="hidden md:flex text-on-surface-variant hover:text-on-surface h-8 w-8 flex-shrink-0 ml-2"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </>
    );
}
