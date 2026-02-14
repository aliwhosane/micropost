"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    Check,
    Sparkles,
    Twitter,
    Linkedin,
    AtSign, // Threads
    Wand2,
    MessageSquare,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";
import { completeOnboarding, saveAnalyzedTone, analyzeStyleFromText } from "@/actions/onboarding";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const STEPS = [
    {
        id: "connect",
        title: "Where do you post?",
        description: "Connect your accounts to tailor the content length and format."
    },
    {
        id: "analyze",
        title: "Sound like You",
        description: "Let's analyze your writing style to create a custom voice."
    },
    {
        id: "tone",
        title: "Set your Vibe",
        description: "Choose a default tone for your daily posts."
    }
];

const TONES = [
    { id: "professional", label: "Professional", emoji: "👔", desc: "Clean, corporate, authoritative." },
    { id: "casual", label: "Casual", emoji: "☕", desc: "Friendly, relaxed, conversational." },
    { id: "witty", label: "Witty", emoji: "⚡", desc: "Clever, humorous, punchy." },
    { id: "storyteller", label: "Storyteller", emoji: "📖", desc: "Engaging, narrative-driven." },
    { id: "contrarian", label: "Contrarian", emoji: "🌶️", desc: "Bold, challenging, thought-provoking." },
];

interface OnboardingWizardProps {
    initialConnected?: {
        twitter: boolean;
        linkedin: boolean;
        threads: boolean;
    };
}

export function OnboardingWizard({ initialConnected = { twitter: false, linkedin: false, threads: false } }: OnboardingWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [styleSample, setStyleSample] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [selectedTone, setSelectedTone] = useState("professional");

    // We use the prop as the initial state, but we don't strictly need state for connections 
    // if we are redirecting. However, for UI stability:
    const connected = initialConnected;

    const router = useRouter();

    const handleNext = async () => {
        if (currentStep === 0) {
            const hasConnection = Object.values(connected).some(Boolean);
            if (!hasConnection) {
                toast.error("Please connect at least one account to continue.");
                return;
            }
        }

        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            await handleFinish();
        }
    };

    const handleFinish = async () => {
        try {
            await completeOnboarding(selectedTone, styleSample);
            // Force reload to update server components checking for onboarding status
            window.location.reload();
        } catch (error) {
            console.error("Failed to complete onboarding", error);
            toast.error("Failed to save preferences.");
        }
    };

    const handleAnalyze = async () => {
        if (!styleSample.trim() || styleSample.length < 50) {
            toast.error("Please provide a longer sample (at least 50 chars).");
            return;
        }
        setAnalyzing(true);
        try {
            const description = await analyzeStyleFromText(styleSample);
            setStyleSample(description);
            toast.success("Analysis complete! Review the description below.");
        } catch (error) {
            console.error("Analysis failed", error);
            toast.error("Failed to analyze style.");
        } finally {
            setAnalyzing(false);
        }
    };

    const handleConnect = (providerId: string) => {
        if (connected[providerId as keyof typeof connected]) {
            return;
        }
        // Redirect to sign in
        signIn(providerId, { callbackUrl: "/dashboard" });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-2xl">
                {/* Progress */}
                <div className="flex justify-between mb-8 px-2">
                    {STEPS.map((step, idx) => (
                        <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                                idx <= currentStep
                                    ? "bg-primary text-on-primary shadow-lg ring-2 ring-primary/20"
                                    : "bg-surface-variant text-on-surface-variant"
                            )}>
                                {idx < currentStep ? <Check className="w-4 h-4 ml-0.5" /> : idx + 1}
                            </div>
                            <span className={cn(
                                "text-xs font-medium transition-colors duration-300",
                                idx <= currentStep ? "text-on-surface" : "text-on-surface-variant/50"
                            )}>{step.title}</span>
                        </div>
                    ))}
                    {/* Track */}
                    <div className="absolute top-[18px] left-0 w-full h-0.5 bg-surface-variant -z-0" />
                    <div
                        className="absolute top-[18px] left-0 h-0.5 bg-primary transition-all duration-300 -z-0"
                        style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="p-8 border-outline shadow-xl bg-surface/50 backdrop-blur-xl">
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-on-surface mb-2">{STEPS[currentStep].title}</h1>
                                <p className="text-on-surface-variant">{STEPS[currentStep].description}</p>
                            </div>

                            {/* STEP 1: CONNECT */}
                            {currentStep === 0 && (
                                <div className="space-y-4 max-w-sm mx-auto">
                                    {[
                                        { id: "twitter", label: "Twitter / X", icon: Twitter },
                                        { id: "linkedin", label: "LinkedIn", icon: Linkedin },
                                        { id: "threads", label: "Threads", icon: AtSign },
                                    ].map((platform) => {
                                        const isConnected = connected[platform.id as keyof typeof connected];
                                        return (
                                            <button
                                                key={platform.id}
                                                onClick={() => handleConnect(platform.id)}
                                                disabled={isConnected}
                                                className={cn(
                                                    "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                                                    isConnected
                                                        ? "border-primary bg-primary/5 cursor-default"
                                                        : "border-outline hover:border-outline-variant hover:bg-surface-variant/20"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <platform.icon className={cn(
                                                        "w-5 h-5",
                                                        isConnected ? "text-primary" : "text-on-surface-variant"
                                                    )} />
                                                    <span className="font-medium text-on-surface">{platform.label}</span>
                                                </div>
                                                {isConnected ? (
                                                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
                                                        <Check className="w-5 h-5" />
                                                        Connected
                                                    </div>
                                                ) : (
                                                    <span className="text-sm font-medium text-primary">Connect</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* STEP 2: ANALYZE */}
                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    <div className="bg-surface-variant/10 rounded-xl p-4 border border-outline/50">
                                        <div className="flex items-center gap-2 mb-2 text-sm text-primary font-medium">
                                            <Sparkles className="w-4 h-4" />
                                            AI Style Matcher
                                        </div>
                                        <Textarea
                                            placeholder="Paste 2-3 of your best performing posts here..."
                                            className="min-h-[150px] bg-transparent border-0 focus-visible:ring-0 text-base resize-none"
                                            value={styleSample}
                                            onChange={(e) => setStyleSample(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button
                                            onClick={handleAnalyze}
                                            disabled={analyzing || styleSample.length < 50}
                                            variant="tonal"
                                            className="flex-1"
                                        >
                                            {analyzing ? (
                                                <>Analyzing... <Sparkles className="w-4 h-4 ml-2 animate-pulse" /></>
                                            ) : (
                                                <>Analyze Text <Sparkles className="w-4 h-4 ml-2" /></>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={handleNext}
                                            disabled={analyzing || styleSample.length < 10}
                                            className="flex-1"
                                        >
                                            Save & Continue <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: TONE */}
                            {currentStep === 2 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {TONES.map((tone) => (
                                        <button
                                            key={tone.id}
                                            onClick={() => setSelectedTone(tone.id)}
                                            className={cn(
                                                "relative p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02]",
                                                selectedTone === tone.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-outline hover:border-primary/50"
                                            )}
                                        >
                                            <div className="text-2xl mb-2">{tone.emoji}</div>
                                            <div className="font-bold text-on-surface mb-1">{tone.label}</div>
                                            <div className="text-xs text-on-surface-variant">{tone.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Footer Nav */}
                            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-outline/20">
                                {currentStep !== 1 && ( // Step 1 uses specific button
                                    <Button onClick={handleNext} className="bg-primary text-on-primary rounded-full px-8">
                                        {currentStep === STEPS.length - 1 ? "Finish Setup" : "Next"}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
