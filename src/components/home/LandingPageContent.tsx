"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    ArrowRight,
    Sparkles,
    Mail,
    Share2,
    PenTool,
    Zap,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    ShieldCheck,
    Check,
    Eye,
    Target,
    Youtube,
    User,
    Send,
    Heart,
    Maximize2,
    Magnet,
    Wand2,
    Languages,
    Layers,
    UserCog,
    Eraser,
    MessageCircle,
    Image as ImageIcon
} from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useRef } from "react";

interface LandingPageContentProps {
    productIds: {
        pro: string;
        agencyMonthly: string;
        agencyYearly: string;
    }
}

export function LandingPageContent({ productIds }: LandingPageContentProps) {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

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
        <main className="flex-1 overflow-x-hidden">
            {/* H E R O   S E C T I O N */}
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

            {/* P R O B L E M   V S   S O L U T I O N */}
            <section className="py-24 px-6 bg-surface-variant/30">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">

                        {/* Old Way */}
                        <div className="space-y-6 opacity-70">
                            <h3 className="text-2xl font-bold text-on-surface-variant flex items-center gap-2">
                                <XCircle className="text-error" /> The Old Way
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-lg text-on-surface-variant/80">
                                    <span className="text-error font-bold">×</span> Staring at a blank cursor for 20 mins
                                </li>
                                <li className="flex gap-3 text-lg text-on-surface-variant/80">
                                    <span className="text-error font-bold">×</span> Forgetting to post for 3 weeks straight
                                </li>
                                <li className="flex gap-3 text-lg text-on-surface-variant/80">
                                    <span className="text-error font-bold">×</span> Posting generic "ChatGPT" sounding noise
                                </li>
                                <li className="flex gap-3 text-lg text-on-surface-variant/80">
                                    <span className="text-error font-bold">×</span> Zero engagement, zero growth
                                </li>
                            </ul>
                        </div>

                        {/* New Way (Highlight) */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-surface p-8 rounded-3xl shadow-xl border border-primary/10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary" />
                            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2 mb-6">
                                <CheckCircle className="text-green-500" /> The Micropost Way
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-lg text-on-surface">
                                    <span className="text-green-500 font-bold">✓</span> <span className="font-semibold">Viral Frameworks:</span> PAS, AIDA, and Storytelling modes.
                                </li>
                                <li className="flex gap-3 text-lg text-on-surface">
                                    <span className="text-green-500 font-bold">✓</span> <span className="font-semibold">Multi-platform:</span> Twitter, LinkedIn, and Threads.
                                </li>
                                <li className="flex gap-3 text-lg text-on-surface">
                                    <span className="text-green-500 font-bold">✓</span> <span className="font-semibold">Idea to Image:</span> Generate visuals on the fly.
                                </li>
                                <li className="flex gap-3 text-lg text-on-surface">
                                    <span className="text-green-500 font-bold">✓</span> <span className="font-semibold">Actual Growth:</span> Consistent posting = visibility.
                                </li>
                            </ul>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* F E A T U R E   D E E P   D I V E */}
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

            {/* F R E E   T O O L S */}
            <section className="py-24 px-6 bg-surface-variant/20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl font-bold text-on-surface">Free Tools for Creators</h2>
                        <p className="text-on-surface-variant max-w-xl mx-auto">
                            Don't just take our word for it. Try these free utilities to boost your social game immediately.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Tool 1: LinkedIn Previewer */}
                        <Link href="/tools/linkedin-previewer">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-primary/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Eye className="h-24 w-24 -mr-8 -mt-8 text-primary" />
                                </div>
                                <div className="h-14 w-14 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                                    <Eye className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">LinkedIn Previewer</h3>
                                <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                    See exactly where your post gets cut off. Optimize your hook before you hit publish.
                                </p>
                                <div className="flex items-center text-primary font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                    Try it free <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>

                        {/* Tool 2: Professional Translator */}
                        <Link href="/tools/professional-translator">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-secondary/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Languages className="h-24 w-24 -mr-8 -mt-8 text-secondary" />
                                </div>
                                <div className="h-14 w-14 bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/20 rounded-2xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-secondary/10">
                                    <Languages className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Professional Translator</h3>
                                <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                    Turn your raw thoughts into office-safe corporate speak. Powered by AI.
                                </p>
                                <div className="flex items-center text-secondary font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                    Translate Text <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>

                        {/* Tool 3: Content Pillar Generator */}
                        <Link href="/tools/content-pillar-generator">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-tertiary/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Layers className="h-24 w-24 -mr-8 -mt-8 text-tertiary" />
                                </div>
                                <div className="h-14 w-14 bg-gradient-to-br from-tertiary/20 to-tertiary/5 border border-tertiary/20 rounded-2xl flex items-center justify-center text-tertiary mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-tertiary/10">
                                    <Layers className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Content Pillar Generator</h3>
                                <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                    Get 5 unique content pillars and topic ideas for any niche in seconds.
                                </p>
                                <div className="flex items-center text-tertiary font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                    Generate Pillars <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>

                        {/* Tool 4: YouTube Summarizer */}
                        <Link href="/tools/youtube-summarizer">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-red-500/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Youtube className="h-24 w-24 -mr-8 -mt-8 text-red-500" />
                                </div>
                                <div className="h-14 w-14 bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-red-500/10">
                                    <Youtube className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">YouTube to Thread</h3>
                                <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                    Turn long videos into viral Twitter threads. Paste a URL, get a thread.
                                </p>
                                <div className="flex items-center text-red-600 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                    Summarize Video <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>
                        {/* Tool 5: Viral Hook Generator */}
                        <Link href="/tools/viral-hooks">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-purple-500/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Magnet className="h-24 w-24 -mr-8 -mt-8 text-purple-500" />
                                </div>
                                <div className="h-14 w-14 bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/10">
                                    <Magnet className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Viral Hook Generator</h3>
                                <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                    Stop the scroll. Generate 10+ psychologically triggered hooks for any topic.
                                </p>
                                <div className="flex items-center text-purple-600 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                    Generate Hooks <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>
                        <Link href="/tools/bio-optimizer">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <UserCog className="h-24 w-24 -mr-8 -mt-8 text-blue-500" />
                                </div>
                                <div className="h-14 w-14 bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10">
                                    <UserCog className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">AI Bio Optimizer</h3>
                                <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                    Craft the perfect social media bio for Twitter, LinkedIn, and Instagram.
                                </p>
                                <div className="flex items-center text-blue-600 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                    Optimize Bio <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>
                        <Link href="/tools/buzzword-killer">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-yellow-500/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Eraser className="h-24 w-24 -mr-8 -mt-8 text-yellow-500" />
                                </div>
                                <div className="h-14 w-14 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-600 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-yellow-500/10">
                                    <Eraser className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Buzzword Killer</h3>
                                <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                    Identify toxic corporate jargon and replace it with punchy, human alternatives.
                                </p>
                                <div className="flex items-center text-yellow-600 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                    Kill Jargon <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>
                        <Link href="/tools/cold-dm-writer">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Send className="h-24 w-24 -mr-8 -mt-8 text-indigo-500" />
                                </div>
                                <div className="h-14 w-14 bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/10">
                                    <Send className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Cold DM Writer</h3>
                                <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                    Generate 3 high-response cold outreach scripts to pitch your services.
                                </p>
                                <div className="flex items-center text-indigo-600 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                    Write DM <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>
                        <Link href="/tools/feature-to-benefit">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-pink-500/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Wand2 className="h-24 w-24 -mr-8 -mt-8 text-pink-500" />
                                </div>
                                <div className="h-14 w-14 bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-500/20 rounded-2xl flex items-center justify-center text-pink-600 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/10">
                                    <Wand2 className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Feature to Benefit</h3>
                                <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                    Turn boring technical specs into irresistible emotional marketing copy.
                                </p>
                                <div className="flex items-center text-pink-600 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                    Convert Copy <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>
                        <Link href="/tools/tweet-to-linkedin-expander">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-blue-700/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Maximize2 className="h-24 w-24 -mr-8 -mt-8 text-blue-700" />
                                </div>
                                <div className="h-14 w-14 bg-gradient-to-br from-blue-700/20 to-blue-700/5 border border-blue-700/20 rounded-2xl flex items-center justify-center text-blue-700 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-700/10">
                                    <Maximize2 className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Tweet to LinkedIn</h3>
                                <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                    Expand short tweets into high-performing, formatted LinkedIn posts.
                                </p>
                                <div className="flex items-center text-blue-700 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                    Expand Post <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>
                        <Link href="/tools/comment-reply-assistant">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-green-500/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <MessageCircle className="h-24 w-24 -mr-8 -mt-8 text-green-500" />
                                </div>
                                <div className="h-14 w-14 bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/10">
                                    <MessageCircle className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Reply Assistant</h3>
                                <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                    Engagement is key. Generate funny, grateful, or engaging replies instantly.
                                </p>
                                <div className="flex items-center text-green-600 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                    Generate Reply <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>
                        <Link href="/tools/youtube-thumbnail-title">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/40 hover:shadow-xl hover:shadow-red-600/10 transition-all cursor-pointer group h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <ImageIcon className="h-24 w-24 -mr-8 -mt-8 text-red-600" />
                                </div>
                                <div className="h-14 w-14 bg-gradient-to-br from-red-600/20 to-red-600/5 border border-red-600/20 rounded-2xl flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-red-600/10">
                                    <ImageIcon className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Thumbnail Text</h3>
                                <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                                    Get more clicks. Generate short, punchy text overlays for your video thumbnails.
                                </p>
                                <div className="flex items-center text-red-600 font-medium text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                                    Generate Text <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/tools">
                            <Button variant="outlined" size="lg" className="rounded-full">
                                View All Free Tools
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* P R I C I N G */}
            <section className="py-24 px-6 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-secondary/5 blur-[100px] rounded-full -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-7xl mx-auto"
                >
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-bold tracking-tight text-on-surface">Fair & Simple Pricing</h2>
                        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                            Start for free, upgrade when you go viral.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {/* Free Tier */}
                        <Card className="border-outline-variant/40 bg-surface h-full flex flex-col hover:border-outline-variant/60 transition-colors">
                            <CardHeader>
                                <CardTitle className="text-xl font-medium text-on-surface-variant">Free</CardTitle>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-on-surface">$0</span>
                                    <span className="text-on-surface-variant ml-2">/ forever</span>
                                </div>
                                <CardDescription className="pt-2">
                                    For hobbyists.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-3 pt-4">
                                    <li className="flex items-start gap-3 text-on-surface-variant">
                                        <Check className="h-5 w-5 text-on-surface-variant shrink-0" />
                                        <span>5 Posts per month</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-on-surface-variant">
                                        <Check className="h-5 w-5 text-on-surface-variant shrink-0" />
                                        <span>Access to Free Tools</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-on-surface-variant">
                                        <Check className="h-5 w-5 text-on-surface-variant shrink-0" />
                                        <span>Basic Formatting</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <div className="p-6 pt-0 mt-auto">
                                <Link href="/login">
                                    <Button variant="outlined" className="w-full h-12 text-base">
                                        Start Free
                                    </Button>
                                </Link>
                            </div>
                        </Card>

                        {/* Pro Plan */}
                        <Card className="border-outline-variant/40 bg-surface h-full flex flex-col hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <CardTitle className="text-xl font-medium text-on-surface-variant">Pro</CardTitle>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-on-surface">$29</span>
                                    <span className="text-on-surface-variant ml-2">/ month</span>
                                </div>
                                <CardDescription className="pt-2">
                                    For solo creators.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-3 pt-4">
                                    <li className="flex items-start gap-3 text-on-surface-variant">
                                        <Check className="h-5 w-5 text-primary shrink-0" />
                                        <span>3 Posts per day</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-on-surface-variant">
                                        <Check className="h-5 w-5 text-primary shrink-0" />
                                        <span>Basic Analytics</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-on-surface-variant">
                                        <Check className="h-5 w-5 text-primary shrink-0" />
                                        <span>Unlimited Topic Gen</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <div className="p-6 pt-0 mt-auto">
                                <Link href={`/checkout/${productIds.pro}`}>
                                    <Button variant="outlined" className="w-full h-12 text-base">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </Card>

                        {/* Agency Monthly */}
                        <Card className="border-primary bg-primary/5 h-full flex flex-col relative overflow-hidden transform md:scale-105 shadow-xl z-10">
                            <div className="absolute top-0 right-0 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-bl-xl">
                                MOST POPULAR
                            </div>
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-primary">Agency</CardTitle>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-on-surface">$99</span>
                                    <span className="text-on-surface-variant ml-2">/ month</span>
                                </div>
                                <CardDescription className="pt-2">
                                    Ultimate power & video tools.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-3 pt-4">
                                    <li className="flex items-start gap-3 text-on-surface">
                                        <Check className="h-5 w-5 text-primary shrink-0" />
                                        <span><b>Unlimited</b> Posts</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-on-surface">
                                        <Check className="h-5 w-5 text-primary shrink-0" />
                                        <span><b>ShortsMaker</b> (Video)</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-on-surface">
                                        <Check className="h-5 w-5 text-primary shrink-0" />
                                        <span>Advanced Analytics</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-on-surface">
                                        <Check className="h-5 w-5 text-primary shrink-0" />
                                        <span>Commercial Usage Rights</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <div className="p-6 pt-0 mt-auto">
                                <Link href={`/checkout/${productIds.agencyMonthly}`}>
                                    <Button variant="filled" className="w-full h-12 text-base shadow-primary/25 shadow-lg">
                                        Subscribe Now
                                    </Button>
                                </Link>
                            </div>
                        </Card>

                        {/* Agency Yearly */}
                        <Card className="border-tertiary/50 bg-tertiary/5 h-full flex flex-col relative overflow-hidden hover:border-tertiary transition-colors">
                            <div className="absolute top-0 right-0 bg-tertiary text-on-tertiary text-xs font-bold px-3 py-1 rounded-bl-xl">
                                BEST VALUE
                            </div>
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-tertiary">Agency Yearly</CardTitle>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-on-surface">$399</span>
                                    <span className="text-on-surface-variant ml-2">/ year</span>
                                </div>
                                <CardDescription className="pt-2">
                                    Founder's Deal (Limited Time).
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-3 pt-4">
                                    <li className="flex items-start gap-3 text-on-surface-variant">
                                        <Check className="h-5 w-5 text-tertiary shrink-0" />
                                        <span><b>Everything in Agency</b></span>
                                    </li>
                                    <li className="flex items-start gap-3 text-on-surface-variant">
                                        <Check className="h-5 w-5 text-tertiary shrink-0" />
                                        <span>4 Months Free</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-on-surface-variant">
                                        <Check className="h-5 w-5 text-tertiary shrink-0" />
                                        <span>Founder Badge</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-on-surface-variant">
                                        <Check className="h-5 w-5 text-tertiary shrink-0" />
                                        <span>Priority Support</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <div className="p-6 pt-0 mt-auto">
                                <Link href={`/checkout/${productIds.agencyYearly}`}>
                                    <Button variant="outlined" className="w-full h-12 text-base border-tertiary/50 text-tertiary hover:bg-tertiary/10">
                                        Get Yearly Deal
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                </motion.div>
            </section>

            {/* C T A   S E C T I O N */}
            <section className="py-24 px-6 bg-primary text-on-primary text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-white/20 blur-[150px] rounded-full" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto relative z-10 space-y-8"
                >
                    <h2 className="text-5xl md:text-6xl font-bold tracking-tight">Ready to dominate your niche?</h2>
                    <p className="text-xl text-primary-container/90 max-w-2xl mx-auto">
                        Join 5,000+ creators using Micropost to automate their growth.
                        <br />
                        <span className="opacity-80 text-lg">No credit card required. Free basic tier available.</span>
                    </p>
                    <div className="flex justify-center flex-col sm:flex-row gap-4 pt-4">
                        <Link href="/login">
                            <Button size="lg" variant="tonal" className="h-16 px-10 text-xl w-full sm:w-auto font-bold shadow-xl shadow-black/20 hover:scale-105 transition-transform">
                                Start for Free
                            </Button>
                        </Link>
                        <a href="https://calendly.com/a-husen21/introduction-call" target="_blank" rel="noopener noreferrer">
                            <Button size="lg" variant="text" className="h-16 px-10 text-xl w-full sm:w-auto text-on-primary hover:bg-on-primary/10 hover:text-on-primary">
                                Book a Demo
                            </Button>
                        </a>
                    </div>
                </motion.div>
            </section>

        </main >
    );
}
