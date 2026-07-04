"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Heart,
    MessageCircle,
    Repeat2,
    Bookmark,
    BarChart2,
    Check,
    Twitter,
    Linkedin,
    AtSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

// A real post demo that types out character by character
function TypingDemo() {
    const posts = [
        {
            platform: "twitter",
            handle: "@yourhandle",
            content:
                "Most founders burn out trying to be consistent on social media.\n\nThe secret isn't discipline — it's systems.\n\nI post every day across 3 platforms. Takes me 5 minutes.\n\nHere's the framework I use:",
            engagement: { replies: 23, reposts: 147, likes: 892, views: "12.4K" },
        },
        {
            platform: "linkedin",
            handle: "Your Name",
            content:
                "I spent 6 months posting every day on LinkedIn.\n\nHere's what nobody tells you about growing a personal brand:\n\n→ Consistency beats creativity\n→ Frameworks beat blank pages\n→ Your voice matters more than your vocabulary\n\nThe game changed when I stopped writing from scratch.",
            engagement: { comments: 34, reposts: 89, likes: 567, impressions: "8.2K" },
        },
    ];

    const [activePost, setActivePost] = useState(0);
    const [displayedChars, setDisplayedChars] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const currentPost = posts[activePost];

    useEffect(() => {
        setDisplayedChars(0);
        setIsComplete(false);

        const content = posts[activePost].content;
        let charIndex = 0;

        const interval = setInterval(() => {
            charIndex++;
            // Move word-by-word for speed
            while (
                charIndex < content.length &&
                content[charIndex] !== " " &&
                content[charIndex] !== "\n"
            ) {
                charIndex++;
            }
            setDisplayedChars(charIndex);

            if (charIndex >= content.length) {
                clearInterval(interval);
                setIsComplete(true);
                // Auto-switch to next post after a pause
                setTimeout(() => {
                    setActivePost((prev) => (prev + 1) % posts.length);
                }, 3000);
            }
        }, 40);

        return () => clearInterval(interval);
    }, [activePost]);

    const displayedText = currentPost.content.slice(0, displayedChars);

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Platform tabs */}
            <div className="flex gap-1 mb-3 px-1">
                {[
                    { id: 0, icon: Twitter, label: "X" },
                    { id: 1, icon: Linkedin, label: "LinkedIn" },
                ].map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => setActivePost(id)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                            activePost === id
                                ? "bg-primary/15 text-primary"
                                : "text-on-surface-variant/50 hover:text-on-surface-variant"
                        )}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Post card */}
            <div className="rounded-2xl border border-outline-variant/30 bg-surface shadow-xl shadow-black/5 overflow-hidden">
                {/* Post header */}
                <div className="flex items-center gap-3 p-4 pb-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-tertiary/60" />
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-on-surface">
                                {currentPost.handle}
                            </span>
                            <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                            </svg>
                        </div>
                        <span className="text-xs text-on-surface-variant/60">Just now</span>
                    </div>
                </div>

                {/* Post content */}
                <div className="p-4 min-h-[140px]">
                    <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">
                        {displayedText}
                        {!isComplete && (
                            <span className="inline-block w-[2px] h-[14px] bg-primary ml-0.5 align-text-bottom animate-pulse" />
                        )}
                    </p>
                </div>

                {/* Engagement bar — fades in when typing completes */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isComplete ? 1 : 0 }}
                    className="flex items-center justify-between px-4 py-3 border-t border-outline-variant/10"
                >
                    {currentPost.platform === "twitter" ? (
                        <>
                            <span className="flex items-center gap-1.5 text-xs text-on-surface-variant/60">
                                <MessageCircle className="w-4 h-4" /> {currentPost.engagement.replies}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-on-surface-variant/60">
                                <Repeat2 className="w-4 h-4" /> {currentPost.engagement.reposts}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-on-surface-variant/60">
                                <Heart className="w-4 h-4" /> {currentPost.engagement.likes}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-on-surface-variant/60">
                                <BarChart2 className="w-4 h-4" /> {currentPost.engagement.views}
                            </span>
                            <Bookmark className="w-4 h-4 text-on-surface-variant/40" />
                        </>
                    ) : (
                        <>
                            <span className="flex items-center gap-1.5 text-xs text-on-surface-variant/60">
                                👍 {currentPost.engagement.likes}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-on-surface-variant/60">
                                💬 {currentPost.engagement.comments}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-on-surface-variant/60">
                                🔁 {currentPost.engagement.reposts}
                            </span>
                        </>
                    )}
                </motion.div>
            </div>

            {/* "AI Generated" badge */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isComplete ? 1 : 0, y: isComplete ? 0 : 10 }}
                className="flex justify-center mt-4"
            >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                    <Check className="w-3 h-3" />
                    Written in your voice by AI — took 3 seconds
                </span>
            </motion.div>
        </div>
    );
}

// Stats that count up
function AnimatedStat({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-on-surface tabular-nums">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="text-xs text-on-surface-variant/60 mt-1">{label}</div>
        </div>
    );
}

export function HeroSection() {
    return (
        <section className="relative pt-28 pb-20 px-6 lg:px-8 overflow-hidden">
            {/* Subtle background — no giant pulsing blobs */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/8 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-tertiary/6 blur-[100px] rounded-full -z-10" />

            <div className="max-w-6xl mx-auto">
                {/* Two-column layout: Copy left, Demo right */}
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left — Copy */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div className="space-y-5">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-on-surface leading-[1.1]">
                                Your ideas,{" "}
                                <span className="text-primary">published daily</span>
                                <br />
                                — without the grind.
                            </h1>
                            <p className="text-lg text-on-surface-variant max-w-lg leading-relaxed">
                                Micropost learns how you write, then ghostwrites social posts 
                                that actually sound like you. Across Twitter, LinkedIn, and Threads.
                                Every day. On autopilot.
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start">
                            <Link href="/auth">
                                <Button
                                    size="lg"
                                    className="rounded-xl h-13 px-8 text-base shadow-md shadow-primary/15 hover:shadow-primary/25 transition-shadow"
                                >
                                    Try it free <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <span className="text-xs text-on-surface-variant/50 self-center">
                                No credit card required
                            </span>
                        </div>

                        {/* Social proof — real numbers, not logos */}
                        <div className="flex gap-8 pt-4">
                            <AnimatedStat value={5200} label="creators" suffix="+" />
                            <AnimatedStat value={140} label="posts generated daily" suffix="K" />
                            <AnimatedStat value={94} label="sound-like-you rate" suffix="%" />
                        </div>
                    </motion.div>

                    {/* Right — Live Product Demo */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <TypingDemo />
                    </motion.div>
                </div>

                {/* Platform support line */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-center items-center gap-6 mt-20 pt-10 border-t border-outline-variant/10"
                >
                    <span className="text-xs text-on-surface-variant/40 uppercase tracking-widest">
                        Works with
                    </span>
                    {[
                        { icon: Twitter, label: "X / Twitter" },
                        { icon: Linkedin, label: "LinkedIn" },
                        { icon: AtSign, label: "Threads" },
                    ].map(({ icon: Icon, label }) => (
                        <span
                            key={label}
                            className="flex items-center gap-1.5 text-sm text-on-surface-variant/50"
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
