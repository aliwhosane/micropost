"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import {
    Mic2,
    PenTool,
    Link2,
    Twitter,
    Linkedin,
    AtSign,
    Check,
    Plus,
    ArrowRight,
    Sparkles,
    Loader2,
} from "lucide-react";
import { analyzeStyleFromText, completeOnboarding } from "@/actions/onboarding";
import { addTopic, analyzeSocialStyleAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

/* ─── Constants ─────────────────────────────────────────────────── */

const STEPS = [
    { id: "voice", label: "Your Voice" },
    { id: "topics", label: "Topics" },
    { id: "connect", label: "Accounts" },
] as const;

const TONES = ["Professional", "Casual", "Witty", "Storyteller", "Contrarian"] as const;

const PRESET_TOPICS = [
    "AI & ML",
    "Startups",
    "Marketing",
    "Leadership",
    "Product",
    "Design",
    "Engineering",
    "Sales",
    "Remote Work",
    "Personal Growth",
    "Web3",
    "SaaS",
];

/* ─── Animation Variants ────────────────────────────────────────── */

const pageVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 60 : -60,
        opacity: 0,
        scale: 0.98,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -60 : 60,
        opacity: 0,
        scale: 0.98,
    }),
};

const chipVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    tap: { scale: 0.92 },
};

/* ─── Types ─────────────────────────────────────────────────────── */

interface OnboardingWizardProps {
    initialConnected: {
        twitter: boolean;
        linkedin: boolean;
        threads: boolean;
    };
}

/* ─── Component ─────────────────────────────────────────────────── */

export function OnboardingWizard({ initialConnected }: OnboardingWizardProps) {
    const router = useRouter();

    // Step navigation
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(1);

    // Step 1 — Voice
    const [writingSample, setWritingSample] = useState("");
    const [analyzedStyle, setAnalyzedStyle] = useState("");
    const [selectedTone, setSelectedTone] = useState("Professional");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Step 2 — Topics
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [customTopicInput, setCustomTopicInput] = useState("");

    // Step 3 — Connections (read from prop)
    const connected = initialConnected;

    // Finishing
    const [isFinishing, setIsFinishing] = useState(false);

    /* ─── Handlers ───────────────────────────────────────────────── */

    const goTo = useCallback((step: number) => {
        setDirection(step > currentStep ? 1 : -1);
        setCurrentStep(step);
    }, [currentStep]);

    const next = useCallback(() => {
        if (currentStep < STEPS.length - 1) {
            setDirection(1);
            setCurrentStep((s) => s + 1);
        }
    }, [currentStep]);

    // Step 1 — Analyze pasted text
    const handleAnalyzeText = async () => {
        if (writingSample.trim().length < 50) {
            toast.error("Please write at least 50 characters so we can analyze your style.");
            return;
        }
        setIsAnalyzing(true);
        try {
            const description = await analyzeStyleFromText(writingSample);
            setAnalyzedStyle(description);
            toast.success("Your writing style has been analyzed!");
        } catch {
            toast.error("Analysis failed. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Step 1 — Analyze from Twitter
    const handleTwitterAnalyze = async () => {
        try {
            await signIn("twitter", { callbackUrl: window.location.href });
        } catch {
            toast.error("Twitter connection failed.");
        }
    };

    // Step 2 — Toggle a topic
    const toggleTopic = (topic: string) => {
        setSelectedTopics((prev) =>
            prev.includes(topic)
                ? prev.filter((t) => t !== topic)
                : [...prev, topic]
        );
    };

    // Step 2 — Add custom topic
    const addCustomTopic = () => {
        const trimmed = customTopicInput.trim();
        if (!trimmed) return;
        if (selectedTopics.includes(trimmed)) {
            toast.error("Topic already added.");
            return;
        }
        setSelectedTopics((prev) => [...prev, trimmed]);
        setCustomTopicInput("");
    };

    // Step 3 — Connect social
    const handleConnect = (provider: string) => {
        signIn(provider, { callbackUrl: window.location.href });
    };

    // Finish onboarding
    const handleFinish = async () => {
        setIsFinishing(true);
        try {
            // Save topics
            for (const topic of selectedTopics) {
                const fd = new FormData();
                fd.set("topic", topic);
                await addTopic(fd);
            }
            // Complete onboarding
            await completeOnboarding(selectedTone.toLowerCase(), writingSample || undefined);
            window.location.reload();
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsFinishing(false);
        }
    };

    const canContinueStep1 = analyzedStyle.length > 0 || writingSample.trim().length >= 50;
    const canContinueStep2 = selectedTopics.length >= 1;

    /* ─── Render ─────────────────────────────────────────────────── */

    return (
        <div className="fixed inset-0 z-[100] bg-background overflow-y-auto">
            {/* Subtle gradient background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/[0.03] rounded-full blur-3xl" />
            </div>

            <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
                {/* ─── Progress Indicator ─────────────────────────── */}
                <div className="flex items-center gap-0 mb-12">
                    {STEPS.map((step, i) => (
                        <div key={step.id} className="flex items-center">
                            {/* Dot */}
                            <button
                                onClick={() => i < currentStep && goTo(i)}
                                className="flex flex-col items-center gap-2 group"
                                disabled={i > currentStep}
                            >
                                <motion.div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 border-2",
                                        i < currentStep
                                            ? "bg-primary border-primary text-on-primary"
                                            : i === currentStep
                                                ? "bg-primary/10 border-primary text-primary animate-pulse"
                                                : "bg-surface-variant/30 border-outline-variant/40 text-on-surface-variant"
                                    )}
                                    whileHover={i < currentStep ? { scale: 1.1 } : {}}
                                >
                                    {i < currentStep ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        i + 1
                                    )}
                                </motion.div>
                                <span
                                    className={cn(
                                        "text-xs font-medium transition-colors",
                                        i <= currentStep
                                            ? "text-on-surface"
                                            : "text-on-surface-variant/50"
                                    )}
                                >
                                    {step.label}
                                </span>
                            </button>

                            {/* Connector line */}
                            {i < STEPS.length - 1 && (
                                <div className="w-16 sm:w-24 h-0.5 mx-2 mb-6 relative overflow-hidden rounded-full bg-outline-variant/20">
                                    <motion.div
                                        className="absolute inset-y-0 left-0 bg-primary rounded-full"
                                        initial={{ width: "0%" }}
                                        animate={{
                                            width: i < currentStep ? "100%" : "0%",
                                        }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* ─── Step Content ────────────────────────────────── */}
                <div className="w-full max-w-xl">
                    <AnimatePresence mode="wait" custom={direction}>
                        {/* ━━━ STEP 1: Learn Your Voice ━━━ */}
                        {currentStep === 0 && (
                            <motion.div
                                key="step-voice"
                                custom={direction}
                                variants={pageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                                <div className="text-center mb-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.1 }}
                                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4"
                                    >
                                        <Mic2 className="w-8 h-8 text-primary" />
                                    </motion.div>
                                    <h1 className="text-3xl font-bold text-on-surface mb-2">
                                        Let&apos;s learn how you write.
                                    </h1>
                                    <p className="text-on-surface-variant text-base max-w-md mx-auto">
                                        Your AI ghostwriter needs to understand your unique voice.
                                        The more it knows, the more authentic your posts will sound.
                                    </p>
                                </div>

                                {/* Option A: Paste writing */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-on-surface mb-2">
                                            Option A: Paste your writing
                                        </label>
                                        <Textarea
                                            placeholder="Paste your best LinkedIn post, tweet, or any writing sample here..."
                                            className="min-h-[140px] text-base"
                                            value={writingSample}
                                            onChange={(e) => setWritingSample(e.target.value)}
                                            disabled={isAnalyzing}
                                        />
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-on-surface-variant">
                                                {writingSample.length} / 50 min characters
                                            </span>
                                            <Button
                                                onClick={handleAnalyzeText}
                                                disabled={isAnalyzing || writingSample.trim().length < 50}
                                                variant="tonal"
                                                size="sm"
                                            >
                                                {isAnalyzing ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                                        Analyzing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-4 h-4 mr-1" />
                                                        Analyze My Style
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Loading shimmer */}
                                    {isAnalyzing && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="rounded-2xl border border-outline-variant/20 p-6 overflow-hidden relative"
                                        >
                                            <div className="space-y-3">
                                                <div className="h-4 bg-surface-variant/50 rounded-full w-3/4 animate-pulse" />
                                                <div className="h-4 bg-surface-variant/50 rounded-full w-full animate-pulse" />
                                                <div className="h-4 bg-surface-variant/50 rounded-full w-2/3 animate-pulse" />
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Analysis result */}
                                    {analyzedStyle && !isAnalyzing && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 12, scale: 0.97 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6"
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <Sparkles className="w-4 h-4 text-primary" />
                                                <span className="text-sm font-semibold text-primary">
                                                    Your writing style
                                                </span>
                                            </div>
                                            <p className="text-on-surface text-base leading-relaxed italic border-l-2 border-primary/30 pl-4">
                                                &ldquo;{analyzedStyle}&rdquo;
                                            </p>
                                        </motion.div>
                                    )}

                                    {/* Divider */}
                                    <div className="flex items-center gap-4 py-2">
                                        <div className="flex-1 h-px bg-outline-variant/20" />
                                        <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
                                            or
                                        </span>
                                        <div className="flex-1 h-px bg-outline-variant/20" />
                                    </div>

                                    {/* Option B: Twitter analysis */}
                                    <button
                                        onClick={handleTwitterAnalyze}
                                        className="w-full flex items-center gap-4 p-4 rounded-2xl border border-outline-variant/20 hover:border-primary/30 hover:bg-primary/[0.03] transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-[#1DA1F2]/10 flex items-center justify-center flex-shrink-0">
                                            <Twitter className="w-6 h-6 text-[#1DA1F2]" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <div className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                                                Analyze from Twitter
                                            </div>
                                            <div className="text-sm text-on-surface-variant">
                                                Connect your Twitter and auto-analyze your writing style
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                                    </button>

                                    {/* Tone selector */}
                                    {(analyzedStyle || writingSample.trim().length >= 50) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15 }}
                                        >
                                            <label className="block text-sm font-medium text-on-surface mb-3">
                                                Preferred tone
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {TONES.map((tone) => (
                                                    <motion.button
                                                        key={tone}
                                                        onClick={() => setSelectedTone(tone)}
                                                        whileTap={{ scale: 0.93 }}
                                                        className={cn(
                                                            "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                                            selectedTone === tone
                                                                ? "bg-primary text-on-primary border-primary shadow-md"
                                                                : "bg-surface-variant/20 text-on-surface-variant border-outline-variant/20 hover:border-primary/30 hover:bg-primary/[0.04]"
                                                        )}
                                                    >
                                                        {tone}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Continue */}
                                    <div className="flex justify-end pt-4">
                                        <Button
                                            onClick={next}
                                            disabled={!canContinueStep1}
                                            className="bg-primary text-on-primary px-8"
                                        >
                                            Continue
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ━━━ STEP 2: Choose Your Topics ━━━ */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step-topics"
                                custom={direction}
                                variants={pageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                                <div className="text-center mb-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.1 }}
                                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4"
                                    >
                                        <PenTool className="w-8 h-8 text-primary" />
                                    </motion.div>
                                    <h1 className="text-3xl font-bold text-on-surface mb-2">
                                        What should we write about?
                                    </h1>
                                    <p className="text-on-surface-variant text-base max-w-md mx-auto">
                                        Pick 2–3 topics your AI ghostwriter will focus on.
                                        You can always add more later.
                                    </p>
                                </div>

                                {/* Topic chips */}
                                <div className="flex flex-wrap gap-2.5 justify-center mb-6">
                                    {PRESET_TOPICS.map((topic, i) => {
                                        const isSelected = selectedTopics.includes(topic);
                                        return (
                                            <motion.button
                                                key={topic}
                                                variants={chipVariants}
                                                initial="initial"
                                                animate="animate"
                                                whileTap="tap"
                                                transition={{ delay: i * 0.03 }}
                                                onClick={() => toggleTopic(topic)}
                                                className={cn(
                                                    "px-5 py-2.5 rounded-full text-sm font-medium transition-all border",
                                                    isSelected
                                                        ? "bg-primary text-on-primary border-primary shadow-lg shadow-primary/20"
                                                        : "bg-surface-variant/20 text-on-surface-variant border-outline-variant/20 hover:border-primary/30 hover:bg-primary/[0.04]"
                                                )}
                                            >
                                                {isSelected && <Check className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />}
                                                {topic}
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {/* Custom topic */}
                                <div className="flex gap-2 max-w-sm mx-auto mb-8">
                                    <div className="flex-1">
                                        <Input
                                            placeholder=" "
                                            label="Add your own topic"
                                            value={customTopicInput}
                                            onChange={(e) => setCustomTopicInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && addCustomTopic()}
                                        />
                                    </div>
                                    <Button
                                        onClick={addCustomTopic}
                                        variant="tonal"
                                        size="icon"
                                        className="h-14 w-14 flex-shrink-0"
                                        disabled={!customTopicInput.trim()}
                                    >
                                        <Plus className="w-5 h-5" />
                                    </Button>
                                </div>

                                {/* Selected count */}
                                {selectedTopics.length > 0 && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center text-sm text-on-surface-variant mb-4"
                                    >
                                        {selectedTopics.length} topic{selectedTopics.length !== 1 ? "s" : ""} selected
                                    </motion.p>
                                )}

                                {/* Continue */}
                                <div className="flex justify-end pt-2">
                                    <Button
                                        onClick={next}
                                        disabled={!canContinueStep2}
                                        className="bg-primary text-on-primary px-8"
                                    >
                                        Continue
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* ━━━ STEP 3: Connect Your Accounts ━━━ */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step-connect"
                                custom={direction}
                                variants={pageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                                <div className="text-center mb-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.1 }}
                                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4"
                                    >
                                        <Link2 className="w-8 h-8 text-primary" />
                                    </motion.div>
                                    <h1 className="text-3xl font-bold text-on-surface mb-2">
                                        Where should we publish?
                                    </h1>
                                    <p className="text-on-surface-variant text-base max-w-md mx-auto">
                                        Connect your social accounts to enable one-click publishing.
                                        You can always do this later in Settings.
                                    </p>
                                </div>

                                <div className="space-y-3 max-w-sm mx-auto">
                                    {([
                                        {
                                            id: "twitter",
                                            label: "Twitter / X",
                                            icon: Twitter,
                                            color: "text-[#1DA1F2]",
                                            bgColor: "bg-[#1DA1F2]/10",
                                        },
                                        {
                                            id: "linkedin",
                                            label: "LinkedIn",
                                            icon: Linkedin,
                                            color: "text-[#0A66C2]",
                                            bgColor: "bg-[#0A66C2]/10",
                                        },
                                        {
                                            id: "threads",
                                            label: "Threads",
                                            icon: AtSign,
                                            color: "text-on-surface",
                                            bgColor: "bg-surface-variant/30",
                                        },
                                    ] as const).map((platform, i) => {
                                        const isConnected = connected[platform.id];
                                        return (
                                            <motion.button
                                                key={platform.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.08 }}
                                                onClick={() => !isConnected && handleConnect(platform.id)}
                                                disabled={isConnected}
                                                className={cn(
                                                    "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all",
                                                    isConnected
                                                        ? "border-primary/30 bg-primary/[0.04] cursor-default"
                                                        : "border-outline-variant/20 hover:border-primary/30 hover:bg-primary/[0.03] cursor-pointer"
                                                )}
                                            >
                                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", platform.bgColor)}>
                                                    <platform.icon className={cn("w-6 h-6", platform.color)} />
                                                </div>
                                                <span className="font-semibold text-on-surface flex-1 text-left">
                                                    {platform.label}
                                                </span>
                                                {isConnected ? (
                                                    <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                                                        <Check className="w-4 h-4" />
                                                        Connected
                                                    </span>
                                                ) : (
                                                    <span className="text-sm font-medium text-primary flex items-center gap-1">
                                                        Connect
                                                        <ArrowRight className="w-4 h-4" />
                                                    </span>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {/* Finish */}
                                <div className="flex items-center justify-between mt-10 max-w-sm mx-auto">
                                    <Button
                                        variant="text"
                                        onClick={handleFinish}
                                        disabled={isFinishing}
                                        className="text-on-surface-variant"
                                    >
                                        Skip for now
                                    </Button>
                                    <Button
                                        onClick={handleFinish}
                                        disabled={isFinishing}
                                        className="bg-primary text-on-primary px-8"
                                    >
                                        {isFinishing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                Finishing...
                                            </>
                                        ) : (
                                            <>
                                                Go to Dashboard
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
