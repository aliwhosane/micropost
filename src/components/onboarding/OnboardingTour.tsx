"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Sparkles,
    Clapperboard,
    Flame,
    X,
    ChevronRight,
    ChevronLeft,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const onboardingSteps = [
    {
        id: "welcome",
        title: "Welcome to Micropost",
        description: "Your all-in-one platform for effortless social media content creation and management.",
        icon: null, // No icon for welcome screen, maybe a larger logo or illustration
    },
    {
        id: "dashboard",
        title: "Your Dashboard",
        description: "Get a bird's-eye view of your content performance and quick access to all your tools.",
        icon: LayoutDashboard,
    },
    {
        id: "tools",
        title: "AI Power Tools",
        description: "Generate viral hooks, summaries, bio optimizations, and more with our suite of AI tools.",
        icon: Sparkles,
    },
    {
        id: "shortsmaker",
        title: "Shorts Maker",
        description: "Create engaging short-form videos from your existing content in seconds.",
        icon: Clapperboard,
    },
    {
        id: "trends",
        title: "TrendSurfer",
        description: "Stay ahead of the curve by discovering the latest trends in your niche.",
        icon: Flame,
    },
];

export function OnboardingTour() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    useEffect(() => {
        const hasCompletedOnboarding = localStorage.getItem("micropost_onboarding_completed");
        if (!hasCompletedOnboarding) {
            // Small delay to not overwhelm the user immediately
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleNext = () => {
        if (currentStepIndex < onboardingSteps.length - 1) {
            setCurrentStepIndex((prev) => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex((prev) => prev - 1);
        }
    };

    const handleComplete = () => {
        localStorage.setItem("micropost_onboarding_completed", "true");
        setIsOpen(false);
    };

    if (!isOpen) return null;

    const currentStep = onboardingSteps[currentStepIndex];
    const isLastStep = currentStepIndex === onboardingSteps.length - 1;
    const progress = ((currentStepIndex + 1) / onboardingSteps.length) * 100;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-surface border border-outline-variant/20 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden relative"
                    >
                        {/* Progress Bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-surface-variant">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={handleComplete}
                            className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20 rounded-full transition-colors"
                            aria-label="Skip onboarding"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8 pt-12 text-center">
                            {/* Icon Animation */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep.id}
                                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                                    transition={{ duration: 0.4, type: "spring" }}
                                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"
                                >
                                    {currentStep.icon ? (
                                        <currentStep.icon className="w-10 h-10" />
                                    ) : (
                                        <div className="text-3xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                                            M
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Content */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h2 className="text-2xl font-bold text-on-surface mb-3">
                                        {currentStep.title}
                                    </h2>
                                    <p className="text-on-surface-variant text-base leading-relaxed mb-8">
                                        {currentStep.description}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            {/* Actions */}
                            <div className="flex items-center justify-between mt-auto">
                                <Button
                                    variant="text"
                                    onClick={handleComplete}
                                    className="text-on-surface-variant hover:text-on-surface"
                                >
                                    Skip
                                </Button>

                                <div className="flex gap-3">
                                    {currentStepIndex > 0 && (
                                        <Button
                                            variant="tonal"
                                            onClick={handlePrevious}
                                            className="px-4"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1" />
                                            Back
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleNext}
                                        className="px-6 bg-primary text-on-primary hover:bg-primary/90"
                                    >
                                        {isLastStep ? (
                                            <>
                                                Get Started
                                                <Check className="w-4 h-4 ml-2" />
                                            </>
                                        ) : (
                                            <>
                                                Next
                                                <ChevronRight className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
