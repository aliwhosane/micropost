"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 40 } as any }
    };

    return (
        <section className="relative pt-32 pb-48 px-6 lg:px-8">
            {/* Background Ambient Effects */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[130px] rounded-full -z-10 animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-tertiary/20 blur-[100px] rounded-full -z-10" />

            <motion.div
                className="max-w-5xl mx-auto text-center space-y-10"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-variant/50 border border-primary/20 text-primary text-sm font-medium shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <Sparkles className="h-4 w-4 fill-primary" />
                    <span>New: The All-In-One Viral Engine is Here</span>
                </motion.div>

                <motion.h1
                    className="text-6xl md:text-8xl font-bold tracking-tighter text-on-surface leading-[1.05]"
                    variants={item}
                >
                    Stop Writing. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-primary bg-[length:200%_auto] animate-gradient">
                        Start Growing.
                    </span>
                </motion.h1>

                <motion.p
                    className="text-xl md:text-2xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed"
                    variants={item}
                >
                    The AI ghostwriter that actually <b>learns your voice</b>. Creates viral threads, LinkedIn posts, and visuals in seconds.
                    <br />
                    <span className="text-on-surface font-semibold">Consistently viral, automatically.</span>
                </motion.p>

                <motion.div variants={item} className="flex flex-col sm:flex-row justify-center gap-4 pt-8 items-center">
                    <Link href="/login">
                        <Button size="lg" className="rounded-full h-16 px-12 text-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                            Start for Free <ArrowRight className="ml-2 h-6 w-6" />
                        </Button>
                    </Link>
                    <p className="text-sm text-on-surface-variant/60 mt-4 sm:mt-0 sm:absolute sm:-bottom-8">
                        * No credit card required. Free basic tier available.
                    </p>
                </motion.div>

                {/* Social Proof Mini-Bar */}
                <motion.div variants={item} className="pt-16 grayscale opacity-60 flex justify-center gap-12 items-center flex-wrap">
                    {/* Placeholders for logos (Text for now) */}
                    <span className="text-xl font-bold font-mono">X (Twitter)</span>
                    <span className="text-xl font-bold font-mono">LinkedIn</span>
                    <span className="text-xl font-bold font-mono">Threads</span>
                    <span className="text-xl font-bold font-mono">Instagram</span>
                </motion.div>
            </motion.div>
        </section>
    );
}
