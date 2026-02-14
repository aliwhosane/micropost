"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Clock, Mail, Wand2, Image as ImageIcon } from "lucide-react";

export function FeaturesSection() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

    return (
        <section className="py-32 px-6" ref={targetRef}>
            <motion.div className="max-w-6xl mx-auto space-y-32">

                {/* Feature 1 */}
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div style={{ opacity, scale }} className="order-2 md:order-1 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl -z-10 rounded-full" />
                        <div className="bg-surface border border-outline-variant/40 rounded-2xl p-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="flex gap-2 mb-4">
                                <div className="h-3 w-3 rounded-full bg-red-400" />
                                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                                <div className="h-3 w-3 rounded-full bg-green-400" />
                            </div>
                            <div className="space-y-4 font-mono text-sm opacity-80">
                                <p className="text-primary">{">"} Analyzing writing style...</p>
                                <p className="text-tertiary">{">"} Detected: "Witty, Professional, Concise"</p>
                                <p className="text-on-surface">Generating 5 post variations...</p>
                            </div>
                        </div>
                    </motion.div>
                    <div className="order-1 md:order-2 space-y-6">
                        <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight">Baked-in Virality.</h2>
                        <p className="text-xl text-on-surface-variant leading-relaxed">
                            Don't guess. Use proven frameworks like <b>PAS</b>, <b>AIDA</b>, and <b>Storytelling</b> to hook readers instantly. We analyzed 1M+ viral posts to teach our AI how to write for engagement.
                        </p>
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <div className="h-12 w-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                            <Clock className="h-6 w-6" />
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight">Your Morning Brief.</h2>
                        <p className="text-xl text-on-surface-variant leading-relaxed">
                            Wake up to a fresh batch of drafted posts in your dashboard (or inbox).
                            One click to <b>Approve</b>, <b>Edit</b>, or <b>Regenerate</b>. You stay in control, but without the effort.
                        </p>
                    </div>
                    <motion.div style={{ opacity, scale }} className="relative">
                        <div className="absolute inset-0 bg-gradient-to-bl from-secondary/20 to-transparent blur-3xl -z-10 rounded-full" />
                        <div className="bg-surface border border-outline-variant/10 rounded-2xl p-6 shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-4 mb-4 border-b border-outline-variant/20 pb-4">
                                <Mail className="text-secondary h-6 w-6" />
                                <div>
                                    <div className="font-bold">Your Daily Drafts are Ready</div>
                                    <div className="text-xs opacity-60">8:00 AM • Micropost AI</div>
                                </div>
                            </div>
                            <div className="h-2 w-3/4 bg-outline-variant/20 rounded mb-2" />
                            <div className="h-2 w-full bg-outline-variant/20 rounded mb-2" />
                            <div className="h-2 w-1/2 bg-outline-variant/20 rounded" />
                            <div className="mt-4 flex gap-2">
                                <div className="h-8 w-20 bg-primary/20 rounded" />
                                <div className="h-8 w-20 bg-outline-variant/20 rounded" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Feature 3: Idea to Image */}
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div style={{ opacity, scale }} className="order-2 md:order-1 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent blur-3xl -z-10 rounded-full" />
                        <div className="bg-surface border border-outline-variant/10 rounded-2xl p-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 group">
                            <div className="space-y-4">
                                <div className="flex gap-2 items-center text-sm font-mono text-on-surface-variant/80 bg-surface-variant/50 p-3 rounded-lg">
                                    <Wand2 className="h-4 w-4 text-purple-500" />
                                    <span>"Cyberpunk developer setup with neon lights..."</span>
                                </div>
                                <div className="aspect-video bg-surface-variant rounded-lg overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ImageIcon className="h-12 w-12 text-purple-500/50 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="absolute bottom-2 right-2 flex gap-1">
                                        <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <div className="order-1 md:order-2 space-y-6">
                        <div className="h-12 w-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                            <ImageIcon className="h-6 w-6" />
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight">Stop Scroll with AI Images.</h2>
                        <p className="text-xl text-on-surface-variant leading-relaxed">
                            Turn abstract ideas into stunning visuals for LinkedIn and Threads. No design skills needed. Just describe it, and we'll generate it.
                        </p>
                    </div>
                </div>

            </motion.div>
        </section>
    );
}
